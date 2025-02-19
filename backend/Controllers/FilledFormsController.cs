using System.Security.Claims;
using backend.Services.Interfaces;
using backend.ViewModels.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Infrastructure.Exceptions;
using Server.Infrastructure.Middlewares;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class FilledFormsController : ControllerBase
{
    private readonly IFilledFormService _filledFormService;
    private readonly ITemplatesService _templatesService;

    public FilledFormsController(IFilledFormService filledFormService, ITemplatesService templatesService)
    {
        _filledFormService = filledFormService;
        _templatesService = templatesService;
    }

    [HttpGet("{formId}")]
    [Authorize(Policy = Policies.OwnerFormOrTemplateOrAdminPolicy)]
    public async Task<IActionResult> GetFilledForm(int formId)
    {
        var filledForm = await _filledFormService.GetFilledFormAsync(formId);
        return Ok(filledForm);
    }

    [HttpPut("{formId}")]
    [Authorize(Policy = Policies.OwnerFormOrTemplateOrAdminPolicy)]
    public async Task<IActionResult> UpdateFilledForm(int formId, [FromBody] EditFilledFormDto filledFormDto)
    {
        await _filledFormService.UpdateFilledFormAsync(formId, filledFormDto);
        return Ok();
    }
}