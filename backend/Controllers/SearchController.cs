using backend.Services;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;
    private readonly ITemplateSearchService _templateSearchService;

    public SearchController(ISearchService searchService, ITemplateSearchService templateSearchService)
    {
        _searchService = searchService;
        _templateSearchService = templateSearchService;
    }

    [HttpGet("tags")]
    [Authorize]
    public async Task<IActionResult> SearchTags([FromQuery] string query)
    {
        var result = await _searchService.SearchTags(query);
        return Ok(result);
    }

    [HttpGet("users")]
    [Authorize]
    public async Task<IActionResult> SearchUsers([FromQuery] string query)
    {
        var result = await _searchService.SearchUsers(query);
        return Ok(result);
    }

    [HttpPost("user/validate")]
    [Authorize]
    public async Task<IActionResult> ValidateUser([FromBody] ValidateUserRequest request)
    {
        var user = await _searchService.ValidateUserEmail(request.Email);

        return Ok(new { user });
    }


    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] string sort = "relevance", [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest("Query is empty.");

        var result = await _templateSearchService.SearchTemplatesAsync(q, sort, page, pageSize);
        return Ok(result);
    }
}

public record ValidateUserRequest(string Email);