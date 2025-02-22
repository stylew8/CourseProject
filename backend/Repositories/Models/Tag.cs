namespace backend.Repositories.Models;

public class Tag : Entity
{
    public string Name { get; set; }
    public ICollection<TemplateTag> TemplateTags { get; set; } = new List<TemplateTag>();
}