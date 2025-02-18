using backend.Repositories.Models;
using backend.ViewModels.DTOs;

namespace backend.Services;

public interface ITemplatesService
{
    Task<Template> CreateTemplateAsync(TemplateDto dto, string creatorId);
    Task<Template> GetTemplateFullAsync(int id);
    Task<Template> UpdateTemplateAsync(int id, TemplateDto dto);
    Task<Template> GetTemplatePublicAsync(int id);
    Task<int> SubmitFormAsync(int templateId, SubmitFormDto dto);
}