using System.Net;

namespace Server.Infrastructure.Exceptions;

public class ServerInternalException : ApiServiceException
{
    public ServerInternalException(
        string message,
        int statusCode = (int)HttpStatusCode.InternalServerError) 
        : base(message)
    {
        StatusCode = statusCode;
    }
}