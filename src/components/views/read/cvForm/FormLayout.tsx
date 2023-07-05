import { FC, ReactNode } from 'react';

import { Box, Step, StepLabel, Stepper } from '@mui/material';

interface Props {
  children: ReactNode;
  activeStep: number;
  steps: string[];
}
const FormLayout: FC<Props> = ({ children, activeStep, steps }: Props) => (
  <Box>
    <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
      <Box>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
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

export default FormLayout;
