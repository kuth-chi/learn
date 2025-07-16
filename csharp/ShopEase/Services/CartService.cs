using ShopEase.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace ShopEase.Services;

public class CartService
{
    private readonly List<Product> _cartItems = new();
    private readonly IJSRuntime _jsRuntime;
    private const string CartStorageKey = "shopease_cart";
    public event Action? OnCartChanged;

    public IReadOnlyList<Product> CartItems => _cartItems.AsReadOnly();

    public CartService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
        _ = LoadCartAsync();
    }

    public async Task LoadCartAsync()
    {
        try
        {
            var json = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", CartStorageKey);
            if (!string.IsNullOrEmpty(json))
            {
                var items = JsonSerializer.Deserialize<List<Product>>(json);
                if (items != null)
                {
                    _cartItems.Clear();
                    _cartItems.AddRange(items);
                    OnCartChanged?.Invoke();
                }
            }
        }
        catch { }
    }

    private async Task SaveCartAsync()
    {
        var json = JsonSerializer.Serialize(_cartItems);
        await _jsRuntime.InvokeVoidAsync("localStorage.setItem", CartStorageKey, json);
    }

    public async void AddToCart(Product product)
    {
        _cartItems.Add(product);
        OnCartChanged?.Invoke();
        await SaveCartAsync();
    }

    public async void RemoveFromCart(int productId)
    {
        var item = _cartItems.FirstOrDefault(p => p.ProductId == productId);
        if (item != null)
        {
            _cartItems.Remove(item);
            OnCartChanged?.Invoke();
            await SaveCartAsync();
        }
    }

    public decimal CalculateTotal() => _cartItems.Sum(p => p.Price);

    public async void ClearCart()
    {
        _cartItems.Clear();
        OnCartChanged?.Invoke();
        await SaveCartAsync();
    }
}
