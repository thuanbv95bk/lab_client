using App.Common.BaseService;
using App.Common.Helper;
using App.Common.Models;
using App.DataAccess;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using App.Lab.Service.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.App.Service.Implement
{

    /// <summary> Các hàm Service liên quan đến bảng HRM.Employees phải được định nghĩa ở interface để gọi </summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public class HrmEmployeesService : BaseService<IHrmEmployeesRepository>, IHrmEmployeesService
    {
        private readonly IUnitOfWork _uow;

        public HrmEmployeesService(IHttpContextAccessor accessor, IHrmEmployeesRepository repo, IUnitOfWork uow) : base(accessor, repo)
        {
            _uow = uow;
        }


        /// <summary> Hàm Lấy danh sách lái xe DisplayName – DriverLicense điều kiện
        /// lái xe thuộc công ty với điều kiện không bị khóa (IsLocked), xóa (IsDeleted)</summary>
        /// <param name="FkCompanyID">Id của công ty</param>
        /// Author: thuanbv
        /// Created: 24/04/2025
        /// Modified: date - user - description
        public List<HrmEmployeesCbx> GetListCbx(int FkCompanyID)
        {
            return _repo.GetListCbx(FkCompanyID);
        }

        /// <summary>Service Lấy danh sách lái xe theo điều kiện và theo Paging </summary>
        /// <param name="filter">HrmEmployeesFilter: bộ lọc để lấy dữ liệu</param>
        /// Author: thuanbv
        /// Created: 25/04/2025
        /// Modified: date - user - description
        public PagingResult<HrmEmployees> GetPagingToEdit(HrmEmployeesFilter filter)
        {
            if (string.IsNullOrEmpty(filter.option.Key) || string.IsNullOrEmpty(filter.option.Value))
            {
                filter.DisplayName = "";
                filter.DriverLicense = "";
            }
            else if (string.Equals(filter.option.Key.ToLower(), "DisplayName".ToLower()))
            {
                filter.DisplayName = filter.option.Value;
            }
            else
            {
                filter.DriverLicense = filter.option.Value;
            }
                return _repo.GetPagingToEdit(filter);
        }
    }
}
