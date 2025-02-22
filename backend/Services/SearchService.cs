using backend.Repositories.Interfaces;
using backend.Services.Interfaces;
using backend.ViewModels.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class SearchService : ISearchService
{
    private readonly ISearchRepository _searchRepository;

    public SearchService(ISearchRepository searchRepository)
    {
        _searchRepository = searchRepository;
    }

    public async Task<List<TagDto>> SearchTags(string query)
    {
        var tags = await _searchRepository.SearchTagsAsync(query);
        return tags.Select(t => new TagDto(t.Id, t.Name)).ToList();
    }

    public async Task<List<UserDto>> SearchUsers(string query)
    {
        var users = await _searchRepository.SearchUsersAsync(query);
        return users.Select(u => new UserDto()
        {
            Id = u.Id,
            UserName = u.UserName,
            Email = u.Email
        }).ToList();
    }

}