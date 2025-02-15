using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Repositories.Models;
using Server.Infrastructure.Middlewares;

public class OwnerOrAdminHandler : AuthorizationHandler<OwnerOrAdminRequirement, Template>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OwnerOrAdminRequirement requirement,
        Template resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = context.User.IsInRole("admin");

        if (resource.CreatorId == userId || isAdmin)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}