using backend.ViewModels.DTOs;

namespace backend.Services.Interfaces;

public interface IUserDashboardService
{
    Task<List<TemplateDto>> GetUserTemplatesAsync(string userId);
    Task<List<DashboardFilledFormDto>> GetUserFilledFormsForDashboardAsync(string userId);

}