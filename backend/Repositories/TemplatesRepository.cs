using backend.Repositories.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class TemplatesRepository : ITemplatesRepository
{
    private readonly AppDbContext _context;

    public TemplatesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Template> CreateTemplateAsync(Template template)
    {
        _context.Templates.Add(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task<Template> GetTemplateByIdFullAsync(int id)
    {
        return await _context.Templates
            .Include(t => t.Questions)
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Template> UpdateTemplateAsync(Template template, TemplateDto dto, bool removeOldQuestions = true)
    {
        // Обновляем поля шаблона
        template.Title = dto.Title;
        template.Description = dto.Description;

        if (removeOldQuestions)
        {
            // Удаляем предыдущие вопросы
            _context.Questions.RemoveRange(template.Questions);
            await _context.SaveChangesAsync();
            // Важно сначала сохранить удаление, чтобы избежать конфликтов.
        }

        // Перезаписываем вопросы
        template.Questions = dto.Questions.Select(q => new Question
        {
            Order = q.Order,
            Type = q.Type,
            Text = q.Text,
            Description = q.Description,
            ShowInTable = q.ShowInTable,
            Options = q.Options.Select(o => new Option
            {
                Order = o.Order,
                Value = o.Value
            }).ToList()
        }).ToList();

        // Сохраняем изменения
        await _context.SaveChangesAsync();
        return template;
    }
}