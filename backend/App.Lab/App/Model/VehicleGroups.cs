
namespace App.Lab.App.Model
{
    public class VehicleGroups
    {
        public int? PK_VehicleGroupID { get; set; }
        public int? FK_CompanyID { get; set; }
        public int? ParentVehicleGroupId { get; set; }
        public string Name { get; set; }
        public virtual bool? IsDeleted { get; set; }
        public bool? Status { get; set; }
        public List<VehicleGroups>? groupsChild { get; set; }
        public int? Level { get; set; }
        public bool? hasChild { get; set; }
        public bool? isHideChildren { get; set; }
        public bool? isHide { get; set; }
    }

    public class VehicleGroupsFilter
    {
        public int? PK_VehicleGroupID { get; set; }
        public string PK_UserID { get; set; }
        public int? FK_CompanyID { get; set; }
        public int? ParentVehicleGroupID { get; set; }
        public string Name { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? Status { get; set; }
    }
}
