import { FC, RefObject, useRef } from 'react';

import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button } from '@mui/material';

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
      <input
        type="file"
        accept=".doc,.docx,application/pdf"
        style={{ display: 'none' }}
        ref={inputRef}
      />
      <Button
        style={{ position: 'absolute', top: '599px', left: '1070px' }}
        sx={{ width: 165 }}
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
        onClick={handleClick}
      >
        Upload CV
      </Button>
      Main
    </div>
  );
};

export default Home;
