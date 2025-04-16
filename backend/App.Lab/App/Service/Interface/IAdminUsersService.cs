using App.Common.BaseService;
using App.Lab.Model;


namespace App.Lab.Service.Interface
{
    public interface IAdminUsersService : IBaseService
    {
        //string Create(Users obj);
        //void Update(Users obj);
        //void Delete(string id);
        //Users GetById(string id);
        List<Users> GetAll();
        List<Users> GetList(UsersFilter filter);
    }
}
