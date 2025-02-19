using backend.Repositories;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;
using backend.ViewModels.DTOs;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Infastructure.Helpers;

namespace backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IUserInformationRepository _userInformationRepository;

        public AdminService(
            IAdminRepository adminRepository,
            UserManager<IdentityUser> userManager,
            IUserInformationRepository userInformationRepository)
        {
            _adminRepository = adminRepository;
            _userManager = userManager;
            _userInformationRepository = userInformationRepository;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _adminRepository.GetAllUsersAsync();
            var userDtos = new List<UserDto>();

            var userInformations = await _userInformationRepository.GetAllUserInformationAsync();

            foreach (var u in users)
            {
                var rolesForUser = await _userManager.GetRolesAsync(u);
                var roles = rolesForUser.Any() ? string.Join(", ", rolesForUser) : RolesConstants.User;

                userDtos.Add(new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    Role = roles,
                    FirstName = userInformations.FirstOrDefault(x=>x.UserId == u.Id).FirstName,
                    LastName = userInformations.FirstOrDefault(x => x.UserId == u.Id).LastName,
                    Status = u.LockoutEnd.HasValue && u.LockoutEnd.Value > 
                        System.DateTimeOffset.UtcNow ?
                        StatusConstants.Blocked : 
                        StatusConstants.Active
                });
            }

            return userDtos;
        }

        public async Task BlockUsersAsync(List<string> userIds)
        {
            foreach (var id in userIds)
            {
                await _adminRepository.BlockUserAsync(id);
            }
        }

        public async Task UnblockUsersAsync(List<string> userIds)
        {
            foreach (var id in userIds)
            {
                await _adminRepository.UnblockUserAsync(id);
            }
        }

        public async Task SetRoleForUsersAsync(List<string> userIds, string role)
        {
            foreach (var id in userIds)
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user != null)
                {
                    var currentRoles = await _userManager.GetRolesAsync(user);
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    await _userManager.AddToRoleAsync(user, role);
                }
            }
        }

        public async Task DeleteUsersAsync(List<string> userIds)
        {
            foreach (var id in userIds)
            {
                await _adminRepository.DeleteUserAsync(id);
            }
        }
    }
}
