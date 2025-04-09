using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.Model
{
    public class AdminUserVehicleGroup
    {
        public Guid FK_UserID { get; set; }
        public int FK_VehicleGroupID { get; set; }
        public int? ParentVehicleGroupID { get; set; }
        public Guid? CreatedByUser { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid? UpdateByUser { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Guid? UpdatedByUser { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
