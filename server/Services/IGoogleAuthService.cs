namespace server.Services
{
    public interface IGoogleAuthService
    {
        Task<(bool Success, string Email, string Name)> ValidateGoogleTokenAsync(string googleToken);
    }
}
