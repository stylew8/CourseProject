using System.Net;

public class ValidationException : Exception
{
    public int StatusCode { get; }

    public ValidationException(string message, int statusCode = (int)HttpStatusCode.BadRequest)
        : base(message)
    {
        StatusCode = statusCode;
    }
}