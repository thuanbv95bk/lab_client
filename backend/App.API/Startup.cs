
using App.Common.Helper;
using Microsoft.AspNetCore.Builder;
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
                    o => o.AddPolicy("AllowAngular", builder => builder
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        //.AllowCredentials()
                        //.AllowAnyOrigin()
                        .WithOrigins(AppConfig.LstFrontEndUrl.ToArray())
                    )
                );
        //services.AddCors(options =>
        //{
        //    options.AddPolicy("AllowAngular", policy =>
        //    {
        //        policy.WithOrigins("http://localhost:4200")
        //              .AllowAnyHeader()
        //              .AllowAnyMethod()
        //              //.AllowCredentials()
        //              ; // 👈 Bỏ comment dòng này nếu cần
        //    });
        //});
        services.AddSwaggerGen();
    }

    // Thiết lập middleware pipeline
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {


        

        // Bắt buộc để hỗ trợ Minimal API
        app.UseRouting();
        app.UseCors("AllowAngular");

        App.Lab.Startup.Configure(app);

        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        //app.UseHttpsRedirection();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();  // 👈 Cho phép hiển thị controller như AdminUsersController
            
        });
       
    }
}

