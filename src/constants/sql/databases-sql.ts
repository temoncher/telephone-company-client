export const createDatabaseSQL = `-- Exit [telephone_company] db before drop
USE [master];

-- Drop database if it is already present
IF EXISTS(
  SELECT *
  FROM [sys].[databases]
  WHERE [name] = 'telephone_company'
) BEGIN
  DROP DATABASE [telephone_company]
END

-- Create new database
CREATE DATABASE [telephone_company];

USE [telephone_company];

-- Create Organisations table
CREATE TABLE [organisations]
(
  [organisation_id] INT IDENTITY(1, 1) PRIMARY KEY,
  [name] NVARCHAR(50) NOT NULL,
);

-- Create Subscribers table
CREATE TABLE [subscribers]
(
  [subscriber_id] INT IDENTITY(1, 1) PRIMARY KEY,
  [organisation_id] INT NOT NULL,
  [inn] INT NOT NULL,
  [first_name] NVARCHAR(30) NOT NULL,
  [last_name] NVARCHAR(30) NOT NULL,
  [patronymic] NVARCHAR(30),
  [adress] NVARCHAR(50),
  FOREIGN KEY(organisation_id) REFERENCES [organisations](organisation_id) ON DELETE CASCADE
);


-- Create Accounts table
CREATE TABLE [accounts]
(
  [account_id] INT IDENTITY(1, 1) PRIMARY KEY,
  [subscriber_id] INT NOT NULL,
  [balance] MONEY DEFAULT 0,
  FOREIGN KEY(subscriber_id) REFERENCES [subscribers](subscriber_id) ON DELETE CASCADE
);


-- Create TransactionTypes table
CREATE TABLE [transaction_types]
(
  [transaction_type_id] INT IDENTITY(1, 1) PRIMARY KEY,
  [title] NVARCHAR(50) NOT NULL,
);


-- Create Transactions table
CREATE TABLE [transactions]
(
  [transaction_id] INT IDENTITY(1, 1) PRIMARY KEY,
  [transaction_type_id] INT NOT NULL,
  [account_id] INT NOT NULL,
  [amount] SMALLMONEY NOT NULL,
  [timestamp] DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(transaction_type_id) REFERENCES [transaction_types](transaction_type_id) ON DELETE CASCADE,
  FOREIGN KEY(account_id) REFERENCES [accounts](account_id) ON DELETE CASCADE
);


-- Create Daytimes table
CREATE TABLE [daytimes]
(
  [daytime_id] INT IDENTITY(1, 1) PRIMARY KEY,
  [title] NVARCHAR(20) NOT NULL,
);


-- Create Localities table
CREATE TABLE [localities]
(
  [locality_id] INT IDENTITY(1, 1) PRIMARY KEY,
  [name] NVARCHAR(50) NOT NULL,
);


-- Create Prices table
CREATE TABLE [prices]
(
  [price_id] INT IDENTITY(1, 1) PRIMARY KEY,
  [locality_id] INT NOT NULL,
  [title] NVARCHAR(50) NOT NULL,
  FOREIGN KEY(locality_id) REFERENCES [localities](locality_id) ON DELETE CASCADE
);


-- Create DaytimePrices table
CREATE TABLE [daytime_prices]
(
  [price_id] INT NOT NULL,
  [daytime_id] INT NOT NULL,
  [price_per_minute] SMALLMONEY NOT NULL,
  PRIMARY KEY(price_id, daytime_id),
  FOREIGN KEY(price_id) REFERENCES [prices](price_id) ON DELETE CASCADE,
  FOREIGN KEY(daytime_id) REFERENCES [daytimes](daytime_id) ON DELETE CASCADE
);


-- Create Calls table
CREATE TABLE [calls]
(
  [call_id] INT IDENTITY(1,1) PRIMARY KEY,
  [subscriber_id] INT,
  [daytime_id] INT,
  [locality_id] INT,
  [duration] INT NOT NULL,
  [timestamp] DATETIME DEFAULT CURRENT_TIMESTAMP,
  [deleted_at] DATETIME DEFAULT NULL,
  FOREIGN KEY(subscriber_id) REFERENCES [subscribers](subscriber_id) ON DELETE SET NULL,
  FOREIGN KEY(daytime_id) REFERENCES [daytimes](daytime_id) ON DELETE SET NULL,
  FOREIGN KEY(locality_id) REFERENCES [localities](locality_id) ON DELETE SET NULL,
);
`;
export const createRolesSQL = `USE [telephone_company];

CREATE ROLE [dbAdminRole];

GRANT SELECT, UPDATE, INSERT, DELETE, EXECUTE TO [dbAdminRole];
GRANT VIEW DEFINITION TO [dbAdminRole];

CREATE USER [User_baranov4] FROM LOGIN [User_baranov4];

ALTER ROLE [dbAdminRole] ADD MEMBER [User_baranov4];

CREATE ROLE [dbManagerRole];

GRANT SELECT, UPDATE, INSERT, DELETE ON [daytimes] TO [dbManagerRole];
GRANT SELECT, UPDATE, INSERT, DELETE ON [prices] TO [dbManagerRole];
GRANT SELECT, UPDATE, INSERT, DELETE ON [localities] TO [dbManagerRole];
GRANT SELECT, UPDATE, INSERT, DELETE ON [daytime_prices] TO [dbManagerRole];

CREATE USER [User1_baranov4] FROM LOGIN [User1_baranov4];

ALTER ROLE [dbManagerRole] ADD MEMBER [User1_baranov4];
`;
export const createAccountTriggerSQL = `-- Add account for each new subscriber
CREATE TRIGGER [TR_subscribers_AfterInsert] ON [subscribers]
AFTER
INSERT
  AS BEGIN
  SET NOCOUNT ON

  INSERT INTO
  [accounts]
    ([subscriber_id])
  SELECT
    [subscriber_id]
  FROM
    [INSERTED]
END;
`;
export const updateBalanceTriggerSQL = `-- Update account valance after each transaction
CREATE TRIGGER [TR_transactions_AfterInsert] ON [transactions]
AFTER
INSERT
  AS BEGIN
  SET NOCOUNT ON

  DECLARE @newInserted TABLE(
    account_id INT NOT NULL,
    income INT NOT NULL,
    loss INT NOT NULL
  )

  INSERT INTO @newInserted
  SELECT
    [INSERTED].[account_id],
    SUM(CASE WHEN [transaction_types].[title] = 'INCOME' THEN [INSERTED].[amount] ELSE 0 END) [income],
    SUM(CASE WHEN [transaction_types].[title] = 'LOSS' THEN [INSERTED].[amount] ELSE 0 END) [loss]
  FROM
    [INSERTED]
    JOIN [transaction_types]
    ON [INSERTED].[transaction_type_id] = [transaction_types].[transaction_type_id]
  GROUP BY [INSERTED].[account_id]

  UPDATE
    [accounts]
  SET
    [balance] = [accounts].[balance] + (
      SELECT [@newInserted].[income] - [@newInserted].[loss]
  FROM @newInserted
  WHERE [accounts].[account_id] = [@newInserted].[account_id]
    )
  WHERE [accounts].[account_id] IN (
    SELECT DISTINCT [@newInserted].[account_id]
  FROM @newInserted
  )
END;
`;
export const softDeleteCallTriggerSQL = `-- Soft delete call
CREATE TRIGGER [TR_calls_InsteadOfDelete] ON [calls]
INSTEAD OF DELETE
AS BEGIN
SET NOCOUNT ON;

UPDATE [calls]
  SET [deleted_at] = CURRENT_TIMESTAMP
  WHERE [call_id] IN (SELECT [call_id] FROM [DELETED]);
END
`;
export const createTransactionAfterCallTriggerSQL = `-- Add transaction for inserted call
CREATE TRIGGER [TR_calls_AfterInsert] ON [calls]
AFTER
INSERT
  AS BEGIN
  SET NOCOUNT ON

  DECLARE @insertedWithAccountId TABLE(
    [locality_id] INT NOT NULL,
    [daytime_id] INT NOT NULL,
    [duration] INT NOT NULL,
    [account_id] INT NOT NULL
  );

  DECLARE @insertedWithTransactionTypeId TABLE(
    [locality_id] INT NOT NULL,
    [daytime_id] INT NOT NULL,
    [duration] INT NOT NULL,
    [account_id] INT NOT NULL,
    [transaction_type_id] INT NOT NULL
  );

  DECLARE @insertedWithPriceId TABLE(
    [daytime_id] INT NOT NULL,
    [duration] INT NOT NULL,
    [account_id] INT NOT NULL,
    [transaction_type_id] INT NOT NULL,
    [price_id] INT NOT NULL
  );

  DECLARE @insertedWithAmount TABLE(
    [account_id] INT NOT NULL,
    [transaction_type_id] INT NOT NULL,
    [amount] SMALLMONEY NOT NULL
  );

  INSERT INTO @insertedWithAccountId
  SELECT [locality_id], [daytime_id], [duration], [account_id]
  FROM [INSERTED]
    JOIN [accounts]
    ON [INSERTED].[subscriber_id] = [accounts].[subscriber_id]

  INSERT INTO @insertedWithTransactionTypeId
  SELECT [locality_id], [daytime_id], [duration], [account_id], [transaction_type_id]
  FROM @insertedWithAccountId
    JOIN [transaction_types]
    ON [transaction_types].[title] = 'LOSS'

  INSERT INTO @insertedWithPriceId
  SELECT [daytime_id], [duration], [account_id], [transaction_type_id], [price_id]
  FROM @insertedWithTransactionTypeId
    JOIN [prices]
    ON [prices].[locality_id] = [@insertedWithTransactionTypeId].[locality_id]

  INSERT INTO @insertedWithAmount
  SELECT [account_id], [transaction_type_id], [amount] = CAST([duration] AS REAL) / 60 * [price_per_minute]
  FROM @insertedWithPriceId
    JOIN [daytime_prices]
    ON [daytime_prices].[price_id] = [@insertedWithPriceId].[price_id]
      AND [daytime_prices].[daytime_id] = [@insertedWithPriceId].[daytime_id]

  INSERT INTO [transactions]
    ([account_id], [transaction_type_id], [amount])
  SELECT [account_id], [transaction_type_id], [amount]
  FROM @insertedWithAmount
END;
`;
export const seedDatabaseSQL = `USE [telephone_company]

-- Seed Organisations table
INSERT INTO
  [organisations]
  ([name])
VALUES
  (N'ЯрГУ им. П.Г. Демидова'),
  (N'Тензор'),
  (N'McDonalds'),
  (N'KFC'),
  (N'Аквелон');


-- Seed Subscribers table
INSERT INTO
  [subscribers]
  (
  [organisation_id],
  [inn],
  [first_name],
  [last_name],
  [patronymic],
  [adress]
  )
VALUES
  (3, 111, 'John', 'Doe', NULL, 'Brooklyn'),
  (
    1,
    112,
    N'Артем',
    N'Баранов',
    N'Сергеевич',
    N'Ярославль'
  ),
  (3, 113, N'Мини', N'Маус', NULL, 'Disney Land'),
  (3, 114, N'Стивен', N'Джобс', NULL, NULL),
  (4, 115, 'Bill', 'Gates', NULL, NULL),
  (
    3,
    116,
    N'Микки',
    N'Маус',
    NULL,
    'Disney Land'
  );


-- No need to seed Accounts because they will be generated on trigger
-- Seed TransactionTypes table
INSERT INTO
  [transaction_types]
  ([title])
VALUES
  ('INCOME'),
  ('LOSS');


-- Seed Transactions table
INSERT INTO
  [transactions]
  (
    [transaction_type_id],
    [account_id],
    [amount],
    [timestamp]
  )
VALUES
  (1, 1, 100, '2020-04-20 13:10:02.047'),
  (1, 1, 100, '2020-05-22 12:11:02.047'),
  (1, 1, 200, '2020-04-23 23:00:02.047'),
  (1, 1, 100, '2020-05-23 23:40:02.047'),
  (1, 3, 100, '2020-05-13 23:40:02.047'),
  (1, 3, 400, '2020-05-13 23:43:02.047'),
  (1, 4, 1500, '2019-11-25 15:10:02.047'),
  (1, 2, 10, '2019-08-21 02:11:02.047'),
  (1, 2, 300, '2019-06-25 20:00:02.047'),
  (1, 2, 500, '2019-05-21 23:10:02.047'),
  (1, 2, 815, '2018-04-23 23:10:02.047');


-- Seed Daytimes table
INSERT INTO
  [daytimes]
  ([title])
VALUES
  (N'Утро'),
  (N'День'),
  (N'Вечер'),
  (N'Ночь');


-- Seed Localities table
INSERT INTO
  [localities]
  ([name])
VALUES
  (N'Ярославль'),
  (N'Москва'),
  ('Brooklyn'),
  ('Disney Land');


-- Seed Prices table
INSERT INTO
  [prices]
  ([locality_id], [title])
VALUES
  (1, 'Best price'),
  (1, N'Прайс Надежный'),
  (2, N'Москва не ждет'),
  (3, 'Brooklyn Night'),
  (4, 'Disney Land');


-- Seed DaytimePrices table
INSERT INTO
  [daytime_prices]
  ([price_id], [daytime_id], [price_per_minute])
VALUES
  (1, 1, 60),
  (1, 2, 30),
  (1, 3, 30),
  (1, 4, 10),
  (2, 1, 100),
  (2, 2, 80),
  (2, 3, 40),
  (2, 4, 30),
  (3, 1, 10),
  (3, 2, 20),
  (3, 3, 30),
  (3, 4, 40),
  (4, 1, 20),
  (4, 2, 20),
  (4, 3, 20),
  (4, 4, 20);


-- Seed Calls table
INSERT INTO
  [calls]
  (
    [subscriber_id],
    [locality_id],
    [duration],
    [daytime_id],
    [timestamp]
  )
VALUES
  (1, 1, 60, 1, '2020-04-30 13:10:02.047'),
  (1, 1, 33, 2, '2020-04-30 12:11:02.047'),
  (1, 1, 245, 1, '2020-04-23 23:00:02.047'),
  (1, 2, 123, 3, '2020-05-23 23:40:02.047'),
  (1, 1, 22, 4, '2020-05-13 23:40:02.047'),
  (1, 1, 12, 1, '2020-05-13 23:43:02.047'),
  (2, 2, 11, 1, '2019-11-30 15:10:02.047'),
  (2, 2, 123, 2, '2019-08-30 02:11:02.047'),
  (2, 2, 54, 3, '2019-06-23 20:00:02.047'),
  (2, 2, 64, 4, '2019-06-23 23:10:02.047'),
  (2, 2, 23, 1, '2019-06-13 23:30:02.047'),
  (2, 2, 12, 2, '2019-06-13 22:43:02.047'),
  (3, 2, 11, 4, '2018-12-30 14:15:02.047'),
  (3, 2, 123, 4, '2018-11-30 01:31:02.047'),
  (3, 2, 54, 2, '2018-11-23 21:21:02.047'),
  (3, 2, 64, 3, '2018-11-23 23:10:02.047');
`;
export const getAllDatabasesSQL = `SELECT name
FROM sys.databases
WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb');
`;
