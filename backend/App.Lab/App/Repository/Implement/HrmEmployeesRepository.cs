using App.Common.Helper;
using App.Common.Models;
using App.DataAccess;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using System.Data;
using System.Security.Cryptography;


namespace App.Lab.Repository.Implement
{
    /// <summary> Các hàm liên quan đến bảng HRM.Employees phải được định nghĩa ở interface để gọi </summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public class HrmEmployeesRepository : Repo, IHrmEmployeesRepository
    {
        public HrmEmployeesRepository(IUnitOfWork unitOfWork) : base(unitOfWork) { Schema = "HRM"; }
        public HrmEmployeesRepository(IHttpContextAccessor accessor, IUnitOfWork unitOfWork) : base(accessor, unitOfWork) { Schema = "HRM"; }


        /// <summary> hàm Lấy danh sách lái xe DisplayName – DriverLicense điều kiện
        /// lái xe thuộc công ty với điều kiện không bị khóa (IsLocked), xóa (IsDeleted)</summary>
        /// <param name="FkCompanyID">Id của công ty</param>
        /// Author: thuanbv
        /// Created: 24/04/2025
        /// Modified: date - user - description
        public List<HrmEmployeesCbx> GetListCbx(int FkCompanyID)
        {
            var listItem = new List<HrmEmployeesCbx>() { };

            listItem = ExecuteReader<HrmEmployeesCbx>
            (
                "SELECT PK_EmployeeID as PkEmployeeID , DisplayName, DriverLicense FROM [HRM.Employees] WHERE ISNULL(IsDeleted, 0) = 0 AND ISNULL(IsLocked, 0) = 0 AND FK_CompanyID = @FK_CompanyID ;",
            CommandType.Text,
                new { FK_CompanyID = FkCompanyID }
            );

            return listItem;
        }

        /// <summary>Lấy danh sách lái xe theo điều kiện và theo Paging </summary>
        /// <param name="filter">HrmEmployeesFilter: bộ lọc để lấy dữ liệu</param>
        /// Author: thuanbv
        /// Created: 25/04/2025
        /// Modified: date - user - description
        public PagingResult<HrmEmployees> GetPagingToEdit(HrmEmployeesFilter filter)
        {

            this.ExecuteReader
            (
                out List<HrmEmployees> listItem
                , out int TotalCount
                , "SELECT PK_EmployeeID AS PkEmployeeID" +
                          ",CASE WHEN UpdatedDate IS NULL THEN CreatedDate ELSE UpdatedDate END [UpdatedDate]" +
                          ",DisplayName" +
                          ",Mobile" +
                          ",DriverLicense" +
                          ",IssueLicenseDate" +
                          ",ExpireLicenseDate" +
                          ",IssueLicensePlace" +
                          ",LicenseType" +
                          ",COUNT(*) OVER () AS TotalCount " +
                    "FROM dbo.[HRM.Employees] " +
                    "WHERE FK_CompanyID = @FK_CompanyID " +
                           "AND ISNULL(IsDeleted, 0) = 0 " +
                           "AND ISNULL(IsLocked, 0) = 0 " +
                           "AND (@Name IS NULL OR Name LIKE '%' + @Name + '%')" +
                           "AND (@DriverLicense IS NULL OR DriverLicense LIKE '%' + @DriverLicense + '%')" +
                           "AND (ISNULL(@ListStringLicenseTypesId, '') = '' OR ',' + @ListStringLicenseTypesId + ',' LIKE '%,' + CAST(LicenseType AS NVARCHAR) + ',%' )" +
                           "AND (ISNULL(@ListStringEmployeesId, '') = '' OR ',' + @ListStringEmployeesId + ',' LIKE '%,' + CAST(PK_EmployeeID AS NVARCHAR) + ',%' )" +
                    "ORDER BY DisplayName OFFSET @pageSize * (@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY"
                , CommandType.Text
                , new { FK_CompanyID = filter.FkCompanyId,
                        Name = filter.DisplayName,
                        DriverLicense = filter.DriverLicense,
                        ListStringLicenseTypesId = filter.ListStringLicenseTypesId,
                        ListStringEmployeesId =filter.ListStringEmployeesId,

                        pageSize = filter.PageSize ,
                        pageIndex = filter.PageIndex
                }

            );

            var ret = new PagingResult<HrmEmployees>()
            {
                TotalCount = TotalCount,
                Data = listItem,
            };
            return ret;
        }
        /// <summary> Lấy danh sách lái xe theo điều kiện => xuất Excel </summary>
        /// <param name="filter">HrmEmployeesFilter: bộ lọc để lấy dữ liệu</param>
        /// Author: thuanbv
        /// Created: 25/04/2025
        /// Modified: date - user - description
        public List<HrmEmployees> GetDataToExcel(HrmEmployeesFilterExcel filter)
        {

            var listItem = this.ExecuteReader<HrmEmployees>
            (
               "SELECT PK_EmployeeID AS PkEmployeeID" +
                          ",CASE WHEN UpdatedDate IS NULL THEN CreatedDate ELSE UpdatedDate END [UpdatedDate]" +
                          ",DisplayName" +
                          ",Mobile" +
                          ",DriverLicense" +
                          ",IssueLicenseDate" +
                          ",ExpireLicenseDate" +
                          ",IssueLicensePlace" +
                          ",(SELECT B.Name FROM dbo.[BCA.LicenseTypes] B WHERE B.PK_LicenseTypeID = LicenseType) LicenseType " +
                         
                    "FROM dbo.[HRM.Employees] " +
                    "WHERE FK_CompanyID = @FK_CompanyID " +
                           "AND ISNULL(IsDeleted, 0) = 0 " +
                           "AND ISNULL(IsLocked, 0) = 0 " +
                           "AND (@Name IS NULL OR Name LIKE '%' + @Name + '%') " +
                           "AND (@DriverLicense IS NULL OR DriverLicense LIKE '%' + @DriverLicense + '%') " +
                           "AND (ISNULL(@ListStringLicenseTypesId, '') = '' OR ',' + @ListStringLicenseTypesId + ',' LIKE '%,' + CAST(LicenseType AS NVARCHAR) + ',%' ) " +
                           "AND (ISNULL(@ListStringEmployeesId, '') = '' OR ',' + @ListStringEmployeesId + ',' LIKE '%,' + CAST(PK_EmployeeID AS NVARCHAR) + ',%' ) " +
                    "ORDER BY DisplayName"
                , CommandType.Text
                , new
                {
                    FK_CompanyID = filter.FkCompanyId,
                    Name = filter.DisplayName,
                    DriverLicense = filter.DriverLicense,
                    ListStringLicenseTypesId = filter.ListStringLicenseTypesId,
                    ListStringEmployeesId = filter.ListStringEmployeesId,
                }

            );

            return listItem;
        }

        /// <summary>Updates Thông tin của 1 lái xe.</summary>
        /// <param name="obj">HrmEmployees thông tin của 1 lái xe</param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description
        public Task Update(HrmEmployees item)
        {
            var user = "E66E300E-B644-41B0-8124-CE9954434C6F";
            var now = DateTime.Now;

            string sql =
               "UPDATE [HRM.Employees] SET " +
                            " DisplayName = @DisplayName " +
                            ",Name = @Name " +
                            ",Mobile = @Mobile " +
                            ",DriverLicense = @DriverLicense" +
                            ",IssueLicenseDate = @IssueLicenseDate " +
                            ",ExpireLicenseDate = @ExpireLicenseDate " +
                            ",IssueLicensePlace = @IssueLicensePlace " +
                            ",LicenseType = @LicenseType" +
                            ",UpdatedDate = @UpdatedDate" +
                            ",UpdatedByUser = @UpdatedByUser " +
                           "WHERE PK_EmployeeID = @PK_EmployeeID;";
            return Task.Run(() => this.ExecuteScalar<int>
            (
                sql
               , CommandType.Text
                , new
                {
                    DisplayName = item.DisplayName,
                    Name = StringHepler.RemoveDiacriticsToUpper(item.DisplayName),
                    Mobile = item.Mobile,
                    DriverLicense = StringHepler.RemoveDiacriticsToUpper(item.DriverLicense),
                    IssueLicenseDate = item.IssueLicenseDate,
                    ExpireLicenseDate = item.ExpireLicenseDate,
                    IssueLicensePlace = item.IssueLicensePlace,
                    LicenseType = item.LicenseType,

                    UpdateByUser = user,
                    UpdatedDate = now,
                    UpdatedByUser = user,
                    PK_EmployeeID = item.PkEmployeeId
                }
            ));
        }


        /// <summary>Xóa mềm 1 lái xe. isDelete =0 </summary>
        /// <param name="employeeId">id lái xe</param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description
        public Task DeleteSoft(int employeeId)
        {
            var user = "E66E300E-B644-41B0-8124-CE9954434C6F";
            var now = DateTime.Now;

            string sql =
               "UPDATE [HRM.Employees] SET " +
                            "IsDeleted = 1 " +
                            ",UpdatedDate = @UpdatedDate" +
                            ",UpdatedByUser = @UpdatedByUser " +
                           "WHERE PK_EmployeeID = @PK_EmployeeID;";
            return Task.Run(() => this.ExecuteScalar<int>
            (
                sql
               , CommandType.Text
                , new
                {
                    PK_EmployeeID = employeeId,
                    UpdateByUser = user,
                    UpdatedDate = now,
                    UpdatedByUser = user
                }
            ));

        }
    }
}
