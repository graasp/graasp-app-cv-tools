import { ChangeEvent, FC, RefObject, useEffect, useRef, useState } from 'react';

import { AppData } from '@graasp/apps-query-client';

import ClearIcon from '@mui/icons-material/Clear';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import { PDFViewer } from '@react-pdf/renderer';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { useAppDataContext } from '../../../context/AppDataContext';
import FirstTemplate from './templates/FirstTemplate';
import {
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
  prevStep: () => void;
}
const Template: FC<Props> = ({ nextStep, prevStep }) => {
  const { patchAppData, appDataArray } = useAppDataContext();
  const cvStatusObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.CV_STATUS_INFO,
  );
  const handlePatch = (dataObj: AppData, newData: CvStatusObj): void => {
    patchAppData({ id: dataObj.id, data: newData });
  };

  const [cvInfoState, setCvInfoState] = useState<
    AppData & { data: CvStatusObj }
  >();

  useEffect(() => {
    const cvStatusData = appDataArray.find(
      (obj: AppData) => obj.type === APP_DATA_TYPES.CV_STATUS_INFO,
    ) as AppData & { data: CvStatusObj };
    setCvInfoState(cvStatusData);
  }, [appDataArray]);

  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const [url, setUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [radioValue, setRadioValue] = useState(
    cvInfoState?.data.customCv || cvStatusObject?.data.customCv
      ? 'customCv'
      : 'generatedCv',
  );

  const handleClick = (): void => {
    // Clear the value of the file input before opening the file selection dialog
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    inputRef.current?.click();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { files } = e.target;
    const file = files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setUrl(dataUrl as string);
        setUploadedFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, reset the uploaded file state
      setUploadedFile(null);
    }
  };

  const handleFileRemove = (): void => {
    setUrl('');
    setUploadedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRadioGroup = (): void => {
    if (radioValue === 'generatedCv') {
      setCvInfoState((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          data: {
            ...prev.data,
            selectedTemplateId: 'formalTemplate',
            customCv: false,
          },
        };
      });
    } else if (radioValue === 'customCv' && uploadedFile) {
      setCvInfoState((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          data: {
            ...prev.data,
            selectedTemplateId: '',
            customCv: true,
            fileUrl: url,
            fileUploaded: uploadedFile,
          },
        };
      });
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRadioValue(event.target.value);
  };
  useEffect(() => {
    if (radioValue === 'customCv' && uploadedFile) {
      handleRadioGroup();
    } else if (radioValue === 'generatedCv') {
      handleRadioGroup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radioValue, uploadedFile]);

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

  const cvObj = {
    personalInfo: personalInfoObject,
    educationInfo: educationDataArray,
    workInfo: workDataArray,
    skillsInfo: skillsDataArray,
    portfolioInfo: portfolioDataArray,
    motivationInfo: motivationObject,
    referencesInfo: referencesDataArray,
  };

  const handlePrev = (): void => {
    prevStep();
  };
  const handleNext = (): void => {
    if (cvStatusObject && cvInfoState) {
      handlePatch(cvStatusObject, cvInfoState.data);
    }
    nextStep();
  };
  const description =
    "Please fill the fields according to the following description. For this part you can either pickup and select the template that you would like to have on your CV applied on the information you provided in the previous sections, by making sure the Generated CV is checked, then click on Select, or upload your own custom CV, by uploading the file first, and making sure it's in pdf format, then make sure that Custom CV is checked, then Save and proceed to next section by clicking on Next.";
  return (
    <Box>
      <Typography sx={{ m: '0.5rem' }}>{description}</Typography>
      <FormControl>
        <RadioGroup value={radioValue} onChange={handleChange}>
          <FormControlLabel
            value="generatedCv"
            control={<Radio />}
            label="Generated CV"
          />
          <FormControlLabel
            value="customCv"
            control={<Radio />}
            label="Custom CV"
            disabled={!uploadedFile}
          />
        </RadioGroup>
      </FormControl>

      <input
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={onChange}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
        onClick={handleClick}
        style={{ display: 'flex' }}
      >
        Upload CV
      </Button>
      {uploadedFile && (
        <Box display="flex" alignItems="center">
          <Typography>{uploadedFile.name}</Typography>
          <IconButton onClick={handleFileRemove} color="primary">
            <ClearIcon />
          </IconButton>
        </Box>
      )}
      <Card>
        <CardContent>
          {radioValue === 'generatedCv' && (
            <PDFViewer
              showToolbar={false}
              style={{ width: '100%', minHeight: '350px' }}
            >
              <FirstTemplate cvValues={cvObj} />
            </PDFViewer>
          )}
          {uploadedFile && radioValue === 'customCv' && (
            <Box justifyContent="center" display="flex">
              <embed
                src={`${url}#toolbar=0`}
                type="application/pdf"
                style={{ minHeight: '350px', width: '100%' }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

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
          startIcon={<NavigateNextIcon />}
          onClick={handleNext}
          style={{ alignSelf: 'flex-end' }}
        >
          Next
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default Template;
