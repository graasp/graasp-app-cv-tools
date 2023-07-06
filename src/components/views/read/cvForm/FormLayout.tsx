import { FC, ReactNode } from 'react';

import { Box, Step, StepLabel, Stepper } from '@mui/material';

interface Props {
  children: ReactNode;
  activeStep: number;
  steps: string[];
  modifyActiveStep: (index: number) => void;
}
const FormLayout: FC<Props> = ({
  children,
  activeStep,
  steps,
  modifyActiveStep,
}: Props) => {
  const handleStepClick = (stepIndex: number): void => {
    if (stepIndex !== steps.length - 1 && stepIndex !== steps.length - 2) {
      modifyActiveStep(stepIndex);
    }
  };
  return (
    <Box>
      <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
        <Box>
          <Stepper nonLinear activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step
                key={index}
                onClick={() => handleStepClick(index)}
                style={{ cursor: 'pointer' }}
                // completed={}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
      <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
        {children}
      </Box>
    </Box>
  );
};

export default FormLayout;
