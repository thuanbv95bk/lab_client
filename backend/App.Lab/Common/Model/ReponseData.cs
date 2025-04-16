using System.Net;

namespace App.Common.Models
{
    public class ReponseData
    {
        public bool IsSuccess { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public string ErrorMessage { get; set; }
        public object Data { get; set; }

    }
}
