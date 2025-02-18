namespace backend.Repositories.Models;

public class FilledForm
{
    public int Id { get; set; }

    public int TemplateId { get; set; }

    public DateTime SubmittedAt { get; set; }

    public List<AnswerSnapshot> Answers { get; set; } = new List<AnswerSnapshot>();
}