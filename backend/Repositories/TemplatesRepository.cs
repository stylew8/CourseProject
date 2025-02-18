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
        template.Title = dto.Title;
        template.Description = dto.Description;

        if (removeOldQuestions)
        {
            _context.Questions.RemoveRange(template.Questions);
            await _context.SaveChangesAsync();
        }

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

        await _context.SaveChangesAsync();
        return template;
    }

    public async Task<Template> GetTemplateWithQuestionsAsync(int templateId)
    {
        return await _context.Templates
            .Include(t => t.Questions)
            .FirstOrDefaultAsync(t => t.Id == templateId);
    }

    public async Task AddFilledFormAsync(FilledForm filledForm)
    {
        _context.FilledForms.Add(filledForm);
        await _context.SaveChangesAsync();
    }
}