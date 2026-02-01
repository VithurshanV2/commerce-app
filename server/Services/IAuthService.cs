using server.Models;

namespace server.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string Token, string Message, User? User)> RegisterAsync(string name, string email, string password, int roleId);
        Task<(bool Success, string Token, string Message, User? User)> LoginAsync(string email, string password);
        Task<(bool Success, string Token, string Message, User? User)> GoogleLoginAsync(string googleToken);
    }
}
