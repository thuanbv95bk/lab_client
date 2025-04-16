var builder = WebApplication.CreateBuilder(args);

// G?i Startup.cs
var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();

startup.Configure(app, builder.Environment);

app.Run();
