using backend.Repositories.Interfaces;
using backend.Repositories.Models;
using backend.Services.Interfaces;
using backend.ViewModels.DTOs;
using Server.Infrastructure.Exceptions;

namespace backend.Services;

public class FilledFormService : IFilledFormService
{
    private readonly IFilledFormRepository _filledFormRepository;

    public FilledFormService(IFilledFormRepository filledFormRepository)
    {
        _filledFormRepository = filledFormRepository;
    }

    public async Task<FilledFormDto> GetFilledFormAsync(int formId)
    {
        var filledForm = await _filledFormRepository.GetFilledFormAsync(formId);
        if (filledForm == null)
            throw new NotFoundException("Filled form not found.");

        var filledFormDto = new FilledFormDto
        {
            Id = filledForm.Id,
            UserName = filledForm.User.UserName,
            Questions = filledForm.Answers.Select(a => new QuestionAnswerDto
            {
                QuestionId = a.QuestionId,
                QuestionTextSnapshot = a.QuestionTextSnapshot,
                QuestionOptionsSnapshot = a.QuestionOptionsSnapshot,
                AnswerValue = a.AnswerValue,
                QuestionType = a.QuestionType,
                Options = a.Question.Options.Select(o => o.Value).ToList()
            }).ToList()
        };

        return filledFormDto;
    }

    public async Task UpdateFilledFormAsync(int formId, EditFilledFormDto filledFormDto)
    {
        var filledForm = await _filledFormRepository.GetFilledFormAsync(formId);
        if (filledForm == null)
            throw new NotFoundException("Filled form not found.");
        
        foreach (var questionAnswer in filledFormDto.Questions)
        {
            var answerSnapshot = filledForm.Answers
                .FirstOrDefault(a => a.QuestionId == questionAnswer.QuestionId);
        
            if (answerSnapshot != null)
            {
                answerSnapshot.AnswerValue = questionAnswer.AnswerValue;
            }
            else
            {
                filledForm.Answers.Add(new AnswerSnapshot
                {
                    QuestionId = questionAnswer.QuestionId,
                    AnswerValue = questionAnswer.AnswerValue,
                    QuestionTextSnapshot = questionAnswer.QuestionTextSnapshot
                });
            }
        }
        
        await _filledFormRepository.SaveChangesAsync();

    }
}