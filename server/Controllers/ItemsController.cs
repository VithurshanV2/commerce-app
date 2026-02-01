using Microsoft.AspNetCore.Mvc;
using server.Services;
using server.Models;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemsController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _itemService.GetAllItemsAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            var item = await _itemService.GetItemByIdAsync(id);

            if (item == null)
            {
                return NotFound(new { message = "Item not found" });
            }

            return Ok(item);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateItem([FromBody] CreateItemRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = new Item
            {
                Name = request.Name,
                Price = request.Price,
                Quantity = request.Quantity
            };

            var createdItem = await _itemService.CreateItemAsync(item);
            return CreatedAtAction(nameof(GetItemById), new { id = createdItem.Id }, createdItem);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] UpdateItemRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var item = new Item
            {
                Name = request.Name,
                Price = request.Price,
                Quantity = request.Quantity
            };

            var updatedItem = await _itemService.UpdateItemAsync(id, item);

            if (updatedItem == null)
            {
                return NotFound(new { message = "Item not found" });
            }

            return Ok(updatedItem);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var deleted = await _itemService.DeleteItemAsync(id);

            if (!deleted)
            {
                return NotFound(new { message = "Item not found" });
            }

            return Ok(new { message = "Item deleted successfully" });
        }
    }

    // Request models
    public record CreateItemRequest(string Name, decimal Price, int Quantity);
    public record UpdateItemRequest(string Name, decimal Price, int Quantity);
}
