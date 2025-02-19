using backend.Repositories.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using backend.Infastructure.Helpers;

namespace Server.Infrastructure.Middlewares;

public class OwnerFormOrTemplateOrAdminHandler : AuthorizationHandler<OwnerFormOrTemplateOrAdminRequirement>
{
    private readonly AppDbContext _dbContext;

    public OwnerFormOrTemplateOrAdminHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, OwnerFormOrTemplateOrAdminRequirement requirement)
    {
        if (context.User.IsInRole(RolesConstants.Admin))
        {
            context.Succeed(requirement);
            return;
        }

        var httpContext = (context.Resource as AuthorizationFilterContext)?.HttpContext
                          ?? context.Resource as Microsoft.AspNetCore.Http.HttpContext;
        if (httpContext == null)
        {
            context.Fail();
            return;
        }

        if (!httpContext.Request.RouteValues.TryGetValue("formId", out var formIdObj) ||
            !int.TryParse(formIdObj.ToString(), out int formId))
        {
            context.Fail();
            return;
        }

        var filledForm = await _dbContext.FilledForms
            .Include(f => f.Template)
            .FirstOrDefaultAsync(f => f.Id == formId);

        if (filledForm == null)
        {
            context.Fail();
            return;
        }

        var currentUserId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(currentUserId))
        {
            context.Fail();
            return;
        }

        if (filledForm.UserId == currentUserId || (filledForm.Template != null && filledForm.Template.CreatorId == currentUserId))
        {
            context.Succeed(requirement);
            return;
        }

        context.Fail();
    }
}