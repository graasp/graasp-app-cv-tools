import { ChangeEvent, FC, RefObject, useEffect, useRef, useState } from 'react';

import { AppData, Data } from '@graasp/apps-query-client/dist/types';

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
  prevStep: () => void;
}
const Template: FC<Props> = ({ nextStep, prevStep }) => {
  const { patchAppData, appDataArray } = useAppDataContext();
  const cvStatusObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.CVSTATUSDATA,
  );
  const cvValues = appDataArray.find(
    (obj: AppData) => obj.type === APP_DATA_TYPES.CV_VALUES,
  );
  const handlePatch = (dataObj: AppData, newData: CvStatusObj): void => {
    patchAppData({ id: dataObj.id, data: newData });
  };
  const handleCvValuesPatch = (dataObj: AppData, newData: CVInfoObj): void => {
    patchAppData({ id: dataObj.id, data: newData });
  };

  const [cvValuesState, setCvValuesState] = useState<
    AppData & { data: CVInfoObj }
  >();

  useEffect(() => {
    const cvData = appDataArray.find(
      (obj: AppData) => obj.type === APP_DATA_TYPES.CV_VALUES,
    ) as AppData & { data: CVInfoObj };
    setCvValuesState(cvData);
  }, [appDataArray]);

  const [cvInfoState, setCvInfoState] = useState<
    AppData & { data: CvStatusObj }
  >();

  useEffect(() => {
    const cvStatusData = appDataArray.find(
      (obj: AppData) => obj.type === APP_DATA_TYPES.CVSTATUSDATA,
    ) as AppData & { data: CvStatusObj };
    setCvInfoState(cvStatusData);
  }, [appDataArray]);

  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const [url, setUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [radioValue, setRadioValue] = useState(
    cvValuesState?.data.cvStateInfo.customCv || cvInfoState?.data.customCv
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
      if (cvValuesState) {
        setCvValuesState((prev) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            data: {
              ...prev.data,
              cvStateInfo: {
                selectedTemplateId: 'formalTemplate',
                customCv: false,
              },
            },
          };
        });
      }

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
      if (cvValuesState) {
        setCvValuesState((prev) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            data: {
              ...prev.data,
              cvStateInfo: {
                selectedTemplateId: '',
                customCv: true,
                fileUrl: url,
                fileUploaded: uploadedFile,
              },
            },
          };
        });
      }

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
  const cvObj = {
    personalInfo: personalInfoObject,
    educationInfo: educationDataArray as EducationInfoObj[],
    workInfo: workDataArray as WorkExperienceObj[],
    skillsInfo: skillsDataArray as SkillsObj[],
    portfolioInfo: portfolioDataArray as PortfolioObj[],
    motivationInfo: motivationObject,
    referencesInfo: referencesDataArray as ReferencesObj[],
  };

  const handlePrev = (): void => {
    prevStep();
  };
  const handleNext = (): void => {
    if (cvStatusObject && cvInfoState) {
      handlePatch(cvStatusObject, cvInfoState.data);
    } else if (cvValues && cvValuesState) {
      handleCvValuesPatch(cvValues, cvValuesState.data);
    }
    nextStep();
  };

  return (
    <Box>
      <Typography sx={{ m: '0.5rem' }}>
        For this part you can either pickup and select the template that you
        would like to have on your CV applied on the information you provided in
        the previous sections, by making sure the &quot;Generated CV&quot; is
        checked, then click on Select, or upload your own custom CV, by
        uploading the file first, and making sure it&apos;s in pdf format, then
        make sure that &quot;Custom CV&quot; is checked, then Save and proceed
        to next section by clicking on Next.
      </Typography>
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
              {cvValues ? (
                <FirstTemplate cvValues={cvValues.data} />
              ) : (
                <FirstTemplate cvValues={cvObj} />
              )}
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
