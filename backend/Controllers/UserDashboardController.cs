using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Services.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("dashboard")]
    [Authorize]
    public class UserDashboardController : ControllerBase
    {
        private readonly IUserDashboardService _dashboardService;

        public UserDashboardController(IUserDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("templates")]
        public async Task<IActionResult> GetUserTemplates()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Forbid();

            var templates = await _dashboardService.GetUserTemplatesAsync(userId);
            return Ok(templates);
        }

        [HttpGet("filledforms")]
        public async Task<IActionResult> GetUserFilledForms()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Forbid();

            var filledForms = await _dashboardService.GetUserFilledFormsForDashboardAsync(userId);
            return Ok(filledForms);
        }
    }
}