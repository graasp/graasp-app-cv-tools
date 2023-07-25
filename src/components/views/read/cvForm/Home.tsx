import { ChangeEvent, FC, RefObject, useRef } from 'react';

import { AppData } from '@graasp/apps-query-client';

import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Stack } from '@mui/material';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { showErrorToast } from '../../../../utils/toast';
import { useAppDataContext } from '../../../context/AppDataContext';
import Description from './Description';
import Validation from './Validation';
import {
  CVInfoObj,
  CvStatusObj,
  EducationInfoObj,
  MotivationObj,
  PersonalInfoObj,
  PortfolioObj,
  ReferencesObj,
  SkillsObj,
  WorkExperienceObj,
} from './types';

interface Props {
  nextStep: () => void;
  reviewStep: () => void;
}

const Home: FC<Props> = ({ nextStep, reviewStep }) => {
  const { postAppData, appDataArray } = useAppDataContext();

  const handlePersonalPost = (newdata: PersonalInfoObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.PERSONAL_INFO });
  };
  const handleEducationPost = (newdata: EducationInfoObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.EDUCATION_INFO });
  };
  const handleWorkPost = (newdata: WorkExperienceObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.WORK_EXPERIENCE_INFO });
  };
  const handleSkillsPost = (newdata: SkillsObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.SKILLS_INFO });
  };
  const handleProjectsPost = (newdata: PortfolioObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.PROJECTS_INFO });
  };
  const handleMotivationPost = (newdata: MotivationObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.MOTIVATION_INFO });
  };
  const handleReferencesPost = (newdata: ReferencesObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.REFERENCES_INFO });
  };
  const hanldeCvStatusPost = (newdata: CvStatusObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.CV_STATUS_INFO });
  };
  const inputRef: RefObject<HTMLInputElement> = useRef(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { files } = e.target;
    const file = files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        try {
          const parsedData = JSON.parse(fileContent) as CVInfoObj;
          const validationResult = Validation({
            type: 'uploadData',
            data: parsedData,
          });

          if (validationResult?.isValid()) {
            handlePersonalPost(parsedData.personalInfo);
            parsedData.educationInfo.forEach((educationItem) => {
              handleEducationPost(educationItem);
            });
            parsedData.workInfo.forEach((workItem) => {
              handleWorkPost(workItem);
            });
            parsedData.skillsInfo.forEach((skillItem) => {
              handleSkillsPost(skillItem);
            });
            parsedData.projectsInfo.forEach((projectItem) => {
              handleProjectsPost(projectItem);
            });
            parsedData.referencesInfo.forEach((referenceItem) => {
              handleReferencesPost(referenceItem);
            });
            handleMotivationPost(parsedData.motivationInfo);
            hanldeCvStatusPost(parsedData.cvStatusInfo);
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
