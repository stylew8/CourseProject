using backend.Repositories.Models;
using backend.ViewModels.DTOs;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Server.Infrastructure.Exceptions;
using System;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

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

    public async Task<int> SubmitFormAsync(int templateId, SubmitFormDto dto, string userId)
    {
        var template = await _templatesRepository.GetTemplateWithQuestionsAsync(templateId);
        if (template == null)
            throw new NotFoundException("Template not found");

        var filledForm = new FilledForm
        {
            TemplateId = templateId,
            SubmittedAt = DateTime.UtcNow,
            UserId = userId
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

            var optionsDto = question.Options.Select(x => new { x.Order, x.Value });

            filledForm.Answers.Add(new AnswerSnapshot
            {
                QuestionId = questionId,
                QuestionTextSnapshot = question.Text,
                AnswerValue = answerValue,
                QuestionType = question.Type,
                QuestionOptionsSnapshot = JArray.FromObject(optionsDto).ToString()
            });
        }

        await _templatesRepository.AddFilledFormAsync(filledForm);
        return filledForm.Id;
    }

    public async Task<List<Template>> GetLatestTemplatesAsync()
    {
        return await _templatesRepository.GetLatestTemplatesAsync();
    }

    public async Task<List<FilledFormDto>> GetFilledFormsAsync(int templateId)
    {
        var filledForms = await _templatesRepository.GetFilledFormsAsync(templateId);

        var filledFormsDtos = filledForms.Select(form => new FilledFormDto
        {
            Id = form.Id,
            UserName = form.User.UserName ?? "Unknown user",
            Answers = form.Answers.Select(answer => new AnswerDto
            {
                QuestionId = answer.QuestionId,
                QuestionTextSnapshot = answer.QuestionTextSnapshot,
                AnswerValue = answer.AnswerValue
            }).ToList()
        }).ToList();

        return filledFormsDtos;
    }

    public async Task<AggregationResultsDto> GetTemplateResultsAsync(int templateId)
    {
        var filledForms = await _templatesRepository.GetFilledFormsAsync(templateId);
        var aggregationResults = new List<AggregationResultDto>();

        var answerFrequency = GetAnswerFrequency(filledForms);

        aggregationResults = GetAggregationResults(filledForms);

        var mostFrequentAnswers = GetMostFrequentAnswers(answerFrequency);

        var totalAnswers = filledForms.Sum(form => form.Answers.Count);

        return new AggregationResultsDto
        {
            AggregationResults = aggregationResults,
            MostFrequentAnswers = mostFrequentAnswers,
            TotalAnswers = totalAnswers
        };
    }

    private Dictionary<string, int> GetAnswerFrequency(List<FilledForm> filledForms)
    {
        var frequency = new Dictionary<string, int>();

        foreach (var form in filledForms)
        {
            foreach (var answer in form.Answers)
            {
                var key = $"{answer.QuestionId}-{answer.AnswerValue}";
                if (frequency.ContainsKey(key))
                {
                    frequency[key]++;
                }
                else
                {
                    frequency[key] = 1;
                }
            }
        }

        return frequency;
    }

    private List<AggregationResultDto> GetAggregationResults(List<FilledForm> filledForms)
    {
        var results = new List<AggregationResultDto>();

        foreach (var form in filledForms)
        {
            foreach (var answer in form.Answers)
            {
                var existingResult = results.FirstOrDefault(r => r.QuestionId == answer.QuestionId && r.AnswerValue == answer.AnswerValue);
                if (existingResult != null)
                {
                    existingResult.Count++;
                }
                else
                {
                    results.Add(new AggregationResultDto
                    {
                        QuestionId = answer.QuestionId,
                        AnswerValue = answer.AnswerValue,
                        Count = 1
                    });
                }
            }
        }

        return results;
    }

    private List<AggregationResultDto> GetMostFrequentAnswers(Dictionary<string, int> answerFrequency)
    {
        return answerFrequency
            .Select(kvp => new AggregationResultDto
            {
                QuestionId = int.Parse(kvp.Key.Split('-')[0]),
                AnswerValue = kvp.Key.Split('-')[1],
                Count = kvp.Value
            })
            .OrderByDescending(x => x.Count)
            .ToList();
    }
}