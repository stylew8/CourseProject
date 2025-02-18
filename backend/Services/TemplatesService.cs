using backend.Repositories.Models;
using backend.Repositories;
using backend.ViewModels.DTOs;
using Newtonsoft.Json.Linq;
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
        var template = await _templatesRepository.GetTemplateByIdFullAsync(id);
        return template;
    }

    public async Task<Template> UpdateTemplateAsync(int id, TemplateDto dto)
    {
        var template = await _templatesRepository.GetTemplateByIdFullAsync(id);
        if (template == null)
            throw new NotFoundException("Template not found");

        await _templatesRepository.UpdateTemplateAsync(template, dto);
        return template;
    }

    public async Task<int> SubmitFormAsync(int templateId, SubmitFormDto dto)
    {
        var template = await _templatesRepository.GetTemplateWithQuestionsAsync(templateId);
        if (template == null)
            throw new NotFoundException("Template not found");

        var filledForm = new FilledForm
        {
            TemplateId = templateId,
            SubmittedAt = DateTime.UtcNow,
        };

        foreach (var kvp in dto.Answers)
        {
            if (!int.TryParse(kvp.Key, out int questionId))
                continue;

            var question = template.Questions.FirstOrDefault(q => q.Id == questionId);
            if (question == null)
                continue;

            string answerValue = string.Empty;

            if (kvp.Value is JArray jArray)
            {
                var list = jArray.ToObject<List<string>>();
                answerValue = string.Join(",", list);
            }
            else
            {
                answerValue = kvp.Value?.ToString();
            }

            filledForm.Answers.Add(new AnswerSnapshot
            {
                QuestionId = questionId,
                QuestionTextSnapshot = question.Text,
                AnswerValue = answerValue
            });
        }

        await _templatesRepository.AddFilledFormAsync(filledForm);
        return filledForm.Id;
    }
}