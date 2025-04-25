using App.DataAccess;
using System.Net;

namespace App.Common.Models
{
    /// <summary>ReponseData: Cấu trúc Message phản hồi cho API </summary>
    /// Author: thuanbv
    /// Created: 25/04/2025
    /// Modified: date - user - description
    public class ReponseData
    {
        /// <summary>Trạng thái: is success = true; ngược lại false</summary>
        public bool IsSuccess { get; set; }
        /// <summary>Gets or sets the status code.</summary>
        public HttpStatusCode StatusCode { get; set; }

        /// <summary>Message phản hồi khi lỗi</summary>
        public string ErrorMessage { get; set; }

        /// <summary>Dữ liệu phản hồi</summary>
        public object Data { get; set; }

    }


}
