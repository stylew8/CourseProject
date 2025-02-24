using Microsoft.AspNetCore.Identity;

namespace backend.Repositories.Models;

public class Comment : Entity
{
    public int TemplateId { get; set; }
    public Template Template { get; set; }

    public string UserId { get; set; }
    public IdentityUser User { get; set; }
    public string Text { get; set; }
}