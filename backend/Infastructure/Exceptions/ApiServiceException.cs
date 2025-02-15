namespace Server.Infrastructure.Exceptions;

public abstract class ApiServiceException : Exception
{
    protected ApiServiceException(string message)
    {
        Message = message;
    }


    public int StatusCode { get; set; }
    public string Message { get; set; }
}