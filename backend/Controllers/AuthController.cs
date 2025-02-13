using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.ViewModels;
using Server.Infrastructure.Exceptions;

namespace backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserInformationRepository _userInformationRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(
            IUserRepository _userRepository,
            IJwtTokenService jwtTokenService,
            IUserInformationRepository userInformationRepository,
            UserManager<IdentityUser> userManager)
        {
            this._userRepository = _userRepository;
            this._jwtTokenService = jwtTokenService;
            this._userInformationRepository = userInformationRepository;
            this._userManager = userManager;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                throw new ValidationException("Invalid input data.");

            if (model.Password != model.ConfirmPassword)
                throw new ValidationException("Passwords do not match.");

            var user = new IdentityUser
            {
                UserName = model.Email,
                Email = model.Email
            };

            var createdUser = await _userRepository.CreateUserAsync(user, model.Password);
            await _userManager.AddToRoleAsync(createdUser, "User");

            var userInfo = new UserInformation
            {
                UserId = createdUser.Id,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            await _userInformationRepository.CreateUserInformationAsync(userInfo);

            // Определяем время жизни токена, например, 1 час (можно изменить или добавить RememberMe)
            var tokenExpiry = TimeSpan.FromHours(1);

            // Используем общий метод для установки cookie
            SignInUser(createdUser, tokenExpiry);

            return Ok(new { message = "User was successfully registered and logged in" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                throw new ValidationException("Invalid input data.");

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                throw new AuthenticationException("Invalid login credentials.");

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenExpiry = model.RememberMe ? TimeSpan.FromDays(7) : TimeSpan.FromHours(1);

            SignInUser(user, tokenExpiry);

            return Ok(new { message = "Login successful" });
        }

        private void SignInUser(IdentityUser user, TimeSpan tokenExpiry)
        {
            // Формирование списка клеймов
            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

            var userRoles = _userManager.GetRolesAsync(user).Result; // Можно сделать асинхронно, если переписать метод SignInUser как async
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Генерация токена
            var token = _jwtTokenService.GenerateToken(authClaims, tokenExpiry);

            // Опции cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.Add(tokenExpiry)
            };

            // Устанавливаем HTTP‑Only cookie
            Response.Cookies.Append("access_token", token, cookieOptions);
        }
    }
}
