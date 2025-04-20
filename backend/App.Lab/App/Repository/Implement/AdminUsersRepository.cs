
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using App.DataAccess;
using App.Common.Helper;
using Microsoft.VisualStudio.Services.Common;



namespace App.Lab.Repository.Implement
{
    public class AdminUsersRepository : Repo, IAdminUsersRepository
    {
        public AdminUsersRepository(IUnitOfWork unitOfWork) : base(unitOfWork) { Schema = "Admin"; }
        public AdminUsersRepository(IHttpContextAccessor accessor, IUnitOfWork unitOfWork) : base(accessor, unitOfWork) { Schema = "Admin"; }


        /// <summary>Gets the list.</summary>
        /// <param name="filter">UsersFilter</param>
        /// <returns>
        ///   <br />
        /// </returns>
        /// <Modified>
        /// Name       Date          Comments
        /// thuanbv 4/16/2025 	get danh sách user theo bộ lọc UsersFilter
        /// </Modified>
        public List<Users> GetList(Users filter)
        {

            var listOrderOption = new OrderOption[] {
            new OrderOption {
                Column = "Fullname",
                OrderType = "ASC",
            }};
            var listFilter = MapFilterToOptions(filter);
            this.GetTableData
            (
                out List<Users> ret
                , "Users", null, listFilter, listOrderOption
            );
            return ret;

        }
    }

}
