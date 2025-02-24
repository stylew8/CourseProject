using backend.Repositories.Models;

namespace backend.ViewModels;

public class SearchResult
{
    public List<Template> Templates { get; set; }
    public int TotalCount { get; set; }
}