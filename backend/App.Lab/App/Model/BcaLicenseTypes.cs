using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Model
{
    public class BcaLicenseTypes
    {
        public int PkLicenseTypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsActived { get; set; }
        public bool? IsDeteted { get; set; }
    }
    public class BcaLicenseTypesfilter
    {
        public bool IsActived { get; set; }
        public bool? IsDeteted { get; set; }
    }
}
