using Microsoft.AspNetCore.Identity;

namespace backend.Repositories.Models;

public class TemplateUser : Entity
{
    public int TemplateId { get; set; }
    public Template Template { get; set; }

    public string UserId { get; set; }
    public IdentityUser User { get; set; }
}