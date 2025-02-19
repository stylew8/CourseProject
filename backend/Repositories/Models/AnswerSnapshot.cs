using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Models;

[Owned]
public class AnswerSnapshot
{
    public int QuestionId { get; set; }
    public Question Question { get; set; }

    public string QuestionTextSnapshot { get; set; }
    public string QuestionOptionsSnapshot { get; set; }
    public string AnswerValue { get; set; }

    public string QuestionType { get; set; }
}