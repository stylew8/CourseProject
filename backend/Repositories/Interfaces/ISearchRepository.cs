using backend.Repositories.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Repositories.Interfaces;

public interface ISearchRepository
{
    Task<List<Tag>> SearchTagsAsync(string query);
    Task<List<IdentityUser>> SearchUsersAsync(string query);
    Task<IdentityUser> SearchUserAsync(string email);
    
}