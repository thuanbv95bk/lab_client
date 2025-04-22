CREATE TABLE [dbo].[Company.Companies] (
    [PK_CompanyID]             INT              NOT NULL,
    [ParentCompanyID]          INT              NULL,
    [CompanyName]              NVARCHAR (250)   NULL,
    [CompanyType]              TINYINT          NOT NULL,
    [Address]                  NVARCHAR (150)   NULL,
    [PhoneNumber]              VARCHAR (50)     NULL,
    [Fax]                      VARCHAR (50)     NULL,
    [Email]                    VARCHAR (50)     NULL,
    [Website]                  VARCHAR (100)    NULL,
    [DateOfEstablishment]      SMALLDATETIME    NULL,
    [FK_ProvindeID]            INT              NULL,
    [LogoImagePath]            VARCHAR (MAX)    NULL,
    [XNCode]                   INT              NOT NULL,
    [ListOfXNForPartner]       VARCHAR (MAX)    NULL,
    [IsLocked]                 BIT              CONSTRAINT [defo_IsLocked] DEFAULT ((0)) NULL,
    [ReasonOfLocked]           NVARCHAR (250)   NULL,
    [IsDeleted]                BIT              CONSTRAINT [defo_IsDelete] DEFAULT ((0)) NULL,
    [ReasonOfDeleted]          NVARCHAR (250)   NULL,
    [HasSimService]            BIT              CONSTRAINT [DF_Company.Companies_HasSimService] DEFAULT ((0)) NOT NULL,
    [Flags]                    SMALLINT         CONSTRAINT [DF_Company.Companies_WizardStep] DEFAULT ((0)) NULL,
    [StartLogfileTime]         DATETIME         CONSTRAINT [DF_Company.Companies_StartLogfileTime] DEFAULT (getdate()) NULL,
    [CreatedByUser]            UNIQUEIDENTIFIER NOT NULL,
    [CreatedDate]              DATETIME         NULL,
    [UpdatedByUser]            UNIQUEIDENTIFIER NULL,
    [UpdatedDate]              DATETIME         NULL,
    [TaxCode]                  VARCHAR (20)     CONSTRAINT [DF__Company.C__TaxCo__0CDEDCBB] DEFAULT ('') NOT NULL,
    [CustomerCode]             VARCHAR (15)     CONSTRAINT [DF__Company.C__Custo__6FDF7DFE] DEFAULT ('') NOT NULL,
    [SimServiceType]           INT              CONSTRAINT [DF_Company.Companies_SimServiceType] DEFAULT ((0)) NOT NULL,
    [AccountantCode]           VARCHAR (50)     CONSTRAINT [DF__Company.C__Accou__6FD55C5D] DEFAULT ('') NOT NULL,
    [KCSChecked]               BIT              NULL,
    [DateKCSChecked]           DATETIME         CONSTRAINT [DF__Company.C__DateK__70C98096] DEFAULT ((0)) NULL,
    [UserKCSChecked]           UNIQUEIDENTIFIER NULL,
    [IsTaxi]                   BIT              NULL,
    [CountLoginInMonth]        INT              NULL,
    [IsBlockXNCode]            BIT              NULL,
    [UpdatedDateIsBlockXNCode] DATETIME         NULL,
    [MonthOfSaveData]          INT              NULL,
    [PrivateCompanyName]       NVARCHAR (250)   NULL,
    [IsAllowGoto]              BIT              NULL,
    [IsBGTForward]             BIT              NULL,
    [Description]              NVARCHAR (MAX)   NULL,
    CONSTRAINT [Pk_Companies] PRIMARY KEY CLUSTERED ([PK_CompanyID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Sim tr? ti?n', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Company.Companies', @level2type = N'COLUMN', @level2name = N'HasSimService';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'1 : BinhAnh
2: Partner
3: EndUser', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Company.Companies', @level2type = N'COLUMN', @level2name = N'CompanyType';

