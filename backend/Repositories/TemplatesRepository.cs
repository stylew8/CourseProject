using backend.Infastructure.Helpers;
using backend.Repositories.Interfaces;
using backend.Repositories.Models;
using K4os.Hash.xxHash;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class TemplatesRepository : ITemplatesRepository
{
    private readonly AppDbContext _context;

    public TemplatesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Template> CreateTemplateAsync(Template template)
    {
        _context.Templates.Add(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task<Template?> GetTemplateByIdFullAsync(int id)
    {
        return await _context.Templates
            .Include(t => t.Questions)
            .ThenInclude(q => q.Options)
            .Include(x=>x.AllowedUsers)
            .ThenInclude(x=>x.User)
            .Include(x=>x.TemplateTags)
            .ThenInclude(x=>x.Tag)
            .Include(x=>x.Topic)
            .FirstOrDefaultAsync(t => t.Id == id);
    }
    public async Task<Template> UpdateTemplateAsync(Template template, TemplateDto dto, bool removeOldQuestions = true)
    {
        template.Title = dto.Title;
        template.Description = dto.Description;
        template.AccessType = dto.AccessType;

        var topic = await _context.Topics.FirstOrDefaultAsync(x=>x.Name == dto.Topic);
        if (topic == null)
        {
            topic = (await _context.Topics.AddAsync(new Topic()
            {
                Name = dto.Topic
            })).Entity;
            await _context.SaveChangesAsync();
        }

        template.TopicId = topic.Id;

        if (removeOldQuestions)
        {
            _context.Questions.RemoveRange(template.Questions);
            await _context.SaveChangesAsync();
        }

        template.Questions = dto.Questions.Select(q => new Question
        {
            Order = q.Order,
            Type = q.Type,
            Text = q.Text,
            Description = q.Description,
            ShowInTable = q.ShowInTable,
            Options = q.Options.Select(o => new Option
            {
                Order = o.Order,
                Value = o.Value
            }).ToList()
        }).ToList();

        _context.TemplateUsers.RemoveRange(template.AllowedUsers);

        if (template.AccessType == AccessStatusConstants.Private)
        {
            template.AllowedUsers = dto.AllowedUserIds.Select(u => new TemplateUser()
            {
                TemplateId = template.Id,
                UserId = u
            }).ToList();
            
        }

        _context.TemplateTags.RemoveRange(template.TemplateTags);
        template.TemplateTags = dto.TagIds.Select(t => new TemplateTag
        {
            TemplateId = template.Id,
            TagId = t
        }).ToList();

        await _context.SaveChangesAsync();
        return template;
    }

    public async Task<Template?> GetTemplateWithQuestionsAsync(int templateId)
    {
        return await _context.Templates
            .Include(t => t.Questions)
            .ThenInclude(x=>x.Options)
            .FirstOrDefaultAsync(t => t.Id == templateId);
    }

    public async Task AddFilledFormAsync(FilledForm filledForm)
    {
        _context.FilledForms.Add(filledForm);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Template>> GetLatestTemplatesAsync()
    {
        return await _context.Templates
            // .Include(t => t.Questions) 
            .Where(x=>x.AccessType == AccessStatusConstants.Public)
            .OrderByDescending(t => t.Id) 
            .Take(10)
            .ToListAsync();
    }

    public async Task<List<FilledForm>> GetFilledFormsAsync(int templateId)
    {
        return await _context.FilledForms
            .Where(f => f.TemplateId == templateId)
            .Include(i=>i.User)
            .Include(f => f.Answers) 
            .ToListAsync();
    }

    public async Task<Template?> GetTemplatePhotoAsync(int id)
    {
        return await _context.Templates.Select(x => new Template()
            {
                Id = x.Id,
                PhotoUrl = x.PhotoUrl
            })
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task DeleteTemplatePhotoAsync(int id)
    {
        var template = await _context.Templates.FirstOrDefaultAsync(x => x.Id == id);

        if (template != null)
        {
            template.PhotoUrl = null;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<List<string>> GetTags()
    {
        return await _context.Tags.Select(x => x.Name).ToListAsync();
    }
}