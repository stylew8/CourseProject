using backend.Repositories.Models;
using backend.Repositories;
using Server.Infrastructure.Exceptions;

namespace backend.Services;

public class TemplatesService : ITemplatesService
{
    private readonly ITemplatesRepository _templatesRepository;
    private readonly AppDbContext _context;

    public TemplatesService(ITemplatesRepository templatesRepository, AppDbContext context)
    {
        _templatesRepository = templatesRepository;
        _context = context;
    }

    public async Task<Template> CreateTemplateAsync(TemplateDto dto, string creatorId)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var template = new Template
            {
                Title = dto.Title,
                Description = dto.Description,
                CreatorId = creatorId,
                Questions = dto.Questions.Select(q => new Question
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
                }).ToList()
            };

            await _templatesRepository.CreateTemplateAsync(template);
            await transaction.CommitAsync();
            return template;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw new ServerInternalException("Server internal error");
        }
    }

    public async Task<Template> GetTemplateFullAsync(int id)
    {
        var template = await _templatesRepository.GetTemplateByIdFullAsync(id);
        return template;
    }

    public async Task<Template> GetTemplatePublicAsync(int id)
    {
        // Пример: если "публичная" версия шаблона не требует опций, 
        // можно получить без Include, 
        // или вернуть часть полей. Здесь просто вернём полную,
        // а в Controller можно отфильтровать
        var template = await _templatesRepository.GetTemplateByIdFullAsync(id);
        return template;
    }

    public async Task<Template> UpdateTemplateAsync(int id, TemplateDto dto)
    {
        var template = await _templatesRepository.GetTemplateByIdFullAsync(id);
        if (template == null)
            throw new NotFoundException("Template not found");

        // Обновляем через репозиторий
        await _templatesRepository.UpdateTemplateAsync(template, dto);
        return template;
    }
}