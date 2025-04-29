CREATE TABLE [dbo].[Admin.Users] (
    [PK_UserID]                  UNIQUEIDENTIFIER NOT NULL,
    [FK_CompanyID]               INT              NOT NULL,
    [Username]                   NVARCHAR (50)    NOT NULL,
    [UserNameLower]              NVARCHAR (50)    NOT NULL,
    [Password]                   NVARCHAR (250)   NOT NULL,
    [Fullname]                   NVARCHAR (250)   NOT NULL,
    [UserType]                   TINYINT          CONSTRAINT [DF_Admin.Users_UserType] DEFAULT ((0)) NOT NULL,
    [IsLock]                     BIT              CONSTRAINT [DF_Admin.Users_IsLock] DEFAULT ((0)) NOT NULL,
    [LastPasswordChanged]        SMALLDATETIME    NULL,
    [ChangePasswordAfterDays]    SMALLINT         CONSTRAINT [DF_Admin.Users_ChangePasswordAfterDays] DEFAULT ((0)) NULL,
    [CreatedByUser]              UNIQUEIDENTIFIER NOT NULL,
    [CreatedDate]                DATETIME         NULL,
    [UpdatedByUser]              UNIQUEIDENTIFIER NULL,
    [UpdatedDate]                DATETIME         NULL,
    [LastLoginDate]              SMALLDATETIME    NULL,
    [LockLevel]                  TINYINT          NULL,
    [IsDeleted]                  BIT              CONSTRAINT [DF_Admin.Users_IsDeleted] DEFAULT ((0)) NULL,
    [PhoneNumber]                VARCHAR (50)     NULL,
    [CreatedIP]                  VARCHAR (50)     NULL,
    [UpdatedIP]                  VARCHAR (50)     NULL,
    [Email]                      VARCHAR (50)     NULL,
    [AllowedAccessIP]            VARCHAR (MAX)    NULL,
    [UseSecurityCodeSMS]         BIT              CONSTRAINT [DF__Admin.Use__UseSe__044996BA] DEFAULT ((0)) NOT NULL,
    [UsernameBAP]                NVARCHAR (300)   NULL,
    [LoginType]                  VARCHAR (500)    NULL,
    [SuperiorSaleID]             UNIQUEIDENTIFIER NULL,
    [ExtendChangePasswordDays]   SMALLINT         CONSTRAINT [DF_Admin.Users_ExtendChangePasswordDays] DEFAULT ((5)) NOT NULL,
    [IsActived]                  BIT              CONSTRAINT [DF_Admin.Users_IsActived] DEFAULT ((1)) NOT NULL,
    [ActivedDate]                DATETIME         NULL,
    [RequiredChangePasswordDays] SMALLINT         CONSTRAINT [DF_Admin.Users_RequiredChangePasswordDays] DEFAULT ((3)) NOT NULL,
    [IsWeakPassword]             BIT              NULL,
    [KeepWeakPasswordDate]       DATETIME         NULL,
    CONSTRAINT [PK_Admin.Users] PRIMARY KEY CLUSTERED ([PK_UserID] ASC),
    CONSTRAINT [FK_Users_Company] FOREIGN KEY ([FK_CompanyID]) REFERENCES [dbo].[Company.Companies] ([PK_CompanyID]),
    CONSTRAINT [uc_Admin.Users_UserName] UNIQUE NONCLUSTERED ([Username] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Th?i ?i?m ??ng nh?p g?n ?ây', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Admin.Users', @level2type = N'COLUMN', @level2name = N'LastLoginDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'<= 0 : không yêu c?u ??i m?t kh?u, N : s? ngày yêu c?u ??i sau', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Admin.Users', @level2type = N'COLUMN', @level2name = N'ChangePasswordAfterDays';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Th?i ?i?m thay ??i m?t kh?u g?n ?ây', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Admin.Users', @level2type = N'COLUMN', @level2name = N'LastPasswordChanged';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'M?c ??nh là không khóa', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Admin.Users', @level2type = N'COLUMN', @level2name = N'IsLock';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'0: Normal, 1 : Administrator', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Admin.Users', @level2type = N'COLUMN', @level2name = N'UserType';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Tên ??ng nh?p d?ng ch? th??ng h?t.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Admin.Users', @level2type = N'COLUMN', @level2name = N'UserNameLower';

