import * as React from 'react';

import {
  Button,
  ButtonGroup,
} from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';

import SqlCodeBlock from '@/components/SqlCodeBlock';
import { parseSql, SqlParseVariableOption } from '@/utlis/parse-sql';

interface CodeButtonsProps {
  parseOptions: Record<string, SqlParseVariableOption>;
  createSql?: string;
  updateSql?: string;
  deleteSql?: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  selected: object | null;
  onDeleteClick?: () => void;
}

const CodeButtons: React.FC<CodeButtonsProps> = ({
  disabled,
  parseOptions,
  selected,
  onDeleteClick,
  updateSql,
  deleteSql,
  createSql,
}) => {
  const [isFormCodeShown, setIsFormCodeShown] = React.useState(false);
  const [isDeleteCodeShown, setIsDeleteCodeShown] = React.useState(false);

  return (
    <>
      <ButtonGroup>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={disabled}
        >
          {isFormCodeShown
            ? 'Execute'
            : selected ? 'Edit' : 'Create'
          }
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsFormCodeShown(!isFormCodeShown)}
        >
          <CodeIcon />
        </Button>
      </ButtonGroup>

      {isFormCodeShown && (
        selected
          ? updateSql && <SqlCodeBlock text={parseSql(updateSql, parseOptions)} />
          : createSql && <SqlCodeBlock text={parseSql(createSql, parseOptions)} />
      )}

      {onDeleteClick && (
        <>
          {selected && (
            <ButtonGroup>
              <Button
                variant="contained"
                color="secondary"
                onClick={onDeleteClick}
              >
                {isDeleteCodeShown ? 'Execute' : 'Delete'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsDeleteCodeShown(!isDeleteCodeShown)}
              >
                <CodeIcon />
              </Button>
            </ButtonGroup>
          )}

          {isDeleteCodeShown && selected && deleteSql && (
            <SqlCodeBlock text={parseSql(deleteSql, parseOptions)} />
          )}
        </>
      )}
    </>
  );
};

export default CodeButtons;
