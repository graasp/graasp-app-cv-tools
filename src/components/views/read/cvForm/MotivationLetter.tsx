import { FC, useEffect, useState } from 'react';

import { AppData } from '@graasp/apps-query-client/dist/types';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Button, ButtonGroup, TextField, Typography } from '@mui/material';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { useAppDataContext } from '../../../context/AppDataContext';
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
  const { postAppData, patchAppData, appDataArray } = useAppDataContext();
  const motivationObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.MOTIVATION,
  );
  const handlePost = (newdata: MotivationObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.MOTIVATION });
  };
  const handlePatch = (dataObj: AppData, newData: MotivationObj): void => {
    patchAppData({ id: dataObj.id, data: newData });
  };
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
    // search in appdata so if we find the object of the same type 'personalInfo' patch its data by its id, otherwise just post the object
    if (motivationObject) {
      handlePatch(motivationObject, motivationInfoState);
    } else {
      handlePost(motivationInfoState);
    }
    onCvValuesChange(motivationInfoState);
    nextPage();
    nextStep();
  };
  const mapping = [{ key: 'motivationLetter', label: 'Motivation Letter' }];
  return (
    <Box>
      <Box>
        <Typography sx={{ m: '0.5rem' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
        {mapping.map((m) => (
          <Box key={m.key}>
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
                fullWidth
                margin="normal"
              />
            )}
          </Box>
        ))}
      </Box>
      <ButtonGroup
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<NavigateBeforeIcon />}
          onClick={handlePrev}
          style={{ alignSelf: 'flex-start' }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<NavigateNextIcon />}
          onClick={handleNext}
          style={{ alignSelf: 'flex-end' }}
        >
          Next
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default MotivationLetter;
