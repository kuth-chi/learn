using DataTransitions.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSingleton<EncryptionService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// API Service Endpoint
app.MapPost("/register", (UserDto userDto, EncryptionService encryptionService) =>
{
    if (string.IsNullOrWhiteSpace(userDto.Name) ||
        string.IsNullOrWhiteSpace(userDto.Email) ||
        string.IsNullOrWhiteSpace(userDto.Password))
    {
        return Results.BadRequest(new { error = "Name, email, and password are required." });
    }

    string encryptedEmail = encryptionService.Encrypt(userDto.Email);
    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

    var user = new UserDto(
        Id: (int)SimulatedDatabase.Users.Count + 1,
        Name: userDto.Name,
        Email: encryptedEmail,
        Password: hashedPassword
    );

    SimulatedDatabase.InsertUser(user);

    Console.WriteLine($"User stored: Name={user.Name}, Email={user.Email}, Password={user.Password}");
    return Results.Created($"/users/{user.Id}", new { message = "User registered successfully." });
})
.WithName("UserRegister");

app.MapGet("/users/{id}/decrypted-email", (int id, EncryptionService encryptionService) =>
{
    // Find the user in the simulated database
    var user = SimulatedDatabase.Users.FirstOrDefault(u => u.Id == id);
    if (user == null) return Results.NotFound(new { error = $"User with Id {id} not found." });

    // Decrypt the email
    string decryptedEmail = encryptionService.Decrypt(user.Email);
    if (string.IsNullOrWhiteSpace(decryptedEmail)) return Results.Problem("Failed to decrypt email. Check server logs", statusCode: StatusCodes.Status500InternalServerError);
    
    // Return the decrypted email
    return Results.Ok(new { userId = id, email = decryptedEmail });
})
.WithName("GetDecryptedUserEmail");


var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

// User DTO 
public record UserDto(int Id, string Name, string Email, string Password);

// Simulating Data
public static class SimulatedDatabase
{
    public static List<UserDto> Users { get; } = new List<UserDto>();

    public static void InsertUser(UserDto user)
    {
        Users.Add(user);
        Console.WriteLine($"[SimulatedDatabase] User '{user.Name}' with ID {user.Id} added to database.");
    }
}

internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
