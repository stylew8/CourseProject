using backend.Repositories.Models;
using backend.ViewModels.DTOs;

namespace backend.Services.Interfaces;

public interface ITemplatesService
{
    Task<Template> CreateTemplateAsync(TemplateDto dto, string creatorId, string? photoUrl);
    Task<GetTemplateDto?> GetTemplateFullAsync(int id);
    Task<Template> UpdateTemplateAsync(int id, TemplateDto dto, string photoUrl);
    Task<int> SubmitFormAsync(int templateId, SubmitFormDto dto, string userId);
    Task<List<Template>> GetLatestTemplatesAsync();
    Task<AggregationResultsDto> GetTemplateResultsAsync(int templateId);
    Task<List<FilledFormDto>> GetFilledFormsAsync(int templateId);

    Task<Template?> GetTemplateByIdAsync(string id);
    Task DeleteTemplateAsync(string id);

    Task DeletePhoto(int templateId);
    Task<List<string>> GetTagsAsync();
}