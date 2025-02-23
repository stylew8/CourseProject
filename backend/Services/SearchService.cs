using backend.Repositories.Interfaces;
using backend.Services.Interfaces;
using backend.ViewModels.DTOs;
using Microsoft.AspNetCore.Identity;
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

    public async Task<IdentityUser?> ValidateUserEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return null;

        var normalizedEmail = email.Trim().ToLower();

        var user = await _searchRepository.SearchUserAsync(normalizedEmail);

        return user;
    }
}