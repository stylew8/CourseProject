using backend.Repositories.Models;
using backend.Services.Interfaces;
using backend.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Nest;
using Microsoft.EntityFrameworkCore;
using TemplateModel = backend.Repositories.Models.Template;
using MySql.Data.MySqlClient;


namespace backend.Services;

public class TemplateSearchService : ITemplateSearchService
{
    private readonly AppDbContext _context;
    public TemplateSearchService(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<SearchResult> SearchTemplatesAsync(string query, string sort, int page, int pageSize)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new SearchResult { Templates = new List<TemplateModel>(), TotalCount = 0 };
        }

        int offset = (page - 1) * pageSize;

        string orderClause = sort switch
        {
            "titleAsc" => "ORDER BY t.Title ASC",
            "titleDesc" => "ORDER BY t.Title DESC",
            "dateAsc" => "ORDER BY t.CreatedAt ASC",
            "dateDesc" => "ORDER BY t.CreatedAt DESC",
            _ => "ORDER BY totalScore DESC"
        };

        // Используем именованный параметр @p0 для запроса
        string sql = $@"
            SELECT t.*,
                   (
                        MATCH(t.Title, t.Description) AGAINST (@p0 IN BOOLEAN MODE)
                        + IFNULL(MAX(MATCH(q.Description) AGAINST (@p0 IN BOOLEAN MODE)), 0)
                        + IFNULL(MAX(MATCH(c.Text) AGAINST (@p0 IN BOOLEAN MODE)), 0)
                   ) AS totalScore
            FROM Templates t
            LEFT JOIN Questions q ON q.TemplateId = t.Id
            LEFT JOIN Comments c ON c.TemplateId = t.Id
            WHERE 
                MATCH(t.Title, t.Description) AGAINST (@p0 IN BOOLEAN MODE)
                OR MATCH(q.Description) AGAINST (@p0 IN BOOLEAN MODE)
                OR MATCH(c.Text) AGAINST (@p0 IN BOOLEAN MODE)
            GROUP BY t.Id
            {orderClause}
            LIMIT {offset}, {pageSize};";

        var param = new MySqlParameter("@p0", query);

        var templates = await _context.Templates
            .FromSqlRaw(sql, param)
            .ToListAsync();

        // Запрос для получения общего количества результатов
        string countSql = $@"
            SELECT COUNT(*) 
            FROM (
                SELECT t.Id
                FROM Templates t
                LEFT JOIN Questions q ON q.TemplateId = t.Id
                LEFT JOIN Comments c ON c.TemplateId = t.Id
                WHERE 
                    MATCH(t.Title, t.Description) AGAINST (@p0 IN BOOLEAN MODE)
                    OR MATCH(q.Description) AGAINST (@p0 IN BOOLEAN MODE)
                    OR MATCH(c.Text) AGAINST (@p0 IN BOOLEAN MODE)
                GROUP BY t.Id
            ) AS temp;";

        int totalCount;
        using (var command = _context.Database.GetDbConnection().CreateCommand())
        {
            command.CommandText = countSql;
            command.CommandType = System.Data.CommandType.Text;
            command.Parameters.Add(new MySqlParameter("@p0", query));
            if (command.Connection.State != System.Data.ConnectionState.Open)
                await command.Connection.OpenAsync();
            totalCount = Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        return new SearchResult
        {
            Templates = templates,
            TotalCount = totalCount
        };
    }
}