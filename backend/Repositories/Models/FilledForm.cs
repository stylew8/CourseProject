using Microsoft.AspNetCore.Identity;

namespace backend.Repositories.Models;

public class FilledForm
{
    public int Id { get; set; }

    public int TemplateId { get; set; }
    public Template Template { get; set; }

    public string UserId { get; set; }
    public IdentityUser User { get; set; }

    public DateTime SubmittedAt { get; set; }

    public List<AnswerSnapshot> Answers { get; set; } = new List<AnswerSnapshot>();
}