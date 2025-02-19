using backend.Repositories.Models;

namespace backend.Repositories.Interfaces;

public interface IUserDashboardRepository
{
    Task<List<Template>> GetUserTemplatesAsync(string userId);
    Task<List<FilledForm>> GetUserFilledFormsAsync(string userId);
}