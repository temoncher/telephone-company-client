export const pricesTableSql = `CREATE VIEW [V_prices_global]
AS
SELECT
  [price_id],
  [localities].[locality_id],
  [title],
  [localities].[name] AS [locality_name]
FROM [prices]
  JOIN [localities]
  ON [prices].[locality_id] = [localities].[locality_id]
`;
export const daytimePricesTableSql = `CREATE VIEW [V_daytime_prices_global]
AS
SELECT
  [daytime_prices].[price_id],
  [prices].[title] AS [price_title],
  [daytime_prices].[daytime_id],
  [daytimes].[title] AS [daytime_title],
  [daytime_prices].[price_per_minute]
FROM [daytime_prices]
  JOIN [prices]
  ON [daytime_prices].[price_id] = [prices].[price_id]
  JOIN [daytimes]
  ON [daytimes].[daytime_id] = [daytimes].[daytime_id]
`;
