import { ChangeEvent, FC, RefObject, useEffect, useRef, useState } from 'react';

import { AppData } from '@graasp/apps-query-client/dist/types';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
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
import { TEMPLATES } from './constants';
import { CVInfoObj, CvStatusObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  cvValues: CVInfoObj;
}
const Template: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  cvValues,
}) => {
  const { patchAppData, appDataArray } = useAppDataContext();
  const cvStatusObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.CVSTATUSDATA,
  );

  const handlePatch = (dataObj: AppData, newData: CvStatusObj): void => {
    patchAppData({ id: dataObj.id, data: newData });
  };

  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const [url, setUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState(false);
  const [templateSelection, setTemplateSelection] = useState(false);
  const [radioValue, setRadioValue] = useState('generatedCv');
  const [cvInfoState, setCvInfoState] = useState<
    AppData & { data: CvStatusObj }
  >();

  useEffect(() => {
    const cvStatusData = appDataArray.find(
      (obj: AppData) => obj.type === APP_DATA_TYPES.CVSTATUSDATA,
    ) as AppData & { data: CvStatusObj };
    setCvInfoState(cvStatusData);
  }, [appDataArray]);

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
    setVisibility(false);
    setUrl('');
    setUploadedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleVisibility = (): void => {
    setVisibility(!visibility);
  };
  const handleRadioGroup = (templateId?: string): void => {
    if (radioValue === 'generatedCv' && templateId) {
      setCvInfoState((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          data: {
            ...prev.data,
            selectedTemplateId: templateId,
            customCv: false,
          },
        };
      });
      setTemplateSelection(true);
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
    }
  });

  const handleSave = (): void => {
    if (cvStatusObject && cvInfoState) {
      handlePatch(cvStatusObject, cvInfoState.data);
    }
  };
  const hasChanges =
    cvInfoState &&
    Object.keys(cvInfoState.data).some(
      (key) => cvInfoState.data[key] !== cvStatusObject?.data[key],
    );
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const handleNext = (): void => {
    nextPage();
    nextStep();
  };

  return (
    <Box>
      <Typography sx={{ m: '0.5rem' }}>
        For this part you can either pickup and select the template that you
        would like to have on your Cv applied on the information you provided in
        the previous sections, by making sure the &quot;Generated Cv&quot; is
        checked, then click on Select, or upload your own custom Cv, by
        uploading the file first, and making sure it&apos;s in pdf format, then
        make sure that &quot;Custom Cv&quot; is checked, then Save and proceed
        to next section by clicking on Next.
      </Typography>
      <FormControl>
        <RadioGroup value={radioValue} onChange={handleChange}>
          <FormControlLabel
            value="generatedCv"
            control={<Radio />}
            label="Generated Cv"
          />
        </RadioGroup>
      </FormControl>
      {TEMPLATES.map((template) => (
        <Card key={template.id}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {template.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select A Template
            </Typography>
            <PDFViewer showToolbar={false} style={{ width: '100%' }}>
              <template.component cvValues={cvValues} />
            </PDFViewer>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              startIcon={<DoneIcon />}
              onClick={() => {
                handleRadioGroup(template.id);
              }}
              disabled={templateSelection}
            >
              Select
            </Button>
          </CardActions>
        </Card>
      ))}
      <FormControl>
        <RadioGroup value={radioValue} onChange={handleChange}>
          <FormControlLabel
            value="customCv"
            control={<Radio />}
            label="Custom Cv"
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
      >
        Upload CV
      </Button>
      {uploadedFile && (
        <Box display="flex" alignItems="center">
          <Typography>{uploadedFile.name}</Typography>
          <IconButton onClick={handleFileRemove} color="primary">
            <ClearIcon />
          </IconButton>
          <IconButton onClick={handleVisibility} color="primary">
            <VisibilityIcon />
          </IconButton>
        </Box>
      )}
      {visibility && (
        <Box justifyContent="center" display="flex">
          <embed
            src={`${url}#toolbar=0`}
            type="application/pdf"
            style={{ minHeight: '75vh', minWidth: '50%' }}
          />
        </Box>
      )}
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
          startIcon={<SaveIcon />}
          onClick={handleSave}
          style={{ alignSelf: 'center' }}
          disabled={!hasChanges}
        >
          Save
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
