namespace backend.Services.Interfaces;

public interface IS3Service
{
    Task<string> UploadFileAsync(IFormFile file);
    Task DeleteFileAsync(string fileKey);
    Task<Stream> GetFileAsync(string fileKey);

    string BucketName { get; }
}