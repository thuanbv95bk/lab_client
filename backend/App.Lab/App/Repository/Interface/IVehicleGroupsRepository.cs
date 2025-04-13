using App.Lab.App.Model;
using App.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.App.Repository.Interface
{
    public interface IVehicleGroupsRepository
    {
        string Create(VehicleGroups obj);
        void Update(VehicleGroups obj);
        void Delete(string objId);
        VehicleGroups GetById(int objId);
        List<VehicleGroups> GetAll();
        List<VehicleGroups> GetList(VehicleGroupsFilter filter);
        List<VehicleGroups> GetListNotAssigned(VehicleGroupsFilter filter);
        UserVehicleGroupView GetViewById(int objId);
    }
}
