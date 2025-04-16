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
        List<Users> GetAll();
        List<Users> GetList(UsersFilter filter);
    }
}
