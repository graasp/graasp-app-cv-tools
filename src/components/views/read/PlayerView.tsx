import { RecordOf } from 'immutable';

import { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Context, LocalContext } from '@graasp/apps-query-client';

import { Box } from '@mui/material';

import { MOCK_SETTING_KEY } from '../../../config/appSettingTypes';
import { hooks } from '../../../config/queryClient';
import { PLAYER_VIEW_CY } from '../../../config/selectors';
import { useAppDataContext } from '../../context/AppDataContext';
import { useAppSettingContext } from '../../context/AppSettingContext';
import { useMembersContext } from '../../context/MembersContext';
import Education from './cvForm/Education';
import FormLayout from './cvForm/FormLayout';
import Home from './cvForm/Home';
import MotivationLetter from './cvForm/MotivationLetter';
import PersonalInfo from './cvForm/PersonalInfo';
import Portfolio from './cvForm/Portfolio';
import References from './cvForm/References';
import Skills from './cvForm/Skills';
import WorkExperience from './cvForm/WorkExperience';
import { CVInfoObj, EducationInfoObj } from './cvForm/types';

const PlayerView: FC = () => {
  // use translations for the text
  const { t } = useTranslation();

  // context describes the item context, i.e. has the item id, current member id (memberId),
  // the language and current view (builder, player, ...), the current permission (admin, write, read)
  const context: RecordOf<LocalContext> = useContext(Context);
  const { data: appContext } = hooks.useAppContext();

  // get the members having access to the space
  const members = useMembersContext();

  // get the appData array and a callback to post new appData
  const { postAppData, appDataArray } = useAppDataContext();

  // get the appData array and a callback to post new appSetting
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  const [settingValue, setSettingValue] = useState('');
  const [settingName, setSettingName] = useState(MOCK_SETTING_KEY);

  const handleAppSetting = (name: string, value: string): void => {
    const mockSetting = appSettingArray.find((s) => s.name === name);

    if (mockSetting) {
      patchAppSetting({ data: { content: value }, id: mockSetting.id });
    } else {
      postAppSetting({ data: { content: value }, name });
    }
  };
  const [page, setPage] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const nextPage = (): void => setPage(page + 1);
  const prevPage = (): void => setPage(page - 1);
  const nextStep = (): void => setActiveStep(activeStep + 1);
  const prevStep = (): void => setActiveStep(activeStep - 1);
  const homeStep = (): void => setActiveStep(0);
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
    skillsInfo: [],
    portfolioInfo: [],
    motivationInfo: {
      motivationLetter: '',
    },
    referencesInfo: [],
  });
  const directAssignSubkeys = [
    'educationInfo',
    'workInfo',
    'skillsInfo',
    'portfolioInfo',
    'referencesInfo',
  ];

  const handleCvValuesChange = (
    subkey: string,
    newSubkeyValues: Partial<CVInfoObj>,
  ): void => {
    if (directAssignSubkeys.includes(subkey)) {
      setCvValues((prevCvValues) => ({
        ...prevCvValues,
        [subkey]: newSubkeyValues,
      }));
    } else {
      setCvValues((prevCvValues) => ({
        ...prevCvValues,
        [subkey]: {
          ...prevCvValues[subkey],
          ...newSubkeyValues,
        },
      }));
    }
  };

  return (
    <Box data-cy={PLAYER_VIEW_CY}>
      <FormLayout activeStep={activeStep} steps={steps}>
        {/* We can also instead use Switch-Cases for the rendering process */}
        {activeStep === 0 && <Home nextPage={nextPage} nextStep={nextStep} />}
        {activeStep === 1 && (
          <PersonalInfo
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            personalInfo={cvValues.personalInfo}
            onCvValuesChange={handleCvValuesChange}
          />
        )}
        {activeStep === 2 && (
          <Education
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            educationData={cvValues.educationInfo}
            onCvValuesChange={handleCvValuesChange}
          />
        )}
        {/* {activeStep === 3 && (
          <WorkExperience
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            cvValues={cvValues}
            onCvValuesChange={handleCvValuesChange}
          />
        )}
        {activeStep === 4 && (
          <Skills
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            cvValues={cvValues}
            onCvValuesChange={handleCvValuesChange}
          />
        )}
        {activeStep === 5 && (
          <Portfolio
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            cvValues={cvValues}
            onCvValuesChange={handleCvValuesChange}
          />
        )}
        {activeStep === 6 && (
          <MotivationLetter
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            cvValues={cvValues}
            onCvValuesChange={handleCvValuesChange}
          />
        )}
        {activeStep === 7 && (
          <References
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            cvValues={cvValues}
            onCvValuesChange={handleCvValuesChange}
          />
        )} */}
        {/* {activeStep === 8 && (
          <Template
            nextPage={nextPage}
            prevPage={prevPage}
            nextStep={nextStep}
            prevStep={prevStep}
            values={cvValues}
            handleValues={handleModify}
          />
        )} */}
        {/* {activeStep === 8 && (
          <Review
            nextPage={nextPage}
            prevPage={prevPage}
            homeStep={homeStep}
            prevStep={prevStep}
            values={cvValues}
          />
        )} */}
      </FormLayout>
    </Box>
  );
};

export default PlayerView;
