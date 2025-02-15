using backend.Repositories.Models;

namespace backend.Services;

public interface ITemplatesService
{
    Task<Template> CreateTemplateAsync(TemplateDto dto, string creatorId);
    Task<Template> GetTemplateFullAsync(int id);
    Task<Template> UpdateTemplateAsync(int id, TemplateDto dto);
    Task<Template> GetTemplatePublicAsync(int id);
}