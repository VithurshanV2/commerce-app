using server.Models;
using server.Repositories;

namespace server.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;

        public ItemService(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        public async Task<List<Item>> GetAllItemsAsync() 
        {
            return await _itemRepository.GetAllAsync();
        }

        public async Task<Item?> GetItemByIdAsync(int id) 
        {
            return await _itemRepository.GetByIdAsync(id);
        }

        public async Task<Item> CreateItemAsync(Item item) 
        {
            return await _itemRepository.CreateAsync(item);
        }

        public async Task<Item?> UpdateItemAsync(int id, Item item) 
        {
            var existingItem = await _itemRepository.GetByIdAsync(id);
            if (existingItem == null)
            {
                return null;
            }

            existingItem.Name = item.Name;
            existingItem.Price = item.Price;
            existingItem.Quantity = item.Quantity;

            return await _itemRepository.UpdateAsync(existingItem);
        }

        public async Task<bool> DeleteItemAsync(int id) 
        { 
        var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
            {
                return false;
            }

            await _itemRepository.DeleteAsync(id);
            return true;
        }
    }
}
