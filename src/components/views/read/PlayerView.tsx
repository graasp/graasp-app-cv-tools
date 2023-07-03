import { FC, useState } from 'react';

import { Box } from '@mui/material';

import { PLAYER_VIEW_CY } from '../../../config/selectors';
import Education from './cvForm/Education';
import FormLayout from './cvForm/FormLayout';
import Home from './cvForm/Home';
import MotivationLetter from './cvForm/MotivationLetter';
import PersonalInfo from './cvForm/PersonalInfo';
import Portfolio from './cvForm/Portfolio';
import References from './cvForm/References';
import Review from './cvForm/Review';
import Skills from './cvForm/Skills';
import Template from './cvForm/Template';
import WorkExperience from './cvForm/WorkExperience';
import { CVInfoObj } from './cvForm/types';

const PlayerView: FC = () => {
  const [page, setPage] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const nextPage = (): void => setPage(page + 1);
  const prevPage = (): void => setPage(page - 1);
  const nextStep = (): void => setActiveStep(activeStep + 1);
  const prevStep = (): void => setActiveStep(activeStep - 1);
  const homeStep = (): void => setActiveStep(0);
  const templateStep = (): void => setActiveStep(8);
  const steps = [
    'Home',
    'Personal Info',
    'Education',
    'Work Experience',
    'Skills',
    'Portfolio',
    'Motivation Letter',
    'References',
    'Template',
    'Review',
  ];

  const [cvValues, setCvValues] = useState<CVInfoObj>({
    personalInfo: {
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
    },
    educationInfo: [],
    workInfo: [],
    skillsInfo: [
      { title: 'Tech Skills', skills: [] },
      { title: 'Lang Skills', skills: [] },
      { title: 'Other Skills', skills: [] },
    ],
    portfolioInfo: [],
    motivationInfo: {
      motivationLetter: '',
    },
    referencesInfo: [],
    templateInfo: { selectedTemplateId: '' },
  });
  const handleCvValuesChange = <K extends keyof CVInfoObj>(
    subkey: K,
    newSubkeyValues: CVInfoObj[K],
  ): void => {
    setCvValues((prevCvValues) => ({
      ...prevCvValues,
      [subkey]: newSubkeyValues,
    }));
  };
  const handleUploadCvValues = (data: CVInfoObj): void => {
    setCvValues(data);
  };
  return (
    <Box data-cy={PLAYER_VIEW_CY}>
      <FormLayout activeStep={activeStep} steps={steps}>
        {/* We can also instead use Switch-Cases for the rendering process */}
        {activeStep === 0 && (
          <Home
            nextPage={nextPage}
            nextStep={nextStep}
            templateStep={templateStep}
            onCvValuesUpload={(cvData) => handleUploadCvValues(cvData)}
          />
        )}
        {activeStep === 1 && (
          <PersonalInfo
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            personalInfo={cvValues.personalInfo}
            onCvValuesChange={(data) =>
              handleCvValuesChange('personalInfo', data)
            }
          />
        )}
        {activeStep === 2 && (
          <Education
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {activeStep === 3 && (
          <WorkExperience
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {activeStep === 4 && (
          <Skills
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            skillsData={cvValues.skillsInfo}
            onCvValuesChange={(data) =>
              handleCvValuesChange('skillsInfo', data)
            }
          />
        )}
        {activeStep === 5 && (
          <Portfolio
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {activeStep === 6 && (
          <MotivationLetter
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            motivationInfo={cvValues.motivationInfo}
            onCvValuesChange={(data) =>
              handleCvValuesChange('motivationInfo', data)
            }
          />
        )}
        {activeStep === 7 && (
          <References
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {activeStep === 8 && (
          <Template
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            homeStep={homeStep}
            prevStep={prevStep}
            cvValues={cvValues}
            templateData={cvValues.templateInfo}
            onCvValuesChange={(data) =>
              handleCvValuesChange('templateInfo', data)
            }
          />
        )}
        {activeStep === 9 && (
          <Review
            nextPage={nextPage}
            prevPage={prevPage}
            homeStep={homeStep}
            prevStep={prevStep}
            cvValues={cvValues}
          />
        )}
      </FormLayout>
    </Box>
  );
};

export default PlayerView;
