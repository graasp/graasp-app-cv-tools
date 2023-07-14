import { FC, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Box, Step, StepLabel, Stepper } from '@mui/material';

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
    'Personal Details',
    'Education and Training',
    'Work Experience',
    'Skills',
    'Projects',
    'Motivation Letter',
    'References',
    'Cv',
    'Review',
  ];
  const [stepState, setStepState] = useState<
    ('done' | 'error' | 'inprogress')[]
  >(steps.map(() => 'inprogress'));

  const handleStepClick = (stepIndex: number): void => {
    if (
      stepIndex >= 0 &&
      stepIndex < steps.length - 2 &&
      stepState[activeStep] !== 'error'
    ) {
      modifyActiveStep(stepIndex);
    }
  };
  const stepper = (
    <Stepper nonLinear activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => (
        <Step
          key={index}
          onClick={() => handleStepClick(index)}
          style={{
            cursor:
              index !== steps.length - 1 && index !== steps.length - 2
                ? 'pointer'
                : 'default',
          }}
          completed={stepState[index] === 'done'}
        >
          <StepLabel
            StepIconComponent={
              stepState[index] === 'error' ? ErrorIcon : undefined
            }
            error={stepState[index] === 'error'}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );

  const handleStepState = (
    index: number,
    state: 'done' | 'error' | 'inprogress',
  ): void =>
    setStepState((prev) => {
      const newState = [...prev];
      newState[index] = state;
      return newState;
    });
  return (
    <Box data-cy={PLAYER_VIEW_CY}>
      <FormLayout stepper={stepper}>
        {/* We can also instead use Switch-Cases for the rendering process */}
        {activeStep === 0 && (
          <Home
            nextStep={() => {
              handleStepState(0, 'done');
              nextStep();
            }}
            reviewStep={reviewStep}
          />
        )}
        {activeStep === 1 && (
          <PersonalInfo
            onError={(isError: boolean) =>
              handleStepState(1, isError ? 'error' : 'inprogress')
            }
            nextStep={() => {
              handleStepState(1, 'done');
              nextStep();
            }}
            prevStep={() => {
              handleStepState(0, 'inprogress');
              prevStep();
            }}
          />
        )}
        {activeStep === 2 && (
          <Education
            onError={(isError: boolean) =>
              handleStepState(2, isError ? 'error' : 'inprogress')
            }
            nextStep={() => {
              handleStepState(2, 'done');
              nextStep();
            }}
            prevStep={() => {
              handleStepState(1, 'inprogress');
              prevStep();
            }}
          />
        )}
        {activeStep === 3 && (
          <WorkExperience
            onError={(isError: boolean) =>
              handleStepState(3, isError ? 'error' : 'inprogress')
            }
            nextStep={() => {
              handleStepState(3, 'done');
              nextStep();
            }}
            prevStep={() => {
              handleStepState(2, 'inprogress');
              prevStep();
            }}
          />
        )}
        {activeStep === 4 && (
          <Skills
            nextStep={() => {
              handleStepState(4, 'done');
              nextStep();
            }}
            prevStep={() => {
              handleStepState(3, 'inprogress');
              prevStep();
            }}
          />
        )}
        {activeStep === 5 && (
          <Portfolio
            onError={(isError: boolean) =>
              handleStepState(5, isError ? 'error' : 'inprogress')
            }
            nextStep={() => {
              handleStepState(5, 'done');
              nextStep();
            }}
            prevStep={() => {
              handleStepState(4, 'inprogress');
              prevStep();
            }}
          />
        )}
        {activeStep === 6 && (
          <MotivationLetter
            nextStep={() => {
              handleStepState(6, 'done');
              nextStep();
            }}
            prevStep={() => {
              handleStepState(5, 'inprogress');
              prevStep();
            }}
          />
        )}
        {activeStep === 7 && (
          <References
            onError={(isError: boolean) =>
              handleStepState(7, isError ? 'error' : 'inprogress')
            }
            nextStep={() => {
              handleStepState(7, 'done');
              nextStep();
            }}
            prevStep={() => {
              handleStepState(6, 'inprogress');
              prevStep();
            }}
          />
        )}
        {activeStep === 8 && (
          <Template
            nextStep={() => {
              handleStepState(8, 'done');
              nextStep();
            }}
            prevStep={() => {
              handleStepState(7, 'inprogress');
              prevStep();
            }}
          />
        )}
        {activeStep === 9 && <Review homeStep={homeStep} prevStep={prevStep} />}
      </FormLayout>
    </Box>
  );
};

export default PlayerView;
