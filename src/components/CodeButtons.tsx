import * as React from 'react';

import {
  Button,
  ButtonGroup,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import camelcase from 'camelcase';

import SqlCodeBlock from '@/components/SqlCodeBlock';
import { parseSql, SqlParseVariableOption } from '@/utlis/parse-sql';

interface CodeButtonsProps {
  createSql?: string;
  updateSql?: string;
  deleteSql?: string;
  disabled?: boolean;
  values: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  type: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  selected: Record<string, any> | null;
  onDeleteClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginTop: {
      marginTop: theme.spacing(1),
    },
  }),
);

const CodeButtons: React.FC<CodeButtonsProps> = ({
  disabled,
  values,
  selected,
  type,
  onDeleteClick,
  updateSql,
  deleteSql,
  createSql,
}) => {
  const [isFormCodeShown, setIsFormCodeShown] = React.useState(false);
  const [isDeleteCodeShown, setIsDeleteCodeShown] = React.useState(false);
  const classes = useStyles();

  const parseOptions = Object.entries(values)
    .reduce((aggregator, [key, value]) => {
      aggregator[camelcase(key)] = {
        value,
        int: typeof type[key] === 'number' || undefined,
      };

      return aggregator;
    }, {} as Record<string, SqlParseVariableOption>);

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
        <div className={classes.marginTop}>
          {selected
            ? updateSql && <SqlCodeBlock text={parseSql(updateSql, parseOptions)} />
            : createSql && <SqlCodeBlock text={parseSql(createSql, parseOptions)} />
          }
        </div>
      )}

      {onDeleteClick && (
        <>
          {selected && (
            <ButtonGroup className={classes.marginTop}>
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
            <div className={classes.marginTop}>
              <SqlCodeBlock text={parseSql(deleteSql, parseOptions)} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CodeButtons;
