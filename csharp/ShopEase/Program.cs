using ShopEase.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// Added service
builder.Services.AddScoped<IProduct, ProductService>();
builder.Services.AddScoped<ShopEase.Services.CartService>();

await builder.Build().RunAsync();
