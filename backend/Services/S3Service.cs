using Amazon.S3.Transfer;
using Amazon.S3;
using backend.Services.Interfaces;
using backend.Infastructure.Helpers;
using Microsoft.Extensions.Options;

namespace backend.Services;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly AwsSettings _awsSettings;
    public string BucketName => _awsSettings.BucketName;

    public S3Service(IOptions<AwsSettings> options)
    {
        _awsSettings = options.Value;
        _s3Client = new AmazonS3Client(
            _awsSettings.AccessKey,
            _awsSettings.SecretKey,
            Amazon.RegionEndpoint.GetBySystemName(_awsSettings.Region)
        );
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty.");
        }

        var fileTransferUtility = new TransferUtility(_s3Client);

        var key = $"{Guid.NewGuid()}_{file.FileName}";
        using (var newMemoryStream = new MemoryStream())
        {
            await file.CopyToAsync(newMemoryStream);
            newMemoryStream.Position = 0;

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = newMemoryStream,
                BucketName = _awsSettings.BucketName,
                Key = key,
                CannedACL = S3CannedACL.PublicRead 
            };

            await fileTransferUtility.UploadAsync(uploadRequest);
        }

        return $"https://{_awsSettings.BucketName}.s3.amazonaws.com/{key}";
    }

    public async Task DeleteFileAsync(string fileKey)
    {
        await _s3Client.DeleteObjectAsync(_awsSettings.BucketName, fileKey);
    }

    public async Task<Stream> GetFileAsync(string fileKey)
    {
        var response = await _s3Client.GetObjectAsync(_awsSettings.BucketName, fileKey);
        return response.ResponseStream;
    }
}