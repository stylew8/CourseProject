﻿namespace backend.ViewModels.DTOs;

public class UserDto
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public string Status { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
}