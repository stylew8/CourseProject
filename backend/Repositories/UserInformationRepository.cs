using backend.Repositories.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

public interface IUserInformationRepository
{
    Task CreateUserInformationAsync(UserInformation userInformation);
    Task<UserInformation> GetUserInformationByUserIdAsync(string userId);
}

public class UserInformationRepository : IUserInformationRepository
{
    private readonly AppDbContext _context;

    public UserInformationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateUserInformationAsync(UserInformation userInformation)
    {
        _context.UserInformations.Add(userInformation);
        await _context.SaveChangesAsync();
    }

    public async Task<UserInformation> GetUserInformationByUserIdAsync(string userId)
    {
        return await _context.UserInformations.FirstOrDefaultAsync(ui => ui.UserId == userId);
    }
}
