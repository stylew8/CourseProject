using backend.ViewModels.DTOs;

namespace backend.Services.Interfaces;

public interface IAdminService
{
    Task<List<UserDto>> GetAllUsersAsync();
    Task BlockUsersAsync(List<string> userIds);
    Task UnblockUsersAsync(List<string> userIds);
    Task SetRoleForUsersAsync(List<string> userIds, string role);
    Task DeleteUsersAsync(List<string> userIds);
}