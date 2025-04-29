CREATE TABLE [dbo].[Vehicle.Vehicles] (
    [FK_CompanyID] INT           NOT NULL,
    [PK_VehicleID] BIGINT        NOT NULL,
    [VehiclePlate] VARCHAR (16)  NOT NULL,
    [PrivateCode]  NVARCHAR (50) NOT NULL,
    [IMEI]         VARCHAR (32)  NULL,
    [IsLocked]     BIT           CONSTRAINT [DF_Vehicle.Vehicles_IsLocked] DEFAULT ((0)) NULL,
    [IsDeleted]    BIT           CONSTRAINT [DF_Vehicle.Vehicles_IsDeleted] DEFAULT ((0)) NULL,
    [XNCode]       INT           CONSTRAINT [DF__Vehicle.V__XNCod__468862B0] DEFAULT ((0)) NOT NULL,
    [IsCam]        BIT           CONSTRAINT [DF__Vehicle.V__IsCam__71BDA4CF] DEFAULT ((0)) NOT NULL,
    [IsVideoCam]   BIT           NULL,
    CONSTRAINT [PK_Vehicle.Vehicles_1] PRIMARY KEY CLUSTERED ([PK_VehicleID] ASC),
    CONSTRAINT [UQ__Vehicle.__F32E91F8E9FA76DE] UNIQUE NONCLUSTERED ([VehiclePlate] ASC, [XNCode] ASC)
);

