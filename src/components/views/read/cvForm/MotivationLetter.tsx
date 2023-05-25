import React, { FC, useState } from 'react';

import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';

interface InnerObject {
  [key: string]: string;
}

interface ValuesObject {
  [key: string]: InnerObject;
}

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  values: ValuesObject;
  handleValues: (Values: any) => void;
}
const MotivationLetter: FC<Props> = ({
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
  const [showFields, setShowFields] = useState(false);
  const [cards, setCards] = useState([{ id: 1 }]);
  const handleEdit = (): void => {
    setShowFields(true);
  };
  const handleDone = (): void => {
    setShowFields(false);
  };
  const [motivation, setMotivation] = useState('');
  const handleNext = (): void => {
    const modifiedValues = {
      ...values,
      'Motivation Letter': { Motivation: motivation },
    };
    handleValues(modifiedValues);
    nextPage();
    nextStep();
  };
  return (
    <div>
      <h2>Motivation</h2>
      <div>
        {cards.map((card) => (
          <Card
            key={card.id}
            sx={{
              maxWidth: 900,
              position: 'relative',
              zIndex: 100,
              height: '400px',
              overflow: 'auto',
            }}
            style={{ position: 'absolute', top: '400px', left: '770px' }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Personal Motivation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Mottivation
              </Typography>
              {showFields && (
                <TextField
                  label="Motivation Letter"
                  value={motivation}
                  onChange={(e) => {
                    setMotivation(e.target.value);
                  }}
                  multiline
                  required
                />
              )}
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DoneIcon />}
                  onClick={handleDone}
                >
                  Done
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </div>
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

export default MotivationLetter;
