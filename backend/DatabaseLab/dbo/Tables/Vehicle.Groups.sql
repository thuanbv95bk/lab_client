CREATE TABLE [dbo].[Vehicle.Groups] (
    [FK_CompanyID]         INT              NOT NULL,
    [PK_VehicleGroupID]    INT              NOT NULL,
    [ParentVehicleGroupID] INT              NULL,
    [Name]                 NVARCHAR (250)   NOT NULL,
    [CreatedByUser]        UNIQUEIDENTIFIER NULL,
    [CreatedDate]          DATETIME         CONSTRAINT [DF_Vehicle.Groups_CreatedDate] DEFAULT (getdate()) NULL,
    [UpdatedByUser]        UNIQUEIDENTIFIER NULL,
    [UpdatedDate]          DATETIME         CONSTRAINT [DF_Vehicle.Groups_UpdatedDate] DEFAULT (getdate()) NULL,
    [DistanceA]            FLOAT (53)       NULL,
    [DistanceB]            FLOAT (53)       NULL,
    [MinuteA]              INT              NULL,
    [MinuteB]              INT              NULL,
    [FK_BGTProvinceID]     INT              NULL,
    [IsDeleted]            BIT              NULL,
    [Flag]                 INT              CONSTRAINT [DF__Vehicle.Gr__Flag__1F98B2C1] DEFAULT ((0)) NOT NULL,
    [Status]               BIT              CONSTRAINT [DF_Vehicle.Groups_Status] DEFAULT ((1)) NULL,
    CONSTRAINT [PK_Vehicle.Groups] PRIMARY KEY CLUSTERED ([PK_VehicleGroupID] ASC)
);

