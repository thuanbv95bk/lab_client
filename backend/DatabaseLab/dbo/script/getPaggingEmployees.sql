DECLARE @FK_CompanyID INT = 15076;
DECLARE @pageSize INT = 50;
DECLARE @pageIndex INT = 1;
DECLARE @DisplayName NVARCHAR(100) = N'';
DECLARE @DriverLicense NVARCHAR(32) = N'';
DECLARE @LicenseType INT = NULL;

DECLARE @ListEmployeeId NVARCHAR(50) = N'';
DECLARE @ListStringLicenseTypesId NVARCHAR(50) = N'';

SELECT PK_EmployeeID AS PkEmployeeID,
       CASE
           WHEN UpdatedDate IS NULL THEN
               CreatedDate
           ELSE
               UpdatedDate
       END [UpdatedDate],
       DisplayName,
       Mobile,
       DriverLicense,
       IssueLicenseDate,
       ExpireLicenseDate,
       IssueLicensePlace,
       LicenseType,
       COUNT(*) OVER () AS TotalCount
FROM dbo.[HRM.Employees]
WHERE FK_CompanyID = @FK_CompanyID
      AND ISNULL(IsDeleted, 0) = 0
      AND ISNULL(IsLocked, 0) = 0
      AND
      (
          @DisplayName IS NULL
          OR LOWER(DisplayName) LIKE '%' + LOWER(@DisplayName) + '%'
      )
      AND
      (
          @DriverLicense IS NULL
          OR LOWER(DriverLicense) LIKE '%' + LOWER(@DriverLicense) + '%'
      )
      AND
      (
          @LicenseType IS NULL
          OR LicenseType = @LicenseType
      )
      AND
      (
          ISNULL(@ListEmployeeId, '') = ''
          OR ',' + @ListEmployeeId + ',' LIKE '%,' + CAST(PK_EmployeeID AS NVARCHAR) + ',%'
      )
      AND
      (
          ISNULL(@ListStringLicenseTypesId, '') = ''
          OR ',' + @ListStringLicenseTypesId + ',' LIKE '%,' + CAST(LicenseType AS NVARCHAR) + ',%'
      )
ORDER BY DisplayName OFFSET @pageSize * (@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY;