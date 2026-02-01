using server.Models;

namespace server.Services
{
    public interface IItemService
    {
        Task<List<Item>> GetAllItemsAsync();
        Task<Item?> GetItemByIdAsync(int id);
        Task<Item> CreateItemAsync(Item item);
        Task<Item?> UpdateItemAsync(int id, Item item);
        Task<bool> DeleteItemAsync(int id);
    }
}
