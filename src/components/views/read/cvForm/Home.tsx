import { ChangeEvent, FC, RefObject, useRef } from 'react';

import { AppData } from '@graasp/apps-query-client/dist/types';

import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Stack, Typography } from '@mui/material';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { showErrorToast } from '../../../../utils/toast';
import { useAppDataContext } from '../../../context/AppDataContext';
import { CVInfoObj, PersonalInfoObj } from './types';

interface Props {
  nextPage: () => void;
  nextStep: () => void;
  reviewStep: () => void;
}
const Home: FC<Props> = ({ nextPage, nextStep, reviewStep }) => {
  const { postAppData, appDataArray } = useAppDataContext();

  const handleCvPost = (newdata: CVInfoObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.CV_VALUES });
  };
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { files } = e.target;
    const file = files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;

        const parsedData = JSON.parse(fileContent) as CVInfoObj;
        if (
          Object.keys(parsedData).every((key) =>
            [
              'personalInfo',
              'educationInfo',
              'workInfo',
              'skillsInfo',
              'portfolioInfo',
              'motivationInfo',
              'referencesInfo',
              'cvStateInfo',
            ].includes(key),
          )
        ) {
          handleCvPost(parsedData);
          reviewStep();
        } else {
          console.log('Error parsing');
          showErrorToast(
            'Invalid file content. Please upload a valid CV data file.',
          );
        }
      };
      reader.readAsText(file);
    }
  };
  const handleClick = (): void => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  const handlePersonalPost = (newdata: PersonalInfoObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.PERSONALINFO });
  };
  const handleNext = (): void => {
    const personalData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.PERSONALINFO,
    );
    if (personalData.size === 0) {
      handlePersonalPost({
        firstName: '',
        lastName: '',
        birthDate: undefined,
        gender: '',
        emailAddress: '',
        phoneNum: '',
        address: '',
        profileLinks: '',
        personalLink: '',
        personalPic: '',
      });
    }
    nextPage();
    nextStep(); // Update the activeStep state
  };
  return (
    <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
      <Stack spacing={2}>
        <Typography>Get Started</Typography>
        <Typography>
          Upload your CV/Resume if you have one, or you can create a new one and
          upload it directly!
        </Typography>
        <Stack direction="row" justifyContent="space-evenly">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleNext}
          >
            Create
          </Button>
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            ref={inputRef}
            onChange={onChange}
          />
          <Button
            startIcon={<UploadFileIcon />}
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            Upload Data
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
