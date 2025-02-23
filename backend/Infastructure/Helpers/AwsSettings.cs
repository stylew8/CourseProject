using backend.Services;

namespace backend.Infastructure.Helpers;

public class AwsSettings
{
    public string AccessKey { get; set; }
    public string SecretKey { get; set; }
    public string BucketName { get; set; }
    public string Region { get; set; }
}

