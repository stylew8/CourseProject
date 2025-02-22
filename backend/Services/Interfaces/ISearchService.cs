using backend.ViewModels.DTOs;

namespace backend.Services.Interfaces;

public interface ISearchService
{
    Task<List<TagDto>> SearchTags(string query);
    Task<List<UserDto>> SearchUsers(string query);
}