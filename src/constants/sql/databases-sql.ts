export const createDatabaseSQL = `CREATE DATABASE TelephoneCompany;
`;
export const dropDatabaseSQL = `DROP DATABASE TelephoneCompany;
`;
export const getAllDatabasesSQL = `SELECT name
FROM sys.databases
WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb');
`;
