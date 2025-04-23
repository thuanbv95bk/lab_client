CREATE TABLE [dbo].[BCA.LicenseTypes] (
    [PK_LicenseTypeID] INT              NOT NULL,
    [Name]             NVARCHAR (500)   NOT NULL,
    [Code]             NVARCHAR (200)   NOT NULL,
    [IsActived]        BIT              NOT NULL,
    [IsDeteted]        BIT              NOT NULL,
    [CreatedByUser]    UNIQUEIDENTIFIER NOT NULL,
    [CreatedDate]      DATETIME         NOT NULL,
    [UpdatedByUser]    UNIQUEIDENTIFIER NULL,
    [UpdatedDate]      DATETIME         NULL,
    CONSTRAINT [PK_BCA.LicenseTypes] PRIMARY KEY CLUSTERED ([PK_LicenseTypeID] ASC)
);

