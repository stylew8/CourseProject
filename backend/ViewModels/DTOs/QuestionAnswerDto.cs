namespace backend.ViewModels.DTOs;

public class QuestionAnswerDto
{
    public int QuestionId { get; set; }
    public string QuestionTextSnapshot { get; set; }
    public string QuestionOptionsSnapshot { get; set; }
    public string AnswerValue { get; set; }
    public string QuestionType { get; set; }
    public List<string> Options { get; set; } = new List<string>();
}