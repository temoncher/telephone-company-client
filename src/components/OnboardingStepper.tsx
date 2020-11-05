import * as React from 'react';

import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { OnboardingStepAlias } from '@/enums/onboarding-step-alias';
import { IOnboardingStep } from '@/interfaces/onboarding-step.interface';
import { Box } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
    },
  }),
);

interface OnboardingStepperProps {
  steps: IOnboardingStep[];
  activeStep: OnboardingStepAlias;
}

const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ steps, activeStep }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
      >
        {steps.map(({ label, Component }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Component />
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OnboardingStepper;
