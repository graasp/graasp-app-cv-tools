import React, { FC, ReactNode } from 'react';

import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
  activeStep: number;
  steps: string[];
  page: number;
}
const FormLayout: FC<Props> = ({
  children,
  activeStep,
  steps,
  page,
}: Props) => {
  const x = 5;
  return (
    <div>
      <Typography variant="h5">
        My Items/ CV App - Candidate Interface
      </Typography>
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
    </div>
  );
};

export default FormLayout;
