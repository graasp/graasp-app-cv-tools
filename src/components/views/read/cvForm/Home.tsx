import { ChangeEvent, FC, RefObject, useRef } from 'react';

import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Stack, Typography } from '@mui/material';

import { CVInfoObj } from './types';

interface Props {
  nextPage: () => void;
  nextStep: () => void;
  templateStep: () => void;
  onCvValuesUpload: (cvData: CVInfoObj) => void;
}
const Home: FC<Props> = ({
  nextPage,
  nextStep,
  templateStep,
  onCvValuesUpload,
}) => {
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { files } = e.target;
    const file = files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        const parsedData = JSON.parse(fileContent) as CVInfoObj;
        onCvValuesUpload(parsedData);

        templateStep();
      };
      reader.readAsText(file);
    }
  };
  const handleClick = (): void => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };
  const handleNext = (): void => {
    nextPage();
    nextStep(); // Update the activeStep state
  };
  return (
    <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
      <Stack spacing={2}>
        <Typography>Get Started</Typography>
        <Typography>
          Upload your CV/Resume if you have one, or you can create a new one and
          upload it directly!
        </Typography>
        <Stack direction="row" justifyContent="space-evenly">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleNext}
          >
            Create
          </Button>
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            ref={inputRef}
            onChange={onChange}
          />
          <Button
            startIcon={<UploadFileIcon />}
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            Upload Data
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
