import React, { FC, useState } from 'react';

import DoneIcon from '@mui/icons-material/Done';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

interface InnerObject {
  [key: string]: string;
}

interface ValuesObject {
  [key: string]: InnerObject;
}
interface HandleModifyFunction {
  (category: string, modifiedValues: any): void;
}
interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  values: ValuesObject;
  handleValues: HandleModifyFunction;
}
interface TemplateState {
  id: number;
  showFields: boolean;
}
const Template: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  values,
  handleValues,
}) => {
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const [templates, setTemplates] = useState([
    { id: 1, thumbnailink: 'hello', title: 'professional template' },
    { id: 2, thumbnailink: '2nd', title: 'normal template' },
    { id: 3, thumbnailink: '3rd', title: 'modern template' },
  ]);
  const [templateStates, setTemplateStates] = useState<TemplateState[]>(
    templates.map((template) => ({ id: template.id, showFields: false })),
  );
  const handleDone = (templateId: number): void => {
    const updatedTemplateStates = templateStates.map((templateState) => {
      if (templateState.id === templateId) {
        return { ...templateState, showFields: false };
      }
      return templateState;
    });
    setTemplateStates(updatedTemplateStates);
  };
  const handleNext = (): void => {
    // const modifiedValues = {...values, 'Template': {selectedTemplate}}
    // handleValues(modifiedValues);
    nextPage();
    nextStep();
  };
  return (
    <div>
      <h2>Template</h2>
      {templates.map((template, index) => (
        <Card
          key={template.id}
          sx={{
            maxWidth: 900,
            position: 'relative',
            zIndex: 100,
            height: '400px',
            overflow: 'auto',
          }}
          className={`card-item card-${template.id}`}
        >
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {template.title} - {template.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select A Template
            </Typography>
            {templateStates[index].showFields && (
              <img alt={template.title} src={template.thumbnailink} />
            )}
          </CardContent>
          <CardActions>
            <Button
              size="small"
              startIcon={<DoneIcon />}
              onClick={() => handleDone(template.id)}
            >
              Select
            </Button>
          </CardActions>
        </Card>
      ))}
      <Button
        style={{ position: 'absolute', top: '605px', left: '628px' }}
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Back
      </Button>
      <Button
        style={{ position: 'absolute', top: '599px', left: '1070px' }}
        sx={{ width: 165 }}
        variant="contained"
        color="primary"
        startIcon={<NavigateNextIcon />}
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Template;
