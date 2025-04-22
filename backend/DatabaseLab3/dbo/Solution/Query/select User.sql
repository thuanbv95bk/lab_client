SELECT *
FROM [Vehicle.Groups] vg
WHERE vg.PK_VehicleGroupID NOT IN
      (
          SELECT uvg.FK_VehicleGroupID
          FROM [Admin.UserVehicleGroup] uvg
          WHERE uvg.FK_UserID = 'E0419835-9DBF-404C-AD3F-01BAD28098B2'
      );

SELECT vg.*
FROM [Vehicle.Groups] vg
    LEFT JOIN [Admin.UserVehicleGroup] uvg
        ON vg.PK_VehicleGroupID = uvg.FK_VehicleGroupID
           AND uvg.FK_UserID = 'E0419835-9DBF-404C-AD3F-01BAD28098B2'
WHERE uvg.FK_VehicleGroupID IS NULL;


SELECT vg.*
FROM [Vehicle.Groups] vg
    LEFT JOIN [Admin.UserVehicleGroup] uvg
        ON vg.PK_VehicleGroupID = uvg.FK_VehicleGroupID
           AND uvg.FK_UserID = 'E0419835-9DBF-404C-AD3F-01BAD28098B2'
WHERE uvg.FK_VehicleGroupID IS NULL;
;

SELECT vg.*
FROM [Vehicle.Groups] vg
WHERE NOT EXISTS
(
    SELECT 1
    FROM [Admin.UserVehicleGroup] uvg
    WHERE uvg.FK_VehicleGroupID = vg.PK_VehicleGroupID
          AND uvg.FK_UserID = 'E0419835-9DBF-404C-AD3F-01BAD28098B2'
);