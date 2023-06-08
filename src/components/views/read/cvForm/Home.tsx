import { FC, RefObject, useRef } from 'react';

import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, Stack, Typography } from '@mui/material';

interface Props {
  nextPage: () => void;
  nextStep: () => void;
}
const Home: FC<Props> = ({ nextPage, nextStep }) => {
  // const inputRef = useRef(null);
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const handleNext = (): void => {
    nextPage();
    nextStep(); // Update the activeStep state
  };
  const handleClick = (): void => {
    // 👇️ open file input box on click of another element
    inputRef.current?.click();
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
            accept=".doc,.docx,application/pdf"
            style={{ display: 'none' }}
            ref={inputRef}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadFileIcon />}
            onClick={handleClick}
          >
            Upload CV
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
