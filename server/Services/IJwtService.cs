using server.Models;

namespace server.Services
{
    public interface IJwtService
    {
        String GenerateToken(User user);
    }
}
