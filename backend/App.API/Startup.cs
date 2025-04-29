
using App.Common.Helper;
using App.Lab.Model;
using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.Data.SqlClient;
using System.Data.Common;
using static App.Lab.Model.HrmEmployeeValidator;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
        DbProviderFactories.RegisterFactory("System.Data.SqlClient", SqlClientFactory.Instance);
    }

    public IConfiguration Configuration { get; }

    /// <summary> Đăng ký dịch vụ. </summary>
    /// <param name="services">The services.</param>
    /// Author: thuanbv
    /// Created: 23/04/2025
    /// Modified: date - user - description
    public void ConfigureServices(IServiceCollection services)
    {

        // https://www.tutorialsteacher.com/core/dependency-injection-in-aspnet-core
 
        services.AddControllers(); // 

        App.Lab.Startup.RegisterDependency(services);
        services.AddEndpointsApiExplorer();
        services.AddScoped<IValidator<HrmEmployees>, HrmEmployeeValidator>();
        services.AddScoped<IValidator<List<HrmEmployees>>, HrmEmployeesListValidator>();
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

        services.AddSwaggerGen();
    }


    /// <summary>Configures the specified application. Thiết lập middleware pipeline</summary>
    /// <param name="app">The application.</param>
    /// <param name="env">The env.</param>
    /// Author: thuanbv
    /// Created: 23/04/2025
    /// Modified: date - user - description
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
            endpoints.MapControllers();  
            
        });
       
    }
}

