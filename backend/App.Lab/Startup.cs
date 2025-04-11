using App.DataAccess;
using App.Lab.App.Repository.Interface;
using App.Lab.App.Service.Implement;
using App.Lab.App.Service.Interface;
using App.Lab.Repository.Implement;
using App.Lab.Repository.Interface;
using App.Lab.Service.Implement;
using App.Lab.Service.Interface;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;


namespace App.Lab
{
    public static class Startup
    {
        public static void Configure(IApplicationBuilder app)
        {
            //if (AppConfig.SwaggerInUse)
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "App.API v1"));
            //}
          
            app.Use(async (context, next) =>
            {
                context.Request.EnableBuffering();
                await next();
            });

            

            //app.UseCors("CorsPolicy");
            //app.UseRouting();
            //app.UseMiddleware<MonitorMiddleware>();
            //app.UseMiddleware<LoggingFilterMiddleware>();
            //app.UseMiddleware<AuthenticationMiddleware>();
            //app.UseMiddleware<AuthorizationMiddleware>();


            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllers();
            //    //if (AppConfig.HangfireInUse)
            //    //    endpoints.MapHangfireDashboard();
            //});


        }

        public static void RegisterDependency(IServiceCollection services)
        {

            // Inject IPrincipal

            services.AddTransient<System.Security.Principal.IPrincipal>(provider => provider.GetService<IHttpContextAccessor>().HttpContext.User);
    

            // https://www.tutorialsteacher.com/core/dependency-injection-in-aspnet-core

            #region Accessor
            // https://stackoverflow.com/questions/30701006/how-to-get-the-current-logged-in-user-id-in-asp-net-core
            //services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpContextAccessor();
            #endregion
            #region data access

            services.Add(new ServiceDescriptor(typeof(IConnectionFactory), new ConnectionFactory()));
            services.AddScoped<DbContext, DbContext>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            #endregion

            services.AddTransient<IAdminUsersRepository, AdminUsersRepository>();
            services.AddTransient<IAdminUsersService, AdminUsersService>();

            services.AddTransient<IVehicleGroupsRepository, VehicleGroupsRepository>();
            services.AddTransient<IVehicleGroupsService, VehicleGroupsService>();

            // Add framework services.
            services.AddMvcCore();
        }


    }
}
