SELECT a.PK_UserID,
       a.Username,
       a.Fullname,
       a.IsDeleted,
       a.IsLock
FROM [Admin.Users] a
WHERE 1 = 1
      AND a.FK_CompanyID = 15076
      AND
      (
          a.IsLock IS NULL
          OR a.IsLock = 0
      )
      AND
      (
          a.IsDeleted IS NULL
          OR a.IsDeleted = 0
      )
      AND (a.IsActived = 1);
GO

SELECT *
FROM [Admin.UserVehicleGroup] A
WHERE (
          A.IsDeleted IS NULL
          OR A.IsDeleted = 0
      );
GO
--'C77386A5-30A2-4793-BEE4-50DFABDEBE91'

SELECT a.FK_CompanyID,
       a.PK_VehicleGroupID,
       a.ParentVehicleGroupID,
       a.IsDeleted
FROM dbo.[Vehicle.Groups] a
WHERE a.FK_CompanyID = 15076
      AND
      (
          a.IsDeleted IS NULL
          OR a.IsDeleted = 0
      );
--AND EXISTS (SELECT 1 FROM dbo.[Admin.Users] b WHERE b.PK_UserID ='C77386A5-30A2-4793-BEE4-50DFABDEBE91' AND b. )
GO

SELECT G.*
FROM dbo.[Vehicle.Groups] G
    JOIN dbo.[Admin.UserVehicleGroup] A
        ON A.FK_VehicleGroupID = G.PK_VehicleGroupID
WHERE A.FK_UserID = 'C77386A5-30A2-4793-BEE4-50DFABDEBE91'
      AND
      (
          G.IsDeleted IS NULL
          OR G.IsDeleted = 0
      )
      AND ISNULL(G.IsDeleted, 0) = 0
      AND ISNULL(A.IsDeleted, 0) = 0;

GO

SELECT a.*
FROM dbo.[Vehicle.Groups] a
WHERE ISNULL(a.IsDeleted, 0) = 0
      AND a.FK_CompanyID = 15076
      AND NOT EXISTS
(
    SELECT 1
    FROM dbo.[Admin.UserVehicleGroup] b
    WHERE b.FK_VehicleGroupID = a.PK_VehicleGroupID
          AND ISNULL(b.IsDeleted, 0) = 0
          AND b.FK_UserID = 'C77386A5-30A2-4793-BEE4-50DFABDEBE91'
);
GO


SELECT a.*
FROM dbo.[Vehicle.Groups] a
    LEFT JOIN dbo.[Admin.UserVehicleGroup] b
        ON b.FK_VehicleGroupID = a.PK_VehicleGroupID
           AND ISNULL(b.IsDeleted, 0) = 0
           AND b.FK_UserID = 'C77386A5-30A2-4793-BEE4-50DFABDEBE91'
WHERE ISNULL(a.IsDeleted, 0) = 0
      AND a.FK_CompanyID = 15076
      AND b.FK_VehicleGroupID IS NULL;

GO

SELECT *
FROM dbo.[Vehicle.VehicleGroups] A
    INNER JOIN dbo.[Admin.UserVehicleGroup] B
        ON B.FK_VehicleGroupID = A.FK_VehicleGroupID
WHERE B.FK_UserID = 'C77386A5-30A2-4793-BEE4-50DFABDEBE91'
      AND ISNULL(B.IsDeleted, 0) = 0
      AND ISNULL(A.IsDeleted, 0) = 0
      AND A.FK_CompanyID = 15076;


