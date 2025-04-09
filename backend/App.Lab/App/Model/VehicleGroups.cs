using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Lab.App.Model
{
    public class VehicleGroups
    {
        public int VehicleGroupId { get; set; }
        public int CompanyId { get; set; }
        public int? ParentVehicleGroupId { get; set; }
        [Required]
        [Column(TypeName = "nvarchar(250)")]
        public string Name { get; set; }

        [Column("CreatedByUser")]
        public Guid? CreatedByUser { get; set; }

        [Column("CreatedDate")]
        public DateTime? CreatedDate { get; set; }

        [Column("UpdatedByUser")]
        public Guid? UpdatedByUser { get; set; }

        [Column("UpdatedDate")]
        public DateTime? UpdatedDate { get; set; }

        [Column("DistanceA")]
        public double? DistanceA { get; set; }

        [Column("DistanceB")]
        public double? DistanceB { get; set; }

        [Column("MinuteA")]
        public int? MinuteA { get; set; }

        [Column("MinuteB")]
        public int? MinuteB { get; set; }

        [Column("FK_BGTProvincellD")]
        public int? BGTProvinceId { get; set; }

        [Column("IsDeleted")]
        public bool? IsDeleted { get; set; }

        [Required]
        [Column("Flag")]
        public int Flag { get; set; }

        [Column("Status")]
        public bool? Status { get; set; }
    }
}
