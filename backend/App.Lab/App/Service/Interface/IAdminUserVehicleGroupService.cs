using App.Common.BaseService;
using App.Common.Models;
using App.Lab.App.Model;
using App.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace App.Lab.App.Service.Interface
{
    public interface IAdminUserVehicleGroupService : IBaseService
    {

        ServiceStatus GetListAssignGroups(AdminUserVehicleGroupFilter filter);

        Task<ServiceStatus> AddOrEditListAsync(VehicleGroupModel item);
    }
}
