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

            var tokenExpiry = TimeSpan.FromHours(1);

            var userRoles = await _userManager.GetRolesAsync(createdUser);

            SignInUser(createdUser, tokenExpiry, userRoles);

            return Ok(new
            {
                user = new { createdUser.Id, createdUser.Email, createdUser.UserName },
                roles = userRoles
            });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                throw new ValidationException("Invalid input data.");

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
                throw new AuthenticationException("Invalid login credentials.");

            if (await _userManager.IsLockedOutAsync(user))
            {
                throw new AuthenticationException("User account is locked.");
            }

            if (!await _userManager.CheckPasswordAsync(user, model.Password))
            {
                await _userManager.AccessFailedAsync(user);

                if (await _userManager.IsLockedOutAsync(user))
                {
                    throw new AuthenticationException("User account is locked.");
                }

                throw new AuthenticationException("Invalid login credentials.");
            }

            await _userManager.ResetAccessFailedCountAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenExpiry = model.RememberMe ? TimeSpan.FromDays(7) : TimeSpan.FromHours(1);

            var userRoles = await _userManager.GetRolesAsync(user);

            SignInUser(user, tokenExpiry, userRoles);

            return Ok(new
            {
                user = new { user.Id, user.Email, user.UserName },
                roles = userRoles
            });
        }


        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Unauthorized();
            }

            if (await _userManager.IsLockedOutAsync(user))
            {
                throw new AuthenticationException("User was blocked");
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                user = new { user.Id, user.Email, user.UserName },
                roles = roles
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(-1)
            };

            Response.Cookies.Append("access_token", "", cookieOptions);

            return Ok(new { message = "Successfully logged out" });
        }


        private void SignInUser(IdentityUser user, TimeSpan tokenExpiry, IList<string> userRoles)
        {
            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = _jwtTokenService.GenerateToken(authClaims, tokenExpiry);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.Add(tokenExpiry)
            };

            Response.Cookies.Append("access_token", token, cookieOptions);
        }
    }
}
