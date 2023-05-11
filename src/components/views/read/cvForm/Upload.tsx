import React, { FC } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Button } from '@mui/material';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  homeStep: () => void;
  prevStep: () => void;
}
const Upload: FC<Props> = ({ nextPage, prevPage, homeStep, prevStep }) => {
  const handleNext = (): void => {
    nextPage();
    homeStep();
  };
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  return (
    <div>
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
        startIcon={<CheckCircleIcon />}
        onClick={handleNext}
      >
        Submit
      </Button>
    </div>
  );
};

export default Upload;
