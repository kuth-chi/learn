namespace ShopEase.Models;

using System.Collections.Generic;
using MySql.Data.MySqlClient;

public class Product
{
    public int ProductId { get; set; }
    public string? Name { get; set; }
    public decimal Price { get; set; } = decimal.Zero;
    public string? Category { get; set; }

    public void PrintDetails()
    {
        Console.WriteLine($"Product: {Name} | Price: ${Price:F2} | Category: {Category}");
    }
}

public class Cart
{
    private List<Product> products = new List<Product>();
    private string connectionString = "server=localhost;user=root;password=yourpassword;database=Shop;";

    public void AddProduct(Product product)
    {
        products.Add(product);
        using var conn = new MySqlConnection(connectionString);
        conn.Open();
        var cmd = new MySqlCommand("INSERT INTO Products (ProductId, Name, Price, Category) VALUES (@ProductId, @Name, @Price, @Category)", conn);
        cmd.Parameters.AddWithValue("@ProductId", product.ProductId);
        cmd.Parameters.AddWithValue("@Name", product.Name);
        cmd.Parameters.AddWithValue("@Price", product.Price);
        cmd.Parameters.AddWithValue("@Category", product.Category);
        cmd.ExecuteNonQuery();
    }

    public void RemoveProduct(int productId)
    {
        products.RemoveAll(p => p.ProductId == productId);
        using var conn = new MySqlConnection(connectionString);
        conn.Open();
        var cmd = new MySqlCommand("DELETE FROM Products WHERE ProductId = @ProductId", conn);
        cmd.Parameters.AddWithValue("@ProductId", productId);
        cmd.ExecuteNonQuery();
    }

    public void DisplayCartItems()
    {
        foreach (var product in products)
        {
            product.PrintDetails();
        }
    }

    public decimal CalculateTotal()
    {
        decimal total = 0;
        foreach (var product in products)
        {
            total += product.Price;
        }
        return total;
    }
}

#if DEBUG
public class ProductTest
{
    public static void RunTest()
    {
        var product = new Product { ProductId = 1, Name = "Laptop", Price = 999.99m, Category = "Electronics" };
        product.PrintDetails();
    }
}

public class CartTest
{
    public static void RunTest()
    {
        var cart = new Cart();
        var product1 = new Product { ProductId = 1, Name = "Laptop", Price = 999.99m, Category = "Electronics" };
        var product2 = new Product { ProductId = 2, Name = "Headphones", Price = 199.99m, Category = "Electronics" };
        cart.AddProduct(product1);
        cart.AddProduct(product2);
        cart.RemoveProduct(1);
        cart.DisplayCartItems();
        Console.WriteLine($"Total: ${cart.CalculateTotal():F2}");
    }
}
#endif
