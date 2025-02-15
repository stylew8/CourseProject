using backend.Repositories.Models;

namespace backend.Repositories;

public interface ITemplatesRepository
{
    Task<Template> CreateTemplateAsync(Template template);
    Task<Template> GetTemplateByIdFullAsync(int id);
    Task<Template> UpdateTemplateAsync(Template template, TemplateDto dto, bool removeOldQuestions = true);
}