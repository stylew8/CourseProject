using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

public class UserInformation
{
    [Key, ForeignKey("User")]
    public string UserId { get; set; }

    public IdentityUser User { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
