using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SeedDefaultAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "GoogleId", "Name", "PasswordHash", "RoleId" },
                values: new object[] { 1, new DateTime(2025, 1, 31, 0, 0, 0, 0, DateTimeKind.Utc), "admin@test.com", null, "Admin", "$2a$11$.8/CJZnugojJ.F0ZMI4FZOat4OkxG0j//6SAWZ.BIg.6RdsPFb1LS", 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
