CREATE TABLE [dbo].[Vehicle.VehicleGroups] (
    [FK_CompanyID]      INT NOT NULL,
    [FK_VehicleGroupID] INT NOT NULL,
    [FK_VehicleID]      INT NOT NULL,
    [IsDeleted]         BIT NULL,
    CONSTRAINT [PK_Vehicle.VehicleGroups] PRIMARY KEY CLUSTERED ([FK_VehicleGroupID] ASC, [FK_VehicleID] ASC)
);

