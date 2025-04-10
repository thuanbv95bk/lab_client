
using App.Common.Helper;
using Microsoft.Data.SqlClient;
using System.Data.Common;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
        DbProviderFactories.RegisterFactory("System.Data.SqlClient", SqlClientFactory.Instance);
    }

    public IConfiguration Configuration { get; }

    // Đăng ký dịch vụ
    public void ConfigureServices(IServiceCollection services)
    {

        // https://www.tutorialsteacher.com/core/dependency-injection-in-aspnet-core

        services.AddControllers(); // 👈 Bắt buộc có

        App.Lab.Startup.RegisterDependency(services);
        services.AddEndpointsApiExplorer();

        services
                .AddCors
                (
                    o => o.AddPolicy("CorsPolicy", builder => builder
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        //.AllowCredentials()
                        //.AllowAnyOrigin()
                        .WithOrigins(AppConfig.LstFrontEndUrl.ToArray())
                    )
                );
        services.AddSwaggerGen();
    }

    // Thiết lập middleware pipeline
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        app.UseCors("CorsPolicy");
        app.UseHttpsRedirection();
      
        // Bắt buộc để hỗ trợ Minimal API
        app.UseRouting();
        App.Lab.Startup.Configure(app);
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();  // 👈 Cho phép hiển thị controller như AdminUsersController
            
        });
    }
}

