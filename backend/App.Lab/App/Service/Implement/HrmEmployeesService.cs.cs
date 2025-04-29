using App.Common.BaseService;
using App.Common.Helper;
using App.Common.Models;
using App.DataAccess;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using App.Lab.Service.Interface;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
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
                filter.DisplayName = StringHepler.RemoveDiacriticsToUpper(filter.option.Value);
            }
            else
            {
                filter.DriverLicense = StringHepler.RemoveDiacriticsToUpper(filter.option.Value);
            }
                return _repo.GetPagingToEdit(filter);
        }

        /// <summary>Service hàm cập nhât danh sách thông tin của lái xe </summary>
        /// <param name="items">Danh sách lái xe</param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description
        public async Task<ServiceStatus> AddOrEditListAsync(List<HrmEmployees> items)
        {

            try
            {
                if (!items.Any())
                {
                    return  ServiceStatus.Failure("Danh sách trống!");
                }

                using (_uow.BeginTransaction())
                {
                    foreach (var item in items)
                    {
                        if (item.PkEmployeeId > 0)
                        {
                            await _repo.Update(item);
                        }
                    }

                    _uow.SaveChanges();
                    return ServiceStatus.Success("Cập nhật thành công");
                }
            }
            catch (Exception ex)
            {
                return ServiceStatus.Failure("Đã xảy ra lỗi trong quá trình cập nhật!");
            }
        }


        /// <summary>service hàm Xóa mềm 1 lái xe </summary>
        /// <param name="employeeId"> Id của lái xe</param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description
        public async Task<ServiceStatus> DeleteSoft(int employeeId)
        {
            try
            {
                using (_uow.BeginTransaction())
                {
                    await _repo.DeleteSoft(employeeId);
                    _uow.SaveChanges();
                    return ServiceStatus.Success("Xóa thành công");
                }
            }
            catch (Exception ex)
            {
                return ServiceStatus.Failure("Đã xảy ra lỗi trong quá trình xóa!");
            }
        }


        /// <summary>Service hamf Export Excel danh sách lái xe theo bộ lọc </summary>
        /// <param name="filter"> Bộ lọc </param>
        /// Author: thuanbv
        /// Created: 29/04/2025
        /// Modified: date - user - description
        public MemoryStream ExportExcel(HrmEmployeesFilterExcel filter)
        {
            try
            {
                MemoryStream stream;
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
                using (var package = new ExcelPackage())
                {
                    var ws = package.Workbook.Worksheets.Add("DATA");

                    if (string.IsNullOrEmpty(filter.option.Key) || string.IsNullOrEmpty(filter.option.Value))
                    {
                        filter.DisplayName = "";
                        filter.DriverLicense = "";
                    }
                    else if (string.Equals(filter.option.Key.ToLower(), "DisplayName".ToLower()))
                    {
                        filter.DisplayName = StringHepler.RemoveDiacriticsToUpper(filter.option.Value);
                    }
                    else
                    {
                        filter.DriverLicense = StringHepler.RemoveDiacriticsToUpper(filter.option.Value);
                    }

                    // lay du lieu
                    var listData = _repo.GetDataToExcel(filter);
                    string title = string.Empty;

                    var listFilter = new List<Lab.Model.SearchOption>() { };

                    title = "THÔNG TIN LÁI XE";

              
                    if (!string.IsNullOrEmpty(filter.ListStringEmployeesId))
                    {
                        listFilter.Add(new Lab.Model.SearchOption
                        {
                            Key = "Danh sách lái xe",
                            Value = filter.ListStringEmployeesName
                        });
                    }
                    if (!string.IsNullOrEmpty(filter.ListStringLicenseTypesName))
                    {
                        listFilter.Add(new Lab.Model.SearchOption
                        {
                            Key = "Loại bằng",
                            Value = filter.ListStringLicenseTypesName
                        });
                    }
                    if (!string.IsNullOrEmpty(filter.option.Value))
                    {
                        listFilter.Add(new Lab.Model.SearchOption
                        {
                            Key = filter.option.Key == "displayName" ? "Tên lái xe" : "GPLX",
                            Value = filter.option.Value
                        });
                    }
              
                    EmployessReportExcel.FillExcell(ws, title, listFilter, 1, listData, EmployessReportExcel.HeaderRows());

                    stream = new MemoryStream(package.GetAsByteArray());
                }

                return stream;
            }
            catch (Exception ex)
            {
                return new MemoryStream(); 
            }
        }
    }
}
