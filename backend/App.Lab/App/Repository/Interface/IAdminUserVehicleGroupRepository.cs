using App.Lab.App.Model;
using App.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Repository.Interface
{
    public interface IAdminUserVehicleGroupRepository
    {
        Task Create(AdminUserVehicleGroup obj);
        Task DeleteSoft(AdminUserVehicleGroup item);
        Task Update(AdminUserVehicleGroup item);
        List<AdminUserVehicleGroup> GetList(AdminUserVehicleGroupFilter filter);
        List<VehicleGroups> GetListView(AdminUserVehicleGroupFilter filter);


    }
}
