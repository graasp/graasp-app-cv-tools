import { FC, useEffect, useState } from 'react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Button, TextField, Typography } from '@mui/material';

import { MotivationObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  motivationInfo: MotivationObj;
  onCvValuesChange: (data: MotivationObj) => void;
}
const MotivationLetter: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  motivationInfo,
  onCvValuesChange,
}) => {
  const [motivationInfoState, setMotivationInfoState] =
    useState(motivationInfo);

  useEffect(() => {
    setMotivationInfoState(motivationInfo);
  }, [motivationInfo]);

  const handlePrev = (): void => {
    onCvValuesChange(motivationInfoState);
    prevPage();
    prevStep();
  };
  const handleNext = (): void => {
    onCvValuesChange(motivationInfoState);
    nextPage();
    nextStep();
  };
  const mapping = [{ key: 'motivationLetter', label: 'Motivation Letter' }];
  return (
    <Box>
      <Box>
        {mapping.map((m) => (
          <Box key={m.key}>
            <Typography>{m.label}</Typography>
            {m.key === 'motivationLetter' && (
              <TextField
                label={m.label}
                id={m.key}
                value={motivationInfoState.motivationLetter || ''}
                onChange={(e) =>
                  setMotivationInfoState((prev) => ({
                    ...prev,
                    motivationLetter: e.target.value,
                  }))
                }
                multiline
                required
              />
            )}
          </Box>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<NavigateNextIcon />}
        onClick={handleNext}
      >
        Next
      </Button>
    </Box>
  );
};

export default MotivationLetter;
