using Microsoft.AspNetCore.Mvc;
using App.Common.BaseControllers;
using App.Lab.Service.Interface;
using App.Lab.Model;
using App.Lab.App.Service.Implement;
using static App.Lab.Model.HrmEmployeeValidator;
using FluentValidation;
namespace App.Admin.Controllers
{
    [ApiController]
    [Route("api/hrm-employees")]
    public class HrmEmployeesController : BaseController
    {
        private readonly IHrmEmployeesService _service;

        public HrmEmployeesController(IHrmEmployeesService service)
        {
            _service = service;
        }


        /// <summary> API Lấy danh sách lái xe DisplayName – DriverLicense điều kiện
        /// lái xe thuộc công ty với điều kiện không bị khóa (IsLocked), xóa (IsDeleted) THEO Id công ty</summary>
        /// <param name="filter">HrmEmployeesFilterCbx</param>
        /// Author: thuanbv
        /// Created: 24/04/2025
        /// Modified: date - user - description
        [HttpPost]
        [Route("get-list-cbx")]
        public IActionResult GetListCbx(int FkCompanyID)
        {
            try
            {
                if (FkCompanyID <= 0)
                {
                    return Failure("Phải nhập tiêu chí tìm kiếm");
                }
                var ret = _service.GetListCbx(FkCompanyID);
                return Success(ret);
            }
            catch (Exception ex)
            {
                return Failure("Có lỗi xảy ra với hệ thống");
            }
        }



        /// <summary> Lấy danh sách lái xe, theo paging </summary>
        /// <param name="filter"> Bộ lọc có paging </param>
        /// Author: thuanbv
        /// Created: 25/04/2025
        /// Modified: date - user - description
        [HttpPost]
        [Route("get-paging-to-edit")]
        public IActionResult GetPagingToEdit(HrmEmployeesFilter filter)
        {
            try
            {
                if (filter.FkCompanyId <= 0)
                {
                    return Failure("Phải nhập tiêu chí tìm kiếm");
                }
                var ret = _service.GetPagingToEdit(filter);
                return Success(ret);
            }
            catch (Exception ex)
            {
                return Failure("Có lỗi xảy ra với hệ thống");
            }
            
        }

        /// <summary>Chỉnh sửa danh sách lái xe, check Validator đầu vào hợp lệ</summary>
        /// <param name="items"> Danh sách lái xe cần cập nhật </param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description
        [HttpPost]
        [Route("add-or-edit-list")]
        public async Task<IActionResult> AddOrEditList(List<HrmEmployees> items, [FromServices] IValidator<List<HrmEmployees>> validator)
        {
            try
            {
                var result = await validator.ValidateAsync(items);
                if (!result.IsValid)
                {
                    return BadRequest(new
                    {
                        Errors = result.Errors
                            .GroupBy(x => x.PropertyName)
                            .ToDictionary(x => x.Key, x => x.Select(e => e.ErrorMessage).ToArray())
                    });
                }

                var ret = await _service.AddOrEditListAsync(items);
                return ret.IsSuccess ? Success() : Failure(ret.ErroMessage);
            }
            catch (Exception ex)
            {
                return Failure("Có lỗi xảy ra với hệ thống");
            }

        }


        /// <summary>Xóa mềm 1 lái xe</summary>
        /// <param name="employeeId"> Id lái xe </param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description

        [HttpPost]
        [Route("delete-soft")]
        public async Task<IActionResult> DeleteSoft(int employeeId)
        {
            try
            {
                if (employeeId <= 0)
                {
                    return Failure("Id không hợp lệ");
                }

                var ret = await _service.DeleteSoft(employeeId);
                return ret.IsSuccess ? Success() : Failure(ret.ErroMessage);
            }
            catch (Exception ex)
            {
                return Failure("Có lỗi xảy ra với hệ thống");
            }

        }

        /// <summary>Xuất excel danh sách lái xe theo điều kiện bộ lọc </summary>
        /// <param name="filter"> Bộ lọc theo người dùng chọn </param>
        /// Author: thuanbv
        /// Created: 28/04/2025
        /// Modified: date - user - description

        [HttpPost]
        [Route("export-excel")]
        public async Task<IActionResult> ExportExcel(HrmEmployeesFilterExcel filter)
        {
            try
            {
                if(filter ==null)
                {
                    return Failure("Kiểm tra điều kiện");
                }
                if (filter.FkCompanyId <=0)
                {
                    return Failure("Chưa có điều kiện tìm kiếm theo công ty, vui lòng thử lại");
                }
                var stream = await Task.Run(() => _service.ExportExcel(filter));
                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }
            catch (Exception ex)
            {
                return Failure("Có lỗi xảy ra với hệ thống");
            }
            
        }

    }
}