

INSERT INTO [dbo].[Admin.UserVehicleGroup]
           ([FK_UserID]
           ,[FK_VehicleGroupID]
           ,[ParentVehicleGroupID]
           ,[IsDeleted])
     VALUES
           (
		    'C291F5BB-705F-4E5F-BDA6-6956D41ED347' --User1
           ,22
           ,10
           ,0)

GO

INSERT INTO [dbo].[Admin.UserVehicleGroup]
           ([FK_UserID]
           ,[FK_VehicleGroupID]
           ,[ParentVehicleGroupID]
           ,[IsDeleted])
     VALUES
           (
		    'C291F5BB-705F-4E5F-BDA6-6956D41ED347'
           ,26
           ,18
           ,0)

go

INSERT INTO [dbo].[Admin.UserVehicleGroup]
           ([FK_UserID]
           ,[FK_VehicleGroupID]
           ,[ParentVehicleGroupID]
           ,[IsDeleted])
     VALUES
           (
		    'C291F5BB-705F-4E5F-BDA6-6956D41ED347' --User1
           ,40
           ,11
           ,0)

GO

INSERT INTO [dbo].[Admin.UserVehicleGroup]
           ([FK_UserID]
           ,[FK_VehicleGroupID]
           ,[ParentVehicleGroupID]
           ,[IsDeleted])
     VALUES
           (
		    'C291F5BB-705F-4E5F-BDA6-6956D41ED347'
           ,98
           ,11
           ,0)

go
delete [dbo].[Admin.UserVehicleGroup] where [FK_VehicleGroupID]=98



INSERT INTO [dbo].[Admin.UserVehicleGroup]
           ([FK_UserID]
           ,[FK_VehicleGroupID]
           ,[ParentVehicleGroupID]
           ,[IsDeleted])
     VALUES
           (
		    '9C30320D-8DD8-4BA1-8B26-F472732253D0'--User10
           ,58
           ,50
           ,0)

-----------------------------------
		   INSERT INTO [dbo].[Admin.UserVehicleGroup]
           ([FK_UserID]
           ,[FK_VehicleGroupID]
           ,[ParentVehicleGroupID]
           ,[IsDeleted])
     VALUES
           (
		    'E3636887-2B12-499C-B80C-FA9BF0275399'--User11
           ,15
           ,0
           ,0)

		   		   INSERT INTO [dbo].[Admin.UserVehicleGroup]
           ([FK_UserID]
           ,[FK_VehicleGroupID]
           ,[ParentVehicleGroupID]
           ,[IsDeleted])
     VALUES
           (
		    'E3636887-2B12-499C-B80C-FA9BF0275399'--User11
           ,76
           ,15
           ,0)




		     select * from [dbo].[Admin.Users] where FK_CompanyID =15076 and IsLock=0 and IsDeleted=0 ORDER BY UserNameLower
  
  select * from [Vehicle.Groups] where FK_CompanyID =15076 and IsDeleted=0 and ParentVehicleGroupID=11
  select * from [Admin.UserVehicleGroup]

  select * from [Vehicle.Groups] where PK_VehicleGroupID =10

  update [dbo].[Admin.Users] set IsLock=0  , IsDeleted =0 ORDER BY Username

  select * from [Admin.UserVehicleGroup] where FK_UserID ='E3636887-2B12-499C-B80C-FA9BF0275399'

  delete [Admin.UserVehicleGroup] where FK_UserID ='E3636887-2B12-499C-B80C-FA9BF0275399'
