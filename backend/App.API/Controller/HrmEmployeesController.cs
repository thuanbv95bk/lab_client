using Microsoft.AspNetCore.Mvc;
using App.Common.BaseControllers;
using App.Lab.Service.Interface;
using App.Lab.Model;
using App.Lab.App.Service.Implement;
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
    }
}