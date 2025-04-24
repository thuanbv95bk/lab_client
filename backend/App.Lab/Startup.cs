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
        /// <summary>Configures the specified application.</summary>
        /// <param name="app">The application.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public static void Configure(IApplicationBuilder app)
        {

            app.Use(async (context, next) =>
            {
                context.Request.EnableBuffering();
                await next();
            });

        }

        /// <summary>Registers the dependency.</summary>
        /// <param name="services">The services.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
        public static void RegisterDependency(IServiceCollection services)
        {


            services.AddTransient<System.Security.Principal.IPrincipal>(provider => provider.GetService<IHttpContextAccessor>().HttpContext.User);

            #region Accessor
            // https://stackoverflow.com/questions/30701006/how-to-get-the-current-logged-in-user-id-in-asp-net-core
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

            services.AddTransient<IAdminUserVehicleGroupRepository, AdminUserVehicleGroupRepository>();
            services.AddTransient<IAdminUserVehicleGroupService, AdminUserVehicleGroupService>();

            services.AddTransient<IHrmEmployeesRepository, HrmEmployeesRepository>();
            services.AddTransient<IHrmEmployeesService, HrmEmployeesService>();

            services.AddTransient<IBcaLicenseTypesRepository, BcaLicenseTypesRepository>();
            services.AddTransient<IBcaLicenseTypesService, BcaLicenseTypesService>();

            services.AddMvcCore();
        }


    }
}
