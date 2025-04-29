USE [GPS3_LAB]
GO

/****** Object:  Table [dbo].[BCA.LicenseTypes]    Script Date: 24/04/2025 5:46:00 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[BCA.LicenseTypes](
	[PK_LicenseTypeID] [INT] NOT NULL,
	[Name] [NVARCHAR](500) NOT NULL,
	[Code] [NVARCHAR](200) NOT NULL,
	[IsActived] [BIT] NOT NULL,
	[IsDeteted] [BIT] NOT NULL,
	[CreatedByUser] [UNIQUEIDENTIFIER] NOT NULL,
	[CreatedDate] [DATETIME] NOT NULL,
	[UpdatedByUser] [UNIQUEIDENTIFIER] NULL,
	[UpdatedDate] [DATETIME] NULL,
 CONSTRAINT [PK_BCA.LicenseTypes] PRIMARY KEY CLUSTERED 
(
	[PK_LicenseTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


USE [GPS3_LAB]
GO

/****** Object:  Table [dbo].[HRM.Employees]    Script Date: 24/04/2025 5:46:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[HRM.Employees](
	[PK_EmployeeID] [int] NOT NULL,
	[EmployeeCode] [varchar](32) NOT NULL,
	[FK_CompanyID] [int] NOT NULL,
	[FK_DepartmentID] [int] NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[DisplayName] [nvarchar](100) NOT NULL,
	[Birthday] [datetime] NULL,
	[Sex] [tinyint] NULL,
	[Address] [nvarchar](150) NULL,
	[Mobile] [varchar](25) NULL,
	[PhoneNumber1] [varchar](25) NULL,
	[PhoneNumber2] [varchar](25) NULL,
	[EmployeeType] [tinyint] NOT NULL,
	[IdentityNumber] [varchar](15) NULL,
	[DriverLicense] [varchar](32) NULL,
	[IssueLicenseDate] [datetime] NULL,
	[IssueLicensePlace] [nvarchar](150) NULL,
	[ExpireLicenseDate] [datetime] NULL,
	[CreatedByUser] [uniqueidentifier] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedByUser] [uniqueidentifier] NULL,
	[UpdatedDate] [datetime] NULL,
	[Flags] [int] NOT NULL,
	[IsSent] [bit] NULL,
	[LicenseType] [int] NULL,
	[DriverImage] [varchar](max) NULL,
	[IsLocked] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[FK_UserID] [uniqueidentifier] NULL,
	[DriverAvatar] [varchar](max) NULL,
	[LockDate] [datetime] NULL,
 CONSTRAINT [PK_HRM.Employees] PRIMARY KEY CLUSTERED 
(
	[PK_EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[HRM.Employees] ADD  CONSTRAINT [DF__HRM.Emplo__FK_De__6DCC4D03]  DEFAULT ((-1)) FOR [FK_DepartmentID]
GO

ALTER TABLE [dbo].[HRM.Employees] ADD  CONSTRAINT [DF__HRM.Emplo__Emplo__6EC0713C]  DEFAULT ((1)) FOR [EmployeeType]
GO

ALTER TABLE [dbo].[HRM.Employees] ADD  CONSTRAINT [DF__HRM.Emplo__Creat__6FB49575]  DEFAULT (getdate()) FOR [CreatedDate]
GO

ALTER TABLE [dbo].[HRM.Employees] ADD  CONSTRAINT [DF__HRM.Emplo__Flags__70A8B9AE]  DEFAULT ((0)) FOR [Flags]
GO



