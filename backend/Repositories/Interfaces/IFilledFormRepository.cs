using backend.Repositories.Models;

namespace backend.Repositories.Interfaces;

public interface IFilledFormRepository
{
    Task<FilledForm?> GetFilledFormAsync(int formId);
    Task SaveChangesAsync();
}