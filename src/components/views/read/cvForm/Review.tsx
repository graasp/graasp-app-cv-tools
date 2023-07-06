import { saveAs } from 'file-saver';

import { FC } from 'react';

import { AppData, Data } from '@graasp/apps-query-client/dist/types';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

import { PDFViewer, pdf } from '@react-pdf/renderer';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { useAppDataContext } from '../../../context/AppDataContext';
import { TEMPLATES } from './constants';
import FirstTemplate from './templates/FirstTemplate';
import {
  CVInfoObj,
  CvStatusObj,
  EducationInfoObj,
  MotivationObj,
  PersonalInfoObj,
  PortfolioObj,
  ReferencesObj,
  SkillsObj,
  SubmissionStatus,
  WorkExperienceObj,
} from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  homeStep: () => void;
  prevStep: () => void;
}
const Review: FC<Props> = ({ nextPage, prevPage, homeStep, prevStep }) => {
  const { postAppData, appDataArray } = useAppDataContext();
  const personalInfoObject = appDataArray.find(
    (obj: AppData) => obj.type === APP_DATA_TYPES.PERSONALINFO,
  )?.data as PersonalInfoObj;
  const educationInfoObject = appDataArray.filter(
    (obj) => obj.type === APP_DATA_TYPES.EDUCATION,
  );

  const educationDataArray: Data[] = [];
  educationInfoObject.map((card) => {
    educationDataArray.push(card.data);
    return null;
  });

  const workInfoObject = appDataArray.filter(
    (obj: AppData) => obj.type === APP_DATA_TYPES.WORKEXPERIENCE,
  );
  const workDataArray: Data[] = [];
  workInfoObject.map((card) => {
    workDataArray.push(card.data);
    return null;
  });

  const skillsInfoObject = appDataArray.filter(
    (obj: AppData) => obj.type === APP_DATA_TYPES.SKILLS,
  );
  const skillsDataArray: Data[] = [];
  skillsInfoObject.map((card) => {
    skillsDataArray.push(card.data);
    return null;
  });

  const portfolioInfoObject = appDataArray.filter(
    (obj: AppData) => obj.type === APP_DATA_TYPES.PORTFOLIO,
  );
  const portfolioDataArray: Data[] = [];
  portfolioInfoObject.map((card) => {
    portfolioDataArray.push(card.data);
    return null;
  });

  const motivationObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.MOTIVATION,
  )?.data as MotivationObj;
  const referencesInfoObject = appDataArray.filter(
    (obj: AppData) => obj.type === APP_DATA_TYPES.REFERENCES,
  );
  const referencesDataArray: Data[] = [];
  referencesInfoObject.map((card) => {
    referencesDataArray.push(card.data);
    return null;
  });
  const cvStatusObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.CVSTATUSDATA,
  )?.data as CvStatusObj;
  const cvObj = {
    personalInfo: personalInfoObject,
    educationInfo: educationDataArray as EducationInfoObj[],
    workInfo: workDataArray as WorkExperienceObj[],
    skillsInfo: skillsDataArray as SkillsObj[],
    portfolioInfo: portfolioDataArray as PortfolioObj[],
    motivationInfo: motivationObject,
    referencesInfo: referencesDataArray as ReferencesObj[],
    cvStateInfo: cvStatusObject,
  };
  const cvValues = appDataArray.find(
    (obj: AppData) => obj.type === APP_DATA_TYPES.CV_VALUES,
  )?.data as CVInfoObj;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let renderedTemplate: any = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let handleDownload = async (): Promise<void> => {};

  if (cvValues) {
    const { component: CvTemplate } = TEMPLATES.find(
      (t) => t.id === cvValues.cvStateInfo.selectedTemplateId,
    ) || { component: FirstTemplate };
    renderedTemplate = <CvTemplate cvValues={cvValues} />;
    handleDownload = async (): Promise<void> => {
      const pdfBlob = await pdf(renderedTemplate).toBlob();
      saveAs(pdfBlob, 'generated-cv.pdf');
      const json = JSON.stringify(cvValues, null, 2); // Convert to JSON string with indentation
      const jsonBlob = new Blob([json], { type: 'application/json' });
      saveAs(jsonBlob, 'cv-data.json');
    };
  } else if (cvObj) {
    const { component: CvTemplate } = TEMPLATES.find(
      (t) => t.id === cvObj.cvStateInfo.selectedTemplateId,
    ) || { component: FirstTemplate };
    renderedTemplate = <CvTemplate cvValues={cvObj} />;
    handleDownload = async (): Promise<void> => {
      const pdfBlob = await pdf(renderedTemplate).toBlob();
      saveAs(pdfBlob, 'generated-cv.pdf');
      const json = JSON.stringify(cvObj, null, 2); // Convert to JSON string with indentation
      const jsonBlob = new Blob([json], { type: 'application/json' });
      saveAs(jsonBlob, 'cv-data.json');
    };
  }

  const handleStatusPost = (newdata: SubmissionStatus): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.SUBMISSION_STATUS });
  };
  const handleNext = (): void => {
    nextPage();
    // todo: save an app data that says the candidate is done!
    // APP_DATA_TYPES.SUBMISSION_STATUS;
    handleStatusPost({ message: 'Submission Done' });
    homeStep();
  };
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  return (
    <Box>
      <Typography>Generated CV</Typography>
      <Box justifyContent="center" display="flex">
        <PDFViewer
          showToolbar={false}
          style={{ minHeight: '75vh', minWidth: '50%' }}
        >
          {renderedTemplate}
        </PDFViewer>
      </Box>
      <ButtonGroup
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          marginTop: '16px',
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
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          style={{ alignSelf: 'center' }}
        >
          Download
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          onClick={handleNext}
          style={{ alignSelf: 'flex-end' }}
        >
          Finish
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default Review;
