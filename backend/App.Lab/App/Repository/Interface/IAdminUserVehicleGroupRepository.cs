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
        void Update(AdminUserVehicleGroup obj);
        void Delete(string objId);
        AdminUserVehicleGroup GetById(string objId);
        List<AdminUserVehicleGroup> GetAll();
        List<AdminUserVehicleGroup> GetList(AdminUserVehicleGroupFilter filter);
       
    }
}
