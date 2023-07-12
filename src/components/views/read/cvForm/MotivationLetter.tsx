import { FC, useEffect, useState } from 'react';

import { AppData } from '@graasp/apps-query-client';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Stack, TextField } from '@mui/material';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { showErrorToast } from '../../../../utils/toast';
import { useAppDataContext } from '../../../context/AppDataContext';
import Description from './Description';
import { MotivationObj } from './types';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}
const MotivationLetter: FC<Props> = ({ nextStep, prevStep }) => {
  const { patchAppData, appDataArray } = useAppDataContext();
  const motivationObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.MOTIVATION_INFO,
  );
  const handlePatch = (dataObj: AppData, newData: MotivationObj): void => {
    patchAppData({ id: dataObj.id, data: newData });
  };

  const [motivationInfoState, setMotivationInfoState] = useState<
    AppData & { data: MotivationObj }
  >();

  useEffect(() => {
    const motivationData = appDataArray.find(
      (obj: AppData) => obj.type === APP_DATA_TYPES.MOTIVATION_INFO,
    ) as AppData & { data: MotivationObj };
    setMotivationInfoState(motivationData);
  }, [appDataArray]);

  const [saved, setSaved] = useState(false);

  const handleSave = (): void => {
    // search in appdata so if we find the object of the same type 'motivationInfo' patch its data by its id
    if (motivationObject && motivationInfoState) {
      setSaved(true);
      handlePatch(motivationObject, motivationInfoState.data);
    }
  };
  const hasChanges =
    motivationInfoState &&
    Object.keys(motivationInfoState.data).some(
      (key) => motivationInfoState.data[key] !== motivationObject?.data[key],
    );
  const handlePrev = (): void => {
    prevStep();
  };
  const handleNext = (): void => {
    if (saved) {
      nextStep();
    } else {
      showErrorToast('Please save your progress by clicking on Save button');
    }
  };
  const mapping = [{ key: 'motivationLetter', label: 'Motivation Letter' }];
  const title = 'Self Motivation';
  const description =
    'For this part you can add a personal motivation, what are your goals wishing to achieve in your career, etc.';
  return (
    <Box>
      <Box>
        <Description title={title} description={description} />
        {mapping.map((m) => (
          <Box key={m.key}>
            {m.key === 'motivationLetter' && (
              <TextField
                label={m.label}
                id={m.key}
                value={motivationInfoState?.data.motivationLetter || ''}
                onChange={(e) =>
                  setMotivationInfoState((prev) => {
                    if (!prev) {
                      return prev;
                    }
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        motivationLetter: e.target.value,
                      },
                    };
                  })
                }
                multiline
                minRows={10}
                fullWidth
                margin="normal"
              />
            )}
          </Box>
        ))}
      </Box>
      <Stack justifyContent="space-between" marginBottom="16px" direction="row">
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
          startIcon={<SaveIcon />}
          onClick={handleSave}
          style={{ alignSelf: 'center' }}
          disabled={!hasChanges}
        >
          Save
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
      </Stack>
    </Box>
  );
};

export default MotivationLetter;
