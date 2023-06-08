import { Dayjs } from 'dayjs';

import { FC, useState } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {
  Typography as BaseTypography,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  styled,
} from '@mui/material';

type PersonalInfoObj = {
  firstName: string;
  lastName: string;
  birthDate: Dayjs;
  gender: string;
  emailAddress: string;
  phoneNum: string;
  address: string;
  profileLinks: string;
  personalLink: string;
  personalPic: string;
};
type EducationInfoObj = {
  degree: string;
  institutionName: string;
  major: string;
  startDate: Dayjs;
  endDate: Dayjs;
  gpa: string;
  country: string;
};
type WorkExperienceObj = {
  jobTitle: string;
  institutionName: string;
  startDate: Dayjs;
  endDate: Dayjs;
  country: string;
  jobDetails: string;
  keyAchievements: string;
};
type SkillsObj = {
  skills: string[];
  title: string;
};
type PortfolioObj = {
  projectTitle: string;
  projectDescription: string;
  startDate: Dayjs;
  endDate: Dayjs;
  projectLink: string;
};
type MotivationObj = {
  motivationLetter: string;
};
type ReferencesObj = {
  referenceName: string;
  referenceRelation: string;
  referenceCompany: string;
  referencePhoneNum: string;
  referenceEmail: string;
};
interface InnerObject {
  [key: string]: string;
}

type CVInfoObj = {
  personalInfo: PersonalInfoObj;
  educationInfo: EducationInfoObj[];
  workInfo: WorkExperienceObj[];
  skillsInfo: SkillsObj[];
  portfolioInfo: PortfolioObj[];
  motivationInfo: MotivationObj;
  referencesInfo: ReferencesObj[];
};

interface ValuesObject {
  [key: string]: InnerObject;
}
interface Props {
  nextPage: () => void;
  prevPage: () => void;
  homeStep: () => void;
  prevStep: () => void;
  values: CVInfoObj;
}

const Review: FC<Props> = ({
  nextPage,
  prevPage,
  homeStep,
  prevStep,
  values,
}) => {
  const Typography = styled(BaseTypography)(() => ({
    fontSize: '50%',
  })) as typeof BaseTypography;
  const handleNext = (): void => {
    nextPage();
    homeStep();
  };
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const [cards, setCards] = useState([{ id: 1 }]);
  const handleDownload = (): void => {
    const CvGenerated = 'link';
    <a
      href={CvGenerated}
      download="Example-PDF-document"
      target="_blank"
      rel="noreferrer"
    >
      <Button type="button">Download .pdf file</Button>
    </a>;
  };
  console.log(values);
  // const personalData = values['Personal Info'];
  // const educationData = values.Education;
  // const workData = values['Work Experience'];
  // const skillsData = values.Skills;
  // const portfolioData = values.Portfolio;
  // const motivationData = values['Motivation Letter'];
  // const referencesData = values.References;

  return (
    <div>
      <h2>Review</h2>
      <Button
        style={{ position: 'absolute', top: '1555px', left: '550px' }}
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Back
      </Button>
      <Button
        style={{ position: 'absolute', top: '1555px', left: '1570px' }}
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

export default Review;
