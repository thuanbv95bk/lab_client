
namespace App.Lab.App.Model
{
    /// <summary>
    ///   <br />
    /// </summary>
    /// <Modified>
    /// Name       Date          Comments
    /// thuanbv 4/16/2025 	nhóm phương tiện
    /// </Modified>
    public class VehicleGroups
    {
        public int PK_VehicleGroupID { get; set; }
        public int? FK_CompanyID { get; set; }
        public int? ParentVehicleGroupId { get; set; }
        public string Name { get; set; }
        public virtual bool? IsDeleted { get; set; }
        public bool? Status { get; set; }
        public List<VehicleGroups>? GroupsChild { get; set; }
        public int? Level { get; set; }
        public bool? HasChild { get; set; }
        public bool? IsHideChildren { get; set; } = false;
        public bool? IsHide { get; set; }
    }

    /// <summary>
    ///   <br />
    /// </summary>
    /// <Modified>
    /// Name       Date          Comments
    /// thuanbv 4/16/2025 	Bộ lọc nhóm phương tiện
    /// </Modified>
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
