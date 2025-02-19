using System.Text.Json.Serialization;

namespace backend.ViewModels.DTOs;

public class EditFilledFormDto
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public List<EditQuestionAnswerDto> Questions { get; set; } = new();
}

public class EditQuestionAnswerDto
{
    public int QuestionId { get; set; }
    public string QuestionTextSnapshot { get; set; }
    public string QuestionOptionsSnapshot { get; set; }

    [JsonPropertyName("answerValue")]
    public string AnswerValue { get; set; }

    [JsonPropertyName("answer")]
    public string Answer
    {
        get => AnswerValue;
        set => AnswerValue = value;
    }

    public string QuestionType { get; set; }
    public List<string> Options { get; set; } = new();
}