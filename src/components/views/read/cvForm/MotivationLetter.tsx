import { FC } from 'react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Button, TextField } from '@mui/material';

import { CVInfoObj, MotivationObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  cvValues: CVInfoObj;
  onCvValuesChange: (newCvValues: CVInfoObj) => void;
}
const MotivationLetter: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  cvValues,
  onCvValuesChange,
}) => {
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const { motivationInfo } = cvValues;
  const handleChange = (field: keyof MotivationObj, value: string): void => {
    const newMotivationInfo: MotivationObj = {
      ...motivationInfo,
      [field]: value,
    };

    const newCvValues: CVInfoObj = {
      ...cvValues,
      motivationInfo: newMotivationInfo,
    };

    onCvValuesChange(newCvValues);
  };

  const handleNext = (): void => {
    nextPage();
    nextStep();
  };
  const mapping = [{ key: 'motivationLetter', label: 'Motivation Letter' }];
  return (
    <div>
      <h2>Motivation</h2>
      <div>
        {mapping.map((m) => (
          <>
            <p>{m.label}</p>
            {m.key === 'motivationLetter' && (
              <TextField
                label={m.label}
                id={m.key}
                value={motivationInfo.motivationLetter || ''}
                onChange={(e) =>
                  handleChange('motivationLetter', e.target.value)
                }
                multiline
                required
              />
            )}
          </>
        ))}
      </div>
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
    </div>
  );
};

export default MotivationLetter;
