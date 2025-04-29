using Microsoft.AspNetCore.Mvc;
using App.Common.BaseControllers;
using App.Lab.Service.Interface;
using App.Lab.Model;
using App.Lab.App.Service.Implement;
namespace App.Admin.Controllers
{
    [ApiController]
    [Route("api/bca-license-types")]
    public class BcaLicenseTypesController : BaseController
    {
        private readonly IBcaLicenseTypesService _service;

        public BcaLicenseTypesController(IBcaLicenseTypesService service)
        {
            _service = service;
        }


        /// <summary> API Lấy danh sách lái xe DisplayName – DriverLicense điều kiện
        /// lái xe thuộc công ty với điều kiện không bị khóa (IsLocked), xóa (IsDeleted) THEO Id công ty</summary>
        /// <param name="filter">HrmEmployeesFilterCbx</param>
        /// Author: thuanbv
        /// Created: 24/04/2025
        /// Modified: date - user - description
        [HttpGet]
        [Route("get-list-active")]
        public IActionResult GetListActive()
        {

            try
            {
                var ret = _service.GetListActive();
                return Success(ret);
            }
            catch (Exception ex)
            {
                return Failure("Có lỗi xảy ra với hệ thống");
            }

        }
    }
}