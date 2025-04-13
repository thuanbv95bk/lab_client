
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


        public string Create(Users obj)
        {
            if (string.IsNullOrEmpty(obj.PK_UserID) || !Guid.TryParse(obj.PK_UserID, out Guid userId))
            {
                obj.PK_UserID = Guid.NewGuid().ToString();
            }
            else
            {
                obj.PK_UserID = userId.ToString();
            }
            string sql = 
                "INSERT INTO [Admin.Users] " +
                "(PK_UserID, " +
                "FK_CompanyID, " +
                "Username, " +
                "UserNameLower, " +
                "Fullname, " +
                "IsLock, " +
                "IsDeleted, " +
                "Email, IsActived) " +
                "VALUES " +
                "(@PK_UserID, " +
                "@FK_CompanyID," +
                "@Username," +
                "@UserNameLower," +
                "@Fullname, " +
                "@IsLock, " +
                "@IsDeleted, " +
                "@Email, " +
                "@IsActived); ";

            var parameters = this.MapToSqlParameters(obj);

            this.ExecCommand(sql, parameters);
            return obj.PK_UserID;
        }

        public void Update(Users obj)
        {
            //this.ExecuteNonQuery
            //(
            //    "App_Dic_Domain_update"
            //    , Null.GetDBNull(OrgId)
            //    , Null.GetDBNull(UserName)
            //    , Null.GetDBNull(obj.App_Dic_Domain_Id)
            //    , Null.GetDBNull(obj.App_Org_Id)
            //    , Null.GetDBNull(obj.IsActive)
            //    , Null.GetDBNull(obj.UpdatedDate)
            //    , Null.GetDBNull(obj.UpdatedUser)
            //    , Null.GetDBNull(obj.DomainCode)
            //    , Null.GetDBNull(obj.ItemCode)
            //    , Null.GetDBNull(obj.ItemValue)
            //    , Null.GetDBNull(obj.OrderValue)
            //    , Null.GetDBNull(obj.Description)
            //);
        }

        public void Delete(string objId)
        {
            //this.ExecuteNonQuery("App_Dic_Domain_delete"
            //    , Null.GetDBNull(OrgId)
            //    , Null.GetDBNull(UserName)
            //    , Null.GetDBNull(objId));
        }

        public Users GetById(string objId)
        {
            this.ExecuteReader
            (
                out Users ret
                , "select top 1 * from dbo.[Admin.Users] where PK_UserID ='1FECCEA2-8D0E-433E-8045-079F6ACD6319'"
                , Null.GetDBNull(OrgId)
                , Null.GetDBNull(UserName)
                , Null.GetDBNull(objId)
            );
            var item = new Users();
            return ret;
        }

        public List<Users> GetAll()
        {
            var listOrderOption = new OrderOption[] {
            new OrderOption {
                Column = "UserNameLower",
                OrderType = "ASC",
            }};
            this.GetTableData
            (
            out List<Users> ret
                , "Users", null, null, listOrderOption
            );
            return ret;
        }

        public List<Users> GetList(UsersFilter filter)
        {
            
            var listOrderOption = new OrderOption[] {
            new OrderOption {
                Column = "UserNameLower",
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
