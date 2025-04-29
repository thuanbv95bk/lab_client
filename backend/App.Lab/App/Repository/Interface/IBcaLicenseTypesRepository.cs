using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.Lab.Model;


namespace App.Lab.Repository.Interface
{
    /// <summary> interface các hàm liên quan đến bảng BCA.LicenseTypes </summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public interface IBcaLicenseTypesRepository
    {
        /// <summary>Lấy ra danh sách các loại giấy phép lái xe
        /// điều kiện đang kích hoạt (IsActived) và không bị xóa (IsDeteted), săp xếp theo tên</summary>
        /// Author: thuanbv
        /// Created: 24/04/2025
        /// Modified: date - user - descriptions
        public List<BcaLicenseTypes> GetListActive();
    }
}
