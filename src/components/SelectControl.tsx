import * as React from 'react';

import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';

interface SelectControlProps {
  label: string;
  control: any;
  error: boolean;
  helperText: string;
  name: string;
}

const SelectControl: React.FC<SelectControlProps> = ({
  label,
  error,
  control,
  helperText,
  name,
  children,
}) => (
  <FormControl
    variant="outlined"
    size="small"
  >
    <InputLabel id={`${name}-label`}>
      {label}
    </InputLabel>
    <Controller
      rules={{ required: true }}
      as={(
        <Select
          labelId={`${name}-label`}
          inputProps={{ name }}
          error={error}
        >
          <MenuItem value="">
            None
          </MenuItem>
          {children}
        </Select>
      )}
      name={name}
      control={control}
      defaultValue=""
    />
    <FormHelperText error={error}>{helperText}</FormHelperText>
  </FormControl>
);

export default SelectControl;
