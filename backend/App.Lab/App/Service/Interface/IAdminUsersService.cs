using App.Common.BaseService;
using App.Lab.Model;


namespace App.Lab.Service.Interface
{
    public interface IAdminUsersService : IBaseService
    {
        /// <summary>Lấy danh sách user</summary>
        /// <param name="filter">Bộ lọc theo User</param>
        /// Author: thuanbv
        /// Created: 22/04/2025
        /// Modified: date - user - description
        List<Users> GetList(Users filter);
    }
}
