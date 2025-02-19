using backend.Repositories.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Exceptions;
using System.Security.Claims;
using Server.Infrastructure.Middlewares;
using backend.ViewModels.DTOs;
using backend.Services.Interfaces;

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
        [Authorize(Policy = Policies.OwnerTemplateOrAdminPolicy)]
        public async Task<IActionResult> GetTemplatePrivate(int id)
        {
            var template = await _templatesService.GetTemplateFullAsync(id);

            return Ok(template);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = Policies.OwnerTemplateOrAdminPolicy)]
        public async Task<IActionResult> UpdateTemplate(int id, [FromBody] TemplateDto dto)
        {
            var updated = await _templatesService.UpdateTemplateAsync(id, dto);
            return Ok(updated);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SubmitForm([FromQuery] int templateId, [FromBody] SubmitFormDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var filledFormId = await _templatesService.SubmitFormAsync(templateId, dto, userId);
            return Ok(new { FilledFormId = filledFormId });
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestTemplates()
        {
            var templates = await _templatesService.GetLatestTemplatesAsync();
            return Ok(templates);
        }

        [HttpGet("{id}/filledForms")]
        [Authorize(Policy = Policies.OwnerTemplateOrAdminPolicy)]
        public async Task<IActionResult> GetFilledForms(int id)
        {
            var filledForms = await _templatesService.GetFilledFormsAsync(id);
            return Ok(filledForms);
        }

        [HttpGet("{id}/results")]
        [Authorize(Policy = Policies.OwnerTemplateOrAdminPolicy)]
        public async Task<IActionResult> GetTemplateResults(int id)
        {
            var results = await _templatesService.GetTemplateResultsAsync(id);
            return Ok(results);
        }
    }
}
