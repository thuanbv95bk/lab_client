using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.Common.BaseService;
using App.Lab.Model;

namespace App.Lab.App.Service.Interface
{
    public interface IAdminUserVehicleGroupService : IBaseService
    {
        string Create(AdminUserVehicleGroup obj);
        void Update(AdminUserVehicleGroup obj);
        void Delete(string id);
        AdminUserVehicleGroup GetById(string id);
        List<AdminUserVehicleGroup> GetAll();
        List<AdminUserVehicleGroup> GetList(AdminUserVehicleGroupFilter filter);

        List<UserVehicleGroupView> GetListAssignGroups(AdminUserVehicleGroupFilter filter);
    }
}
