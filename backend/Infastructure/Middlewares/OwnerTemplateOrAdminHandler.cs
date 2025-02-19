using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Repositories.Models;
using Server.Infrastructure.Middlewares;
using backend.Infastructure.Helpers;

namespace backend.Infrastructure.Authorization
{
    public class OwnerTemplateOrAdminHandler : AuthorizationHandler<OwnerTemplateOrAdminRequirement>
    {
        private readonly AppDbContext _dbContext;

        public OwnerTemplateOrAdminHandler(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, OwnerTemplateOrAdminRequirement requirement)
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

            if (!httpContext.Request.RouteValues.TryGetValue("id", out var templateIdObj) ||
                !int.TryParse(templateIdObj.ToString(), out int templateId))
            {
                context.Fail();
                return;
            }

            var template = await _dbContext.Templates.FirstOrDefaultAsync(t => t.Id == templateId);
            if (template == null)
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

            if (template.CreatorId == currentUserId)
            {
                context.Succeed(requirement);
                return;
            }

            context.Fail();
        }

    }
}
