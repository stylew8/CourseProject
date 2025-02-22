using backend.Services.Interfaces;
using backend.ViewModels.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;

    public SearchController(ISearchService searchService)
    {
        _searchService = searchService;
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

}

