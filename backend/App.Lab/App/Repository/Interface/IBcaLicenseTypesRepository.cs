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
        public List<BcaLicenseTypes> GetListActive();
    }
}
