import { saveAs } from 'file-saver';

import { FC } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

import { PDFViewer, pdf } from '@react-pdf/renderer';

import { TEMPLATES } from './constants';
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
  const { component: CvTemplate } = TEMPLATES.find(
    (t) => t.id === cvValues.cvStateInfo.selectedTemplateId,
  ) || { component: FirstTemplate };
  const renderedTemplate = <CvTemplate cvValues={cvValues} />;

  const handleDownload = async (): Promise<void> => {
    const pdfBlob = await pdf(renderedTemplate).toBlob();
    saveAs(pdfBlob, 'generated-cv.pdf');
    const json = JSON.stringify(cvValues, null, 2); // Convert to JSON string with indentation
    const jsonBlob = new Blob([json], { type: 'application/json' });
    saveAs(jsonBlob, 'generated-cv.json');
  };

  const handleNext = (): void => {
    nextPage();
    // todo: save an app data that says the candidate is done!
    // APP_DATA_TYPES.SUBMISSION_STATUS;
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
        <PDFViewer
          showToolbar={false}
          style={{ minHeight: '75vh', minWidth: '50%' }}
        >
          {renderedTemplate}
        </PDFViewer>
      </Box>
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
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          style={{ alignSelf: 'center' }}
        >
          Download
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          onClick={handleNext}
          style={{ alignSelf: 'flex-end' }}
        >
          Finish
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default Review;
