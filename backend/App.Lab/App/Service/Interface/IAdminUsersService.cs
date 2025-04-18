using App.Common.BaseService;
using App.Lab.Model;


namespace App.Lab.Service.Interface
{
    public interface IAdminUsersService : IBaseService
    {
        List<Users> GetList(UsersFilter filter);
    }
}
