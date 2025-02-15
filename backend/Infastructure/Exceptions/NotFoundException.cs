using System.Net;

namespace Server.Infrastructure.Exceptions;

public class NotFoundException : ApiServiceException
{
    public NotFoundException(string message, int statusCode = (int)HttpStatusCode.NotFound) : base(message)
    {
        StatusCode = statusCode;
    }
}