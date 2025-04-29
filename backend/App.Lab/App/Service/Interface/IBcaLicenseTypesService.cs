using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.Common.BaseService;
using App.Lab.Model;

namespace App.Lab.Service.Interface
{
    /// <summary> Các hàm Service liên quan đến bảng BCA.LicenseTypes phải được định nghĩa ở interface để gọi </summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public interface IBcaLicenseTypesService : IBaseService
    {

        /// <summary>Lấy ra danh sách các loại giấy phép lái xe
        /// điều kiện đang kích hoạt (IsActived) và không bị xóa (IsDeteted)</summary>
        /// Author: thuanbv
        /// Created: 24/04/2025
        /// Modified: date - user - description
        public List<BcaLicenseTypes> GetListActive();
    }
}
