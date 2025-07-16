using ShopEase.Models;
using System.Text.Json;

namespace ShopEase.Services;

public interface IProduct
{
    IReadOnlyList<Product> Products { get; }
    void AddProduct(Product product);
    void RemoveProduct(int productId);
    void UpdateProduct(Product product);
    Product? GetProductById(int productId);
    IReadOnlyList<Product> GetProductsByCategory(string category);
    IReadOnlyList<Product> GetProductsByPriceRange(decimal minPrice, decimal maxPrice);
    Task LoadProductsAsync();
}

public class ProductService : IProduct
{
    private readonly List<Product> _products = new();
    private readonly HttpClient _httpClient;

    public ProductService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public IReadOnlyList<Product> Products => _products.AsReadOnly();
    
    public async Task LoadProductsAsync()
    {
        try
        {
            var json = await _httpClient.GetStringAsync("sample-data/products.json");
            var products = JsonSerializer.Deserialize<List<Product>>(json);
            if (products != null)
            {
                _products.Clear();
                _products.AddRange(products);
            }
        }
        catch
        {
            // Fallback to default products if JSON loading fails
            _products.Clear();
            _products.AddRange(new List<Product>
            {
                new Product { ProductId = 1, Name = "Laptop", Price = 999.99m, Category = "Electronics" },
                new Product { ProductId = 2, Name = "Smartphone", Price = 699.99m, Category = "Electronics" },
                new Product { ProductId = 3, Name = "Headphones", Price = 199.99m, Category = "Electronics" }
            });
        }
    }
    
    public void AddProduct(Product product)
    {
        _products.Add(product);
    }
    
    public void RemoveProduct(int productId)
    {
        _products.RemoveAll(p => p.ProductId == productId);
    }

    public void UpdateProduct(Product product)
    {
        var existingProduct = _products.FirstOrDefault(p => p.ProductId == product.ProductId);
        if (existingProduct != null)
        {
            existingProduct.Name = product.Name;
            existingProduct.Price = product.Price;
            existingProduct.Category = product.Category;
        }
    }

    public Product? GetProductById(int productId)
    {
        return _products.FirstOrDefault(p => p.ProductId == productId);
    }

    public IReadOnlyList<Product> GetProductsByCategory(string category)
    {
        return _products.Where(p => p.Category == category).ToList().AsReadOnly();
    }

    public IReadOnlyList<Product> GetProductsByPriceRange(decimal minPrice, decimal maxPrice)
    {
        return _products.Where(p => p.Price >= minPrice && p.Price <= maxPrice).ToList().AsReadOnly();
    }
}