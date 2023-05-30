import dayjs, { Dayjs } from 'dayjs';

import { FC, useState } from 'react';

import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
  // handleValues: (Values: any) => void;
  handleValues: HandleModifyFunction;
}
const Portfolio: FC<Props> = ({
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
  const [cards, setCards] = useState([{ id: 1 }]);
  const handleAdd = (): void => {
    const newCard = { id: cards.length + 1 };
    setCards([...cards, newCard]);
  };
  const [showFields, setShowFields] = useState<boolean[]>([]);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const handleRemove = (cardId: number): void => {
    if (cards.length === 1) {
      return; // Do not allow removing the only card
    }

    const updatedCards = cards.filter((card) => card.id !== cardId);
    setCards(updatedCards);
  };
  const handleEdit = (cardId: number): void => {
    // Find the index of the card being edited
    const cardIndex = cards.findIndex((card) => card.id === cardId);

    // Update the active card index
    setActiveCardIndex(cardIndex);
    const updatedShowFields = [...showFields];

    // Update the visibility for the selected card
    updatedShowFields[cardIndex] = true;

    // Update the state with the new visibility array
    setShowFields(updatedShowFields);
  };
  const handleDone = (cardId: number): void => {
    const updatedShowFields = [...showFields];
    const cardIndex = cards.findIndex((card) => card.id === cardId);
    updatedShowFields[cardIndex] = false; // Set the visibility for the selected card to false
    setShowFields(updatedShowFields); // Update the state with the new visibility array
  };
  const [inputValues, setInputValues] = useState<
    { cardId: number; values: { [key: string]: string } }[]
  >([]);
  const handleChange = (cardId: number, field: string, value: string): void => {
    setInputValues((prevInputValues) => {
      const cardIndex = prevInputValues.findIndex(
        (inputValue) => inputValue.cardId === cardId,
      );

      if (cardIndex === -1) {
        // Card not found in the input values array, add a new entry
        return [...prevInputValues, { cardId, values: { [field]: value } }];
      }

      // Card found in the input values array, update the existing entry
      return prevInputValues.map((inputValue) => {
        if (inputValue.cardId === cardId) {
          return {
            ...inputValue,
            values: { ...inputValue.values, [field]: value },
          };
        }
        return inputValue;
      });
    });
  };
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2022-04-17'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs('2022-04-18'));
  const handleNext = (): void => {
    const modifiedValues = cards.map((card) => {
      const cardInputValues = inputValues.find(
        (inputValue) => inputValue.cardId === card.id,
      );

      return {
        'Project Title': cardInputValues?.values.projectTitle || '',
        'Project Description': cardInputValues?.values.projectDesc || '',
        'Start Date': cardInputValues?.values.startDate || '',
        'End Date': cardInputValues?.values.endDate || '',
        'Project Link': cardInputValues?.values.projectLink || '',
      };
    });
    handleValues('Portfolio', modifiedValues);
    nextPage();
    nextStep();
  };
  return (
    <div>
      <h2>Portfolio</h2>
      <div>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            sx={{
              maxWidth: 900,
              position: 'relative',
              zIndex: 100,
              height: '400px',
              overflow: 'auto',
            }}
            style={{ position: 'absolute', top: '400px', left: '720px' }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Projects - Portfolio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Project
              </Typography>
              {showFields[index] && (
                <>
                  <TextField
                    label="Project Title"
                    value={
                      inputValues.find(
                        (inputValue) => inputValue.cardId === card.id,
                      )?.values.projectTitle || ''
                    }
                    onChange={(e) =>
                      handleChange(card.id, 'projectTitle', e.target.value)
                    }
                    required
                  />
                  <TextField
                    label="Project Description"
                    value={
                      inputValues.find(
                        (inputValue) => inputValue.cardId === card.id,
                      )?.values.projectDesc || ''
                    }
                    onChange={(e) =>
                      handleChange(card.id, 'projectDesc', e.target.value)
                    }
                    required
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="From"
                      value={
                        inputValues.find(
                          (inputValue) => inputValue.cardId === card.id,
                        )?.values.startDate || startDate
                      }
                      maxDate={dayjs()}
                      onChange={(date) => {
                        handleChange(
                          card.id,
                          'startDate',
                          date
                            ? dayjs(date).format('YYYY-MM-DD')
                            : dayjs(startDate).format('YYYY-MM-DD'),
                        );
                        setStartDate(dayjs(date));
                      }}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Till"
                      value={
                        inputValues.find(
                          (inputValue) => inputValue.cardId === card.id,
                        )?.values.endDate || endDate
                      }
                      minDate={startDate}
                      maxDate={dayjs()}
                      onChange={(date) =>
                        handleChange(
                          card.id,
                          'endDate',
                          date
                            ? dayjs(date).format('YYYY-MM-DD')
                            : dayjs(endDate).format('YYYY-MM-DD'),
                        )
                      }
                    />
                  </LocalizationProvider>
                  <TextField
                    label="Project Link"
                    value={
                      inputValues.find(
                        (inputValue) => inputValue.cardId === card.id,
                      )?.values.projectLink || ''
                    }
                    onChange={(e) =>
                      handleChange(card.id, 'projectLink', e.target.value)
                    }
                  />
                </>
              )}
              <CardActions>
                <Button size="small" startIcon={<Add />} onClick={handleAdd}>
                  Add
                </Button>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(card.id)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DoneIcon />}
                  onClick={() => handleDone(card.id)}
                >
                  Done
                </Button>
                <Button
                  size="small"
                  disabled={cards.length === 1}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove(card.id)}
                >
                  Remove
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

export default Portfolio;
