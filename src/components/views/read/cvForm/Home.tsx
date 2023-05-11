import { FC } from 'react';

import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button } from '@mui/material';

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
    <div>
      <Button
        style={{ position: 'absolute', top: '605px', left: '628px' }}
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleNext}
      >
        Create
      </Button>
      <Button
        style={{ position: 'absolute', top: '599px', left: '1070px' }}
        sx={{ width: 165 }}
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
      >
        Upload CV
      </Button>
      Main
    </div>
  );
};

export default Home;
