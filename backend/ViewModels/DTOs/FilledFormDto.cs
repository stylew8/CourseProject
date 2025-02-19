using Microsoft.AspNetCore.Identity;

namespace backend.ViewModels.DTOs;

public class FilledFormDto
{
    public int Id { get; set; }
    public List<AnswerDto> Answers { get; set; }
    public string UserName { get; set; }

    public List<QuestionAnswerDto> Questions { get; set; } = new List<QuestionAnswerDto>();
}