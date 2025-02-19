using backend.Services;
using backend.ViewModels.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Infastructure.Helpers;
using backend.Services.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = RolesConstants.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPut("users/block")]
        public async Task<IActionResult> BlockUsers([FromBody] UserIdsDto dto)
        {
            await _adminService.BlockUsersAsync(dto.UserIds);
            return Ok();
        }

        [HttpPut("users/unblock")]
        public async Task<IActionResult> UnblockUsers([FromBody] UserIdsDto dto)
        {
            await _adminService.UnblockUsersAsync(dto.UserIds);
            return Ok();
        }

        [HttpPut("users/setrole")]
        public async Task<IActionResult> SetRoleForUsers([FromBody] SetUserRoleDto dto)
        {
            await _adminService.SetRoleForUsersAsync(dto.UserIds, dto.Role);
            return Ok();
        }

        [HttpDelete("users")]
        public async Task<IActionResult> DeleteUsers([FromBody] UserIdsDto dto)
        {
            await _adminService.DeleteUsersAsync(dto.UserIds);
            return Ok();
        }
    }
}