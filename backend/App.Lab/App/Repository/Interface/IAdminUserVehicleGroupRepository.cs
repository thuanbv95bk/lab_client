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
        string Create(AdminUserVehicleGroup obj);
        void DeleteSoft(AdminUserVehicleGroup item);
        void Update(AdminUserVehicleGroup item);
        List<AdminUserVehicleGroup> GetList(AdminUserVehicleGroupFilter filter);
       
    }
}
