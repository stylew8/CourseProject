using backend.Repositories.Models;
using backend.Services.Interfaces;
using backend.ViewModels;
using System;
using Microsoft.EntityFrameworkCore;
using TemplateModel = backend.Repositories.Models.Template;
using MySql.Data.MySqlClient;


namespace backend.Services;

public class TemplateSearchService : ITemplateSearchService
{
    private readonly AppDbContext _context;
    private static readonly HashSet<string> AllowedSortValues = new HashSet<string>
    {
        "titleAsc", "titleDesc", "dateAsc", "dateDesc", "relevance"
    };

    public TemplateSearchService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SearchResult> SearchTemplatesAsync(string query, string sort, int page, int pageSize)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new SearchResult { Templates = new List<TemplateModel>(), TotalCount = 0 };
        }

        if (!AllowedSortValues.Contains(sort))
        {
            sort = "relevance";
        }

        var templates = await Task.Run(() =>
            _context.Templates
                .FromSqlInterpolated($"CALL sp_SearchTemplatesList({query}, {sort}, {page}, {pageSize})")
                .AsNoTracking()
                .AsEnumerable()
                .ToList());

        var countResult = await Task.Run(() =>
            _context.CountResults
                .FromSqlInterpolated($"CALL sp_SearchTemplatesCount({query})")
                .AsNoTracking()
                .AsEnumerable()
                .FirstOrDefault());

        int totalCount = countResult?.TotalCount ?? 0;

        return new SearchResult
        {
            Templates = templates,
            TotalCount = totalCount
        };
    }
}