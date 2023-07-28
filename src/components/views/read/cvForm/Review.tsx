import { saveAs } from 'file-saver';

import { FC } from 'react';

import { AppData } from '@graasp/apps-query-client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Button, ButtonGroup } from '@mui/material';

import { PDFViewer, pdf } from '@react-pdf/renderer';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { useAppDataContext } from '../../../context/AppDataContext';
import Description from './Description';
import { TEMPLATES } from './constants';
import FirstTemplate from './templates/FirstTemplate';
import {
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
  homeStep: () => void;
  prevStep: () => void;
}
const Review: FC<Props> = ({ homeStep, prevStep }) => {
  const { postAppData, appDataArray } = useAppDataContext();
  const personalInfoObject = appDataArray.find(
    (obj: AppData) => obj.type === APP_DATA_TYPES.PERSONAL_INFO,
  )?.data as PersonalInfoObj;
  const educationInfoObject = appDataArray.filter(
    (obj) => obj.type === APP_DATA_TYPES.EDUCATION_INFO,
  );

  const educationDataArray = educationInfoObject
    .toArray()
    .map((card) => card.data) as EducationInfoObj[];

  const workInfoObject = appDataArray.filter(
    (obj: AppData) => obj.type === APP_DATA_TYPES.WORK_EXPERIENCE_INFO,
  );
  const workDataArray = workInfoObject
    .toArray()
    .map((card) => card.data) as WorkExperienceObj[];

  const skillsInfoObject = appDataArray.filter(
    (obj: AppData) => obj.type === APP_DATA_TYPES.SKILLS_INFO,
  );
  const skillsDataArray = skillsInfoObject
    .toArray()
    .map((card) => card.data) as SkillsObj[];

  const portfolioInfoObject = appDataArray.filter(
    (obj: AppData) => obj.type === APP_DATA_TYPES.PROJECTS_INFO,
  );
  const portfolioDataArray = portfolioInfoObject
    .toArray()
    .map((card) => card.data) as PortfolioObj[];

  const motivationObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.MOTIVATION_INFO,
  )?.data as MotivationObj;
  const referencesInfoObject = appDataArray.filter(
    (obj: AppData) => obj.type === APP_DATA_TYPES.REFERENCES_INFO,
  );
  const referencesDataArray = referencesInfoObject
    .toArray()
    .map((card) => card.data) as ReferencesObj[];
  const cvStatusObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.CV_STATUS_INFO,
  )?.data as CvStatusObj;
  const cvObj = {
    personalInfo: personalInfoObject,
    educationInfo: educationDataArray as EducationInfoObj[],
    workInfo: workDataArray as WorkExperienceObj[],
    skillsInfo: skillsDataArray as SkillsObj[],
    projectsInfo: portfolioDataArray as PortfolioObj[],
    motivationInfo: motivationObject,
    referencesInfo: referencesDataArray as ReferencesObj[],
    cvStatusInfo: cvStatusObject,
  };

  const { component: CvTemplate } = TEMPLATES.find(
    (t) => t.id === cvObj.cvStatusInfo.selectedTemplateId,
  ) || { component: FirstTemplate };
  const renderedTemplate = <CvTemplate cvValues={cvObj} />;
  const handleDownload = async (): Promise<void> => {
    const pdfBlob = await pdf(renderedTemplate).toBlob();
    if (!cvObj.cvStatusInfo.customCv) {
      saveAs(pdfBlob, 'generated-cv.pdf');
    }
    const json = JSON.stringify(cvObj, null, 2); // Convert to JSON string with indentation
    const jsonBlob = new Blob([json], { type: 'application/json' });
    saveAs(jsonBlob, 'cv-data.json');
  };

  const handleStatusPost = (newdata: SubmissionStatus): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.SUBMISSION_STATUS });
  };
  const handleNext = (): void => {
    // instead of appdata, make it appactions
    handleStatusPost({ message: 'Submission Done' });
    homeStep();
  };
  const handlePrev = (): void => {
    prevStep();
  };
  const title = 'Review';
  const description =
    'Please follow the following description. For this part, and the final part of the your progress, as a final step, and after filling all the required fields from previous sections, select the template or uploaded your custom CV, all you can do here is that you can review the filled information, and confirm that they are as you are expecting, thn you can download the pdf file from the Download button, as well as a json file which contains all of your input data, to use next time, so no need to fill up the fields again, if there is no changes, finally you can click on Submit to state that you are done. your CV.';
  return (
    <Box>
      <Description title={title} description={description} />
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
