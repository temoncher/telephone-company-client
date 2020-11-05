export interface SqlParseVariableOption {
  value?: string | number;
  int?: true;
}

export const parseSql = (script: string, options: Record<string, SqlParseVariableOption>) => {
  const newScript: string = Object.entries(options)
    .reduce((editedScript, [key, { int, value }]) => {
      if (value === undefined || value === '') return editedScript;

      const regExp = new RegExp(`@${key}`, 'g');

      editedScript = editedScript.replace(regExp, int ? String(value) : `'${value}'`);

      return editedScript;
    }, script);

  return newScript;
};
