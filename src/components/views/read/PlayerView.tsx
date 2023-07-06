import { FC, useState } from 'react';

import { Box } from '@mui/material';

import { PLAYER_VIEW_CY } from '../../../config/selectors';
import Template from './cvForm/Cv';
import Education from './cvForm/Education';
import FormLayout from './cvForm/FormLayout';
import Home from './cvForm/Home';
import MotivationLetter from './cvForm/MotivationLetter';
import PersonalInfo from './cvForm/PersonalInfo';
import Portfolio from './cvForm/Portfolio';
import References from './cvForm/References';
import Review from './cvForm/Review';
import Skills from './cvForm/Skills';
import WorkExperience from './cvForm/WorkExperience';

const PlayerView: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const nextStep = (): void => setActiveStep(activeStep + 1);
  const prevStep = (): void => setActiveStep(activeStep - 1);
  const modifyActiveStep = (index: number): void => setActiveStep(index);
  const homeStep = (): void => setActiveStep(0);
  const reviewStep = (): void => setActiveStep(8);
  const steps = [
    'Home',
    'Personal Info',
    'Education',
    'Work Experience',
    'Skills',
    'Portfolio',
    'Motivation Letter',
    'References',
    'Cv',
    'Review',
  ];

  return (
    <Box data-cy={PLAYER_VIEW_CY}>
      <FormLayout
        activeStep={activeStep}
        steps={steps}
        modifyActiveStep={modifyActiveStep}
      >
        {/* We can also instead use Switch-Cases for the rendering process */}
        {activeStep === 0 && (
          <Home nextStep={nextStep} reviewStep={reviewStep} />
        )}
        {activeStep === 1 && (
          <PersonalInfo nextStep={nextStep} prevStep={prevStep} />
        )}
        {activeStep === 2 && (
          <Education nextStep={nextStep} prevStep={prevStep} />
        )}
        {activeStep === 3 && (
          <WorkExperience nextStep={nextStep} prevStep={prevStep} />
        )}
        {activeStep === 4 && <Skills nextStep={nextStep} prevStep={prevStep} />}
        {activeStep === 5 && (
          <Portfolio nextStep={nextStep} prevStep={prevStep} />
        )}
        {activeStep === 6 && (
          <MotivationLetter nextStep={nextStep} prevStep={prevStep} />
        )}
        {activeStep === 7 && (
          <References nextStep={nextStep} prevStep={prevStep} />
        )}
        {activeStep === 8 && (
          <Template nextStep={nextStep} prevStep={prevStep} />
        )}
        {activeStep === 9 && <Review homeStep={homeStep} prevStep={prevStep} />}
      </FormLayout>
    </Box>
  );
};

export default PlayerView;
