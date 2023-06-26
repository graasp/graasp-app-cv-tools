import { saveAs } from 'file-saver';

import React, { FC } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Button, Typography } from '@mui/material';

import { PDFViewer, pdf } from '@react-pdf/renderer';

import { TEMPLATES } from './Constants';
import FirstTemplate from './templates/FirstTemplate';
import { CVInfoObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  homeStep: () => void;
  prevStep: () => void;
  cvValues: CVInfoObj;
}
const Review: FC<Props> = ({
  nextPage,
  prevPage,
  homeStep,
  prevStep,
  cvValues,
}) => {
  const professionalTemplate = <FirstTemplate cvValues={cvValues} />;
  const handleDownload = async (): Promise<void> => {
    const blob = await pdf(professionalTemplate).toBlob();

    saveAs(blob, 'generated-cv.pdf');
  };

  const handleNext = (): void => {
    nextPage();
    homeStep();
  };
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  return (
    <Box>
      <Typography>Generated CV</Typography>
      <Box justifyContent="center" display="flex">
        {TEMPLATES.map((template) => (
          <React.Fragment key={template.id}>
            {template.component && (
              <PDFViewer
                showToolbar={false}
                style={{ minHeight: '75vh', minWidth: '50%' }}
              >
                <template.component cvValues={cvValues} />
              </PDFViewer>
            )}
          </React.Fragment>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
      >
        Download
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CheckCircleIcon />}
        onClick={handleNext}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Review;
