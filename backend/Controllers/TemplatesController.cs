using backend.Repositories.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Exceptions;
using System.Security.Claims;
using Server.Infrastructure.Middlewares;
using backend.Services;
using backend.ViewModels.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TemplatesController : ControllerBase
    {
        private readonly ITemplatesService _templatesService;
        private readonly IAuthorizationService _authorizationService;

        public TemplatesController(
            ITemplatesService templatesService,
            IAuthorizationService authorizationService)
        {
            _templatesService = templatesService;
            _authorizationService = authorizationService;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateTemplate([FromBody] TemplateDto dto)
        {
            var creatorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var template = await _templatesService.CreateTemplateAsync(dto, creatorId);
            return Ok(template);
        }

        [HttpGet("public/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTemplatePublic(int id)
        {
            var template = await _templatesService.GetTemplateFullAsync(id);
            if (template == null)
                return NotFound();

            return Ok(template);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetTemplatePrivate(int id)
        {
            var template = await _templatesService.GetTemplateFullAsync(id);
            if (template == null)
                return NotFound();

            var authResult = await _authorizationService.AuthorizeAsync(User, template, new OwnerOrAdminRequirement());
            if (!authResult.Succeeded)
                return Forbid();

            return Ok(template);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateTemplate(int id, [FromBody] TemplateDto dto)
        {
            var template = await _templatesService.GetTemplateFullAsync(id);
            if (template == null)
                return NotFound();

            var authResult = await _authorizationService.AuthorizeAsync(User, template, new OwnerOrAdminRequirement());
            if (!authResult.Succeeded)
                return Forbid();

            var updated = await _templatesService.UpdateTemplateAsync(id, dto);
            return Ok(updated);
        }

        [HttpPost]
        public async Task<IActionResult> SubmitForm([FromQuery] int templateId, [FromBody] SubmitFormDto dto)
        {
            var filledFormId = await _templatesService.SubmitFormAsync(templateId, dto);
            return Ok(new { FilledFormId = filledFormId });
        }
    }
}
