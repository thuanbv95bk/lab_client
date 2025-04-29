using App.Common.Models;
using App.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Service.Interface
{

    /// <summary> Các Service interface liên quan đến bảng HRM.Employees</summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public interface IHrmEmployeesService
    {
        /// <summary> Interface Service hàm Lấy danh sách lái xe DisplayName – DriverLicense điều kiện
        /// lái xe thuộc công ty với điều kiện không bị khóa (IsLocked), xóa (IsDeleted)</summary>
        /// <param name="FkCompanyID">Id của công ty</param>
        /// Author: thuanbv
        /// Created: 24/04/2025
        /// Modified: date - user - description
        List<HrmEmployeesCbx> GetListCbx(int FkCompanyID);



        /// <summary>Interface Lấy danh sách lái xe theo điều kiện và theo Paging </summary>
        /// <param name="filter">HrmEmployeesFilter: bộ lọc để lấy dữ liệu</param>
        /// Author: thuanbv
        /// Created: 25/04/2025
        /// Modified: date - user - description
        PagingResult<HrmEmployees> GetPagingToEdit(HrmEmployeesFilter filter);


        /// <summary>Interface cập nhât danh sách thông tin của lái xe </summary>
        /// <param name="items">Danh sách lái xe</param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description
        Task<ServiceStatus> AddOrEditListAsync(List<HrmEmployees> items);

        /// <summary>Interface Xóa mềm 1 lái xe </summary>
        /// <param name="employeeId"> Id của lái xe</param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description
        Task<ServiceStatus> DeleteSoft(int employeeId);


        /// <summary>Interface Export Excel danh sách lái xe theo bộ lọc </summary>
        /// <param name="filter"> Bộ lọc </param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description
        MemoryStream ExportExcel(HrmEmployeesFilterExcel filter);
    }
}
