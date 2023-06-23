import { ChangeEvent, FC, RefObject, useEffect, useRef, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';

import { PDFViewer } from '@react-pdf/renderer';

import FirstTemplate from './templates/FirstTemplate';
import { CVInfoObj, TemplateObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  templateData: TemplateObj[];
  cvValues: CVInfoObj;
  onCvValuesChange: (data: TemplateObj[]) => void;
}
const Template: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  templateData,
  cvValues,
  onCvValuesChange,
}) => {
  const [templates, setTemplates] = useState(templateData);
  useEffect(() => {
    setTemplates(templateData);
  }, [templateData]);

  const handleSelect = (templateId: number): void => {
    const updatedTemplates = templates.map((template) =>
      template.id === templateId
        ? { ...template, selected: true }
        : { ...template, selected: false },
    );

    setTemplates(updatedTemplates);
    onCvValuesChange(updatedTemplates);
    nextPage();
    nextStep();
  };
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const [url, setUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState(false);

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
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };

  const personalData = cvValues.personalInfo;
  const educationData = cvValues.educationInfo;
  const workData = cvValues.workInfo;
  const skillsData = cvValues.skillsInfo;
  const portfolioData = cvValues.portfolioInfo;
  const motivationData = cvValues.motivationInfo;
  const referencesData = cvValues.referencesInfo;
  return (
    <Box>
      {templates.map((template) => (
        <Card key={template.id}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {template.title} - {template.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select A Template
            </Typography>
            {template.title === 'professional template' && (
              <PDFViewer showToolbar={false}>
                <FirstTemplate cvValues={cvValues} />
              </PDFViewer>
            )}
          </CardContent>
          <CardActions>
            <Button
              size="small"
              startIcon={<DoneIcon />}
              onClick={() => handleSelect(template.id)}
            >
              Select
            </Button>
          </CardActions>
        </Card>
      ))}
      <Button
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Back
      </Button>
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
    </Box>
  );
};

export default Template;
