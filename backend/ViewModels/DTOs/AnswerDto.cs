namespace backend.ViewModels.DTOs;

public class AnswerDto
{
    public int QuestionId { get; set; }
    public string QuestionTextSnapshot { get; set; }
    public string AnswerValue { get; set; }
}