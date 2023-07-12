import { ChangeEvent, FC, RefObject, useRef } from 'react';

import { AppData } from '@graasp/apps-query-client';

import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Stack } from '@mui/material';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { showErrorToast } from '../../../../utils/toast';
import { useAppDataContext } from '../../../context/AppDataContext';
import Description from './Description';
import { CVInfoObj, PersonalInfoObj } from './types';

interface Props {
  nextStep: () => void;
  reviewStep: () => void;
}

const Home: FC<Props> = ({ nextStep, reviewStep }) => {
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
        const { Validator } = require('jsonschema');
        const schema = {
          type: 'object',
          properties: {
            personalInfo: { type: 'object' },
            educationInfo: { type: 'array', items: { type: 'object' } },
            workInfo: { type: 'array', items: { type: 'object' } },
            skillsInfo: { type: 'array', items: { type: 'object' } },
            portfolioInfo: { type: 'array', items: { type: 'object' } },
            motivationInfo: { type: 'object' },
            referencesInfo: { type: 'array', items: { type: 'object' } },
            cvStateInfo: { type: 'object' },
          },
          required: [
            'personalInfo',
            'educationInfo',
            'workInfo',
            'skillsInfo',
            'portfolioInfo',
            'motivationInfo',
            'referencesInfo',
            'cvStateInfo',
          ],
        };
        const validator = new Validator();
        try {
          const parsedData = JSON.parse(fileContent) as CVInfoObj;
          const validationResult = validator.validate(parsedData, schema);

          if (validationResult.valid) {
            handleCvPost(parsedData);
            reviewStep();
          } else {
            showErrorToast(
              'Could not parse the data within the file. Please upload a valid CV data file.',
            );
          }
        } catch (err) {
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
    postAppData({ data: newdata, type: APP_DATA_TYPES.PERSONAL_INFO });
  };
  const handleNext = (): void => {
    const personalData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.PERSONAL_INFO,
    );
    if (personalData.size === 0) {
      handlePersonalPost({
        firstName: '',
        lastName: '',
        birthDate: null,
        gender: '',
        emailAddress: '',
        phoneNum: '',
        address: '',
        profileLinks: '',
        personalLink: '',
        personalPic: '',
        saved: false,
      });
    }
    nextStep(); // Update the activeStep state
  };
  const title = 'Get Started';
  const description =
    'You can start creating your own CV by clicking on Create and do whatever you are asked to fill and provide, and you can upload a file of your data which match the structure of the valid file you can upload';
  return (
    <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
      <Stack spacing={2}>
        <Description title={title} description={description} />
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
