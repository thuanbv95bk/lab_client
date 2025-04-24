using App.DataAccess;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


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
            var listItem = new List < HrmEmployeesCbx >(){};

            listItem = ExecuteReader<HrmEmployeesCbx>
            (
                "SELECT DisplayName, DriverLicense  FROM [HRM.Employees] WHERE ISNULL(IsDeleted, 0) =0 AND ISNULL(IsLocked, 0) =0 AND FK_CompanyID = @FK_CompanyID ",
            CommandType.Text,
                new { FK_CompanyID = FkCompanyID }
            );
    
            return listItem;
        }
    }
}
