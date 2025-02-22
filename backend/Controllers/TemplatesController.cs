using backend.Repositories.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Exceptions;
using System.Security.Claims;
using System.Text.Json;
using Server.Infrastructure.Middlewares;
using backend.ViewModels.DTOs;
using backend.Services.Interfaces;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TemplatesController : ControllerBase
    {
        private readonly ITemplatesService templatesService;
        private readonly IAuthorizationService authorizationService;
        private readonly IS3Service s3Service;

        public TemplatesController(
            ITemplatesService templatesService,
            IAuthorizationService authorizationService, IS3Service s3Service)
        {
            this.templatesService = templatesService;
            this.authorizationService = authorizationService;
            this.s3Service = s3Service;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateTemplate([FromForm] TemplateDto dto)
        {
            var creatorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string photoUrl = null;

            if (dto.Photo != null)
            {
                photoUrl = await s3Service.UploadFileAsync(dto.Photo);
            }

            var template = await templatesService.CreateTemplateAsync(dto, creatorId, photoUrl);
            return Ok(template);
        }


        [HttpPut("{id}")]
        [Authorize(Policy = Policies.OwnerTemplateOrAdminPolicy)]
        public async Task<IActionResult> UpdateTemplate(int id, [FromForm] TemplateDto dto)
        {
            string photoUrl = null;

            if (dto.Photo != null)
            {
                photoUrl = await s3Service.UploadFileAsync(dto.Photo);
            }

            var updated = await templatesService.UpdateTemplateAsync(id, dto, photoUrl);
            return Ok(updated);
        }



        [HttpGet("public/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTemplatePublic(int id)
        {
            var template = await templatesService.GetTemplateFullAsync(id);
            if (template == null)
                return NotFound();

            return Ok(template);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = Policies.OwnerTemplateOrAdminPolicy)]
        public async Task<IActionResult> GetTemplatePrivate(int id)
        {
            var template = await templatesService.GetTemplateFullAsync(id);

            return Ok(template);
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SubmitForm([FromQuery] int templateId, [FromBody] SubmitFormDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var filledFormId = await templatesService.SubmitFormAsync(templateId, dto, userId);
            return Ok(new { FilledFormId = filledFormId });
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestTemplates()
        {
            var templates = await templatesService.GetLatestTemplatesAsync();
            return Ok(templates);
        }

        [HttpGet("{id}/filledForms")]
        [Authorize(Policy = Policies.OwnerTemplateOrAdminPolicy)]
        public async Task<IActionResult> GetFilledForms(int id)
        {
            var filledForms = await templatesService.GetFilledFormsAsync(id);
            return Ok(filledForms);
        }

        [HttpGet("{id}/results")]
        [Authorize(Policy = Policies.OwnerTemplateOrAdminPolicy)]
        public async Task<IActionResult> GetTemplateResults(int id)
        {
            var results = await templatesService.GetTemplateResultsAsync(id);
            return Ok(results);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = Policies.OwnerTemplateOrAdminPolicy)]
        public async Task<IActionResult> DeleteTemplate(string id)
        {
            var template = await templatesService.GetTemplateByIdAsync(id);
            if (template == null)
            {
                return NotFound("Template not found.");
            }

            if (!string.IsNullOrEmpty(template.PhotoUrl))
            {
                var bucketUrlPrefix = $"https://{s3Service.BucketName}.s3.amazonaws.com/";
                if (template.PhotoUrl.StartsWith(bucketUrlPrefix))
                {
                    var key = template.PhotoUrl.Substring(bucketUrlPrefix.Length);

                        await s3Service.DeleteFileAsync(key);
                    

                }
            }

            await templatesService.DeleteTemplateAsync(id);

            return NoContent();
        }

    }
}
