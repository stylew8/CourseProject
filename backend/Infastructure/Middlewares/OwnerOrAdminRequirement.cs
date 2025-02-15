using Microsoft.AspNetCore.Authorization;

namespace Server.Infrastructure.Middlewares;

public class OwnerOrAdminRequirement : IAuthorizationRequirement
{
}