using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Common.Models
{

    /// <summary> bộ lọc theo Paging </summary>
    /// Author: thuanbv
    /// Created: 25/04/2025
    /// Modified: date - user - description
    public class PagingFilter
    {

        /// <summary> Page hiện tại</summary>
        public int PageIndex { get; set; }

        /// <summary> Kích thước phần tử 1 page </summary>
        public int PageSize { get; set; }

    }

    /// <summary> Data phản hồi khi gọi cấu trúc data phân trang PagingResult </summary>
    /// <typeparam name="T"></typeparam>
    /// Author: thuanbv
    /// Created: 25/04/2025
    /// Modified: date - user - description
    public class PagingResult<T>
    {
        /// <summary> Tổng số trang </summary>
        public int TotalCount { get; set; }

        /// <summary> List Data </summary>
        public List<T> Data { get; set; }
    }
}
