using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.Common.BaseService;
using App.Common.Models;
using App.Lab.App.Model;
using App.Lab.Model;
using Microsoft.VisualStudio.Services.Location;
using ServiceStatus = App.Common.Models.ServiceStatus;

namespace App.Lab.App.Service.Interface
{
    public interface IAdminUserVehicleGroupService : IBaseService
    {
        ServiceStatus GetListAssignGroups(AdminUserVehicleGroupFilter filter);
        ServiceStatus AddOrEditList(VehicleGroupModel item);
    }
}
