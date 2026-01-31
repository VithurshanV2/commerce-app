namespace server.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // "Admin" or "User"
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
