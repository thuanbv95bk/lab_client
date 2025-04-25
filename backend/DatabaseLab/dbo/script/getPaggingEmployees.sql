DECLARE @FK_CompanyID INT = 15076;
DECLARE @pageSize INT = 50;
DECLARE @pageIndex INT = 1;
DECLARE @DisplayName NVARCHAR(100) = N'';
DECLARE @DriverLicense NVARCHAR(32) = N'';
DECLARE @LicenseType INT = NULL;

DECLARE @ListEmployeeId NVARCHAR(50) = N'';
DECLARE @ListStringLicenseTypesId NVARCHAR(50) = N'';
SELECT A.PK_EmployeeID AS PkEmployeeID,
       A.*,
       COUNT(*) OVER () AS TotalCount
FROM dbo.[HRM.Employees] A
WHERE A.FK_CompanyID = @FK_CompanyID
      AND ISNULL(A.IsDeleted, 0) = 0
      AND ISNULL(A.IsLocked, 0) = 0
      AND
      (
          @DisplayName IS NULL
          OR LOWER(A.DisplayName) LIKE '%' + LOWER(@DisplayName) + '%'
      )
      AND
      (
          @DriverLicense IS NULL
          OR LOWER(A.DriverLicense) LIKE '%' + LOWER(@DriverLicense) + '%'
      )
      AND
      (
          @LicenseType IS NULL
          OR A.LicenseType = @LicenseType
      )
      AND
      (
          ISNULL(@ListEmployeeId, '') = ''
          OR ',' + @ListEmployeeId + ',' LIKE '%,' + CAST(A.PK_EmployeeID AS NVARCHAR) + ',%'
      )
      AND
      (
          ISNULL(@ListStringLicenseTypesId, '') = ''
          OR ',' + @ListStringLicenseTypesId + ',' LIKE '%,' + CAST(A.LicenseType AS NVARCHAR) + ',%'
      )
ORDER BY A.DisplayName OFFSET @pageSize * (@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY;