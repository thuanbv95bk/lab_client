CREATE TABLE [dbo].[Admin.UserVehicleGroup] (
    [FK_UserID]            UNIQUEIDENTIFIER NOT NULL,
    [FK_VehicleGroupID]    INT              NOT NULL,
    [ParentVehicleGroupID] INT              NULL,
    [CreatedByUser]        UNIQUEIDENTIFIER NULL,
    [CreatedDate]          DATETIME         CONSTRAINT [DF_Admin.UserVehicleGroup_CreatedDate] DEFAULT (getdate()) NULL,
    [UpdateByUser]         UNIQUEIDENTIFIER NULL,
    [UpdatedDate]          DATETIME         CONSTRAINT [DF_Admin.UserVehicleGroup_UpdatedDate] DEFAULT (getdate()) NULL,
    [UpdatedByUser]        UNIQUEIDENTIFIER NULL,
    [IsDeleted]            BIT              NULL,
    CONSTRAINT [PK_Admin.User_VehicleGroup] PRIMARY KEY CLUSTERED ([FK_UserID] ASC, [FK_VehicleGroupID] ASC)
);

