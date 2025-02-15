using System.Net;
using Server.Infrastructure.Exceptions;

public class ValidationException : ApiServiceException
{
    public ValidationException(string message, int statusCode = (int)HttpStatusCode.BadRequest)
        : base(message)
    {
        StatusCode = statusCode;
    }
}