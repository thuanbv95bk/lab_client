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
            if (FkCompanyID <=0)
            {
                return Failure("Phải nhập tiêu chí tìm kiếm");
            }
            var ret = _service.GetListCbx(FkCompanyID);
            return Success(ret);
        }

        [HttpPost]
        [Route("get-paging-to-edit")]
        public IActionResult GetPagingToEdit(HrmEmployeesFilter filter)
        {
            if (filter.FkCompanyId <= 0)
            {
                return Failure("Phải nhập tiêu chí tìm kiếm");
            }
            var ret = _service.GetPagingToEdit(filter);
            return Success(ret);
        }

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

        [HttpPost]
        [Route("delete-soft")]
        public async Task<IActionResult> DeleteSoft(int employeeId)
        {
            try
            {
                if (employeeId<=0)
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
    }
}