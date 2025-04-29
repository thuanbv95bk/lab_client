using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.DataAccess;
using App.Lab.App.Repository.Interface;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using Microsoft.AspNetCore.Http;

namespace App.Lab.Repository.Implement
{
    /// <summary> Các hàm liên quan đến bảng BCA.LicenseTypes phải được định nghĩa ở interface để gọi </summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public class BcaLicenseTypesRepository : Repo, IBcaLicenseTypesRepository
    {
        public BcaLicenseTypesRepository(IUnitOfWork unitOfWork) : base(unitOfWork) { Schema = "BCA"; }
        public BcaLicenseTypesRepository(IHttpContextAccessor accessor, IUnitOfWork unitOfWork) : base(accessor, unitOfWork) { Schema = "BCA"; }

        /// <summary>Lấy ra danh sách các loại giấy phép lái xe
        /// điều kiện đang kích hoạt (IsActived) và không bị xóa (IsDeteted), săp xếp theo tên</summary>
        /// Author: thuanbv
        /// Created: 24/04/2025
        /// Modified: date - user - description
        public List<BcaLicenseTypes> GetListActive()
        {
            var listItem = new List<BcaLicenseTypes>() { };

            listItem = ExecuteReader<BcaLicenseTypes>
            (
                "SELECT PK_LicenseTypeID AS PkLicenseTypeId , Code, Name, IsActived, IsDeteted " +
                    "FROM  [BCA.LicenseTypes] " +
                    "WHERE  ISNULL(IsDeteted, 0) = 0 " +
                            "AND IsActived = 1 " +
                     "ORDER BY Name;"
            );

            return listItem;
        }
    }
}