using App.Common.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace App.Common.BaseControllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {

        /// <summary>Successes the specified data.</summary>
        /// <param name="data">The data.</param>
        /// Author: thuan.bv
        /// Created: 23/04/2025
        /// Modified: date - user - description
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

        /// <summary>Failures the specified error message.</summary>
        /// <param name="ErrorMessage">The error message.</param>
        /// <param name="data">The data.</param>
        /// Author: thuanbv
        /// Created: 23/04/2025
        /// Modified: date - user - description
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
