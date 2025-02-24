using backend.ViewModels;

namespace backend.Services.Interfaces;

public interface ITemplateSearchService
{
    Task<SearchResult> SearchTemplatesAsync(string query, string sort, int page, int pageSize);
}