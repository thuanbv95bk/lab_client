SET NOCOUNT ON;

DECLARE @i INT = 1;

WHILE @i <= 70
BEGIN
    INSERT INTO dbo.[Admin.Users] (
        PK_UserID,
        FK_CompanyID,
        Username,
        UserNameLower,
        Password,
        Fullname,
        UserType,
        IsLock,
        IsDeleted,
        PhoneNumber,
        Email,
        IsActived
    )
    VALUES (
        NEWID(), -- PK_UserID
        15076,   -- FK_CompanyID
        CONCAT('User', @i), -- Username
        LOWER(CONCAT('user', @i)), -- UserNameLower
        'P@ssword123', -- Password (giá trị giả định)
        CONCAT('User Fullname ', @i), -- Fullname
        CAST(RAND() * 5 AS TINYINT), -- UserType (0–4 ngẫu nhiên)
        CAST(RAND() * 2 AS BIT),     -- IsLock
        CAST(RAND() * 2 AS BIT),     -- IsDeleted
        CONCAT('090', FORMAT(@i, '000000')), -- PhoneNumber
        CONCAT('user', @i, '@example.com'), -- Email
        1 -- IsActived
    );

    SET @i += 1;
END
