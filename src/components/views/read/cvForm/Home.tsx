import { FC } from 'react';

import { Add } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';

interface Props {
  nextPage: () => void;
  nextStep: () => void;
}
const Home: FC<Props> = ({ nextPage, nextStep }) => {
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
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
