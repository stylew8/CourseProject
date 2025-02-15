using Microsoft.AspNetCore.Identity;

namespace backend.Repositories.Models
{
    public class Template
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<Question> Questions { get; set; } = new List<Question>();

        public string CreatorId { get; set; }
        public IdentityUser Creator { get; set; }
    }
}
