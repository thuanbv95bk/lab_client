using App.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Repository.Interface
{

    public interface IAdminUsersRepository
    {
        string Create(AdminUsers obj);
        void Update(AdminUsers obj);
        void Delete(string objId);
        AdminUsers GetById(string objId);
        List<AdminUsers> GetAll();
        List<AdminUsers> GetList();
    }
}
