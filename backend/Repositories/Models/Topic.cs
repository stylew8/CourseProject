namespace backend.Repositories.Models;

public class Topic : Entity
{
    public string Name { get; set; }
    public ICollection<Template> Templates { get; set; } = new List<Template>();
}