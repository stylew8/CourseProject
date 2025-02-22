using Microsoft.AspNetCore.Identity;

namespace backend.Repositories.Models
{
    public class Template : Entity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string? PhotoUrl { get; set; }
        public string? AccessType { get; set; }
        public int TopicId { get; set; }
        public Topic Topic { get; set; }
        public string CreatorId { get; set; }
        public IdentityUser Creator { get; set; }
        public ICollection<Question> Questions { get; set; } = new List<Question>();
        public ICollection<TemplateTag> TemplateTags { get; set; } = new List<TemplateTag>();
        public ICollection<TemplateUser> AllowedUsers { get; set; } = new List<TemplateUser>();
    }
}
