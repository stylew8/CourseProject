using backend.ViewModels.DTOs;
using Microsoft.AspNetCore.Identity;

namespace backend.Services.Interfaces;

public interface ISearchService
{
    Task<List<TagDto>> SearchTags(string query);
    Task<List<UserDto>> SearchUsers(string query);
    Task<IdentityUser?> ValidateUserEmail(string email);
}