using server.Models;

namespace server.Repositories
{
    public interface IItemRepository
    {
        Task<List<Item>> GetAllAsync();
        Task<Item?> GetByIdAsync(int id);
        Task<Item> CreateAsync(Item item);
        Task<Item> UpdateAsync(Item item);
        Task DeleteAsync(int id);
     }
}
