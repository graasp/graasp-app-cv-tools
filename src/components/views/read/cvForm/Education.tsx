import React, { FC } from 'react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Button } from '@mui/material';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
}
const Education: FC<Props> = ({ nextPage, prevPage, nextStep, prevStep }) => {
  const handleNext = (): void => {
    nextPage();
    nextStep();
  };
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  return (
    <div>
      <h2>Education</h2>
      <Button
        style={{ position: 'absolute', top: '605px', left: '628px' }}
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Back
      </Button>
      <Button
        style={{ position: 'absolute', top: '599px', left: '1070px' }}
        sx={{ width: 165 }}
        variant="contained"
        color="primary"
        startIcon={<NavigateNextIcon />}
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Education;
