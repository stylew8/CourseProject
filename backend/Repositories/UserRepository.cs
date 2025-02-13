using Microsoft.AspNetCore.Identity;
using Server.Infrastructure.Exceptions;
using System.Threading.Tasks;

public interface IUserRepository
{
    Task<IdentityUser> CreateUserAsync(IdentityUser user, string password);
    Task<IdentityUser> GetUserByIdAsync(string id);
}

public class UserRepository : IUserRepository
{
    private readonly UserManager<IdentityUser> _userManager;

    public UserRepository(UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<IdentityUser> CreateUserAsync(IdentityUser user, string password)
    {
        var result = await _userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            return user;
        }
        else
        {
            var errorMessage = string.Join(Environment.NewLine, result.Errors.Select(e => e.Description));
            throw new RegistrationException(errorMessage);
        }
    }

    public async Task<IdentityUser> GetUserByIdAsync(string id)
    {
        return await _userManager.FindByIdAsync(id);
    }
}
