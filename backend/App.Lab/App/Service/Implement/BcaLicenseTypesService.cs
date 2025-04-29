using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using App.Common.BaseService;
using App.DataAccess;
using App.Lab.App.Service.Interface;
using App.Lab.Model;
using App.Lab.Repository.Interface;
using App.Lab.Service.Interface;
using Microsoft.AspNetCore.Http;

namespace App.Lab.Service.Implement
{
    /// <summary> Các hàm Service liên quan đến bảng BCA.LicenseTypes phải được định nghĩa ở interface để gọi </summary>
    /// Author: thuanbv
    /// Created: 24/04/2025
    /// Modified: date - user - description
    public class BcaLicenseTypesService : BaseService<IBcaLicenseTypesRepository>, IBcaLicenseTypesService
    {
        private readonly IUnitOfWork _uow;

        public BcaLicenseTypesService(IHttpContextAccessor accessor, IBcaLicenseTypesRepository repo, IUnitOfWork uow) : base(accessor, repo)
        {
            _uow = uow;
        }

        /// <summary>Lấy ra danh sách các loại giấy phép lái xe
        /// điều kiện đang kích hoạt (IsActived) và không bị xóa (IsDeteted)</summary>
        /// Author: thuanbv
        /// Created: 24/04/2025
        /// Modified: date - user - description
        public List<BcaLicenseTypes> GetListActive()
        {
            return _repo.GetListActive();
        }
    }
}
