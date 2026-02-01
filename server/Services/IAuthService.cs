namespace server.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string Token, string Message)> RegisterAsync(string name, string email, string password, int roleId);
        Task<(bool Success, string Token, string Message)> LoginAsync(string email, string password);
    }
}
