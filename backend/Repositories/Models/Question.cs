using System.Text.Json.Serialization;

namespace backend.Repositories.Models
{
    public class Question : Entity
    {
        public int Order { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public string Description { get; set; }
        public bool ShowInTable { get; set; }
        public ICollection<Option> Options { get; set; } = new List<Option>();

        public int TemplateId { get; set; }
        public Template Template { get; set; }
    }
}
