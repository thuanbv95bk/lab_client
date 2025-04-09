using App.Common.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace App.Common.BaseControllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {

        [NonAction]
        public IActionResult Success(object data = null)
        {
            ReponseData ret = new()
            {
                IsSuccess = true,
                StatusCode = HttpStatusCode.OK,
                Data = data,
            };

            return Ok(ret);
        }

        [NonAction]
        public IActionResult Failure(string ErrorMessage = null, object data = null)
        {
            ReponseData ret = new()
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest,
                ErrorMessage = ErrorMessage,
                Data = data,
            };

            return Ok(ret);
        }
    }
}
