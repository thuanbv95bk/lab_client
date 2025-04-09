using App.Common.BaseService;
using App.Lab.Model;


namespace App.Lab.Service.Interface
{
    public interface IAdminUsersService : IBaseService
    {
        string Create(AdminUsers obj);
        void Update(AdminUsers obj);
        void Delete(string id);
        AdminUsers GetById(string id);
        List<AdminUsers> GetAll();
        List<AdminUsers> GetList();
    }
}
