using Microsoft.AspNetCore.Identity;

namespace backend.Repositories.Interfaces;

public interface IAdminRepository
{
    Task<List<IdentityUser>> GetAllUsersAsync();
    Task BlockUserAsync(string userId);
    Task UnblockUserAsync(string userId);
    Task DeleteUserAsync(string userId);
}