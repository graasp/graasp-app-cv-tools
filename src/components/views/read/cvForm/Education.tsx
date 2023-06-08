import dayjs, { Dayjs } from 'dayjs';

import { FC, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Button, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Import the default theme styles
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
const Education: FC<Props> = ({
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
  const [inputValuesSecondary, setInputValuesSecondary] = useState<
    { [key: string]: string }[]
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
        console.log(inputValue);
        return inputValue;
      });
    });
  };

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2022-04-17'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs('2022-04-18'));
  const mapping = [
    { key: 'degree', label: 'Degree' },
    { key: 'institutionName', label: 'Institution Name' },
    { key: 'major', label: 'Major' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'gpa', label: 'GPA' },
    { key: 'country', label: 'Country' },
  ];
  const handleNext = (): void => {
    const modifiedValues = cards.map((card) => {
      const cardInputValues = inputValues.find(
        (inputValue) => inputValue.cardId === card.id,
      );

      return {
        Degree: cardInputValues?.values.degree || '',
        'Institution Name': cardInputValues?.values.instName || '',
        Major: cardInputValues?.values.major || '',
        'Start Date': cardInputValues?.values.startDate || '',
        'End Date': cardInputValues?.values.endDate || '',
        GPA: cardInputValues?.values.gpa || '',
        Country: cardInputValues?.values.country || '',
      };
    });

    handleValues('Education', modifiedValues);
    nextPage();
    nextStep();
  };
  const handleChangeSecondary = (field: string, value: string): void => {
    setInputValuesSecondary((prevInputValues) => {
      const updatedInputValues = [...prevInputValues];
      const fieldValue = { [field]: value };
      const existingFieldIndex = updatedInputValues.findIndex(
        (inputValue) => Object.keys(inputValue)[0] === field,
      );
      if (existingFieldIndex !== -1) {
        // Field already exists, update its value
        updatedInputValues[existingFieldIndex] = fieldValue;
      } else {
        // Field doesn't exist, add it to the input values
        updatedInputValues.push(fieldValue);
      }
      console.log(updatedInputValues);
      return updatedInputValues;
    });
  };
  return (
    <div>
      <h2>Education</h2>
      <div>
        {cards.map((card, index) => (
          <Card key={card.id}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Education
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Education
              </Typography>
              {showFields[index] && (
                <>
                  {mapping.map((m) => (
                    <>
                      <p>{m.label}</p>
                      {m.key !== 'degree' &&
                      m.key !== 'startDate' &&
                      m.key !== 'endDate' &&
                      m.key !== 'country' ? (
                        <TextField
                          label={m.label}
                          id={m.key}
                          value={
                            inputValues.find(
                              (inputValue) => inputValue.cardId === card.id,
                            )?.values[m.key] || ''
                          }
                          onChange={(e) =>
                            handleChange(card.id, m.key, e.target.value)
                          }
                          required
                        />
                      ) : (
                        <>
                          {m.key === 'degree' && (
                            <TextField
                              id="select-degree"
                              select
                              label="Degree"
                              value={
                                inputValues.find(
                                  (inputValue) => inputValue.cardId === card.id,
                                )?.values.degree || ''
                                // inputValuesSecondary.find(
                                //   (inputValue) =>
                                //     Object.keys(inputValue)[0] === 'degree',
                                // )?.degree || ''
                              }
                              onChange={(e) =>
                                handleChange(card.id, 'degree', e.target.value)
                              }
                              required
                              helperText="Please select your degree"
                              margin="normal"
                            >
                              <MenuItem value="bachelor">Bachelor</MenuItem>
                              <MenuItem value="master">Master</MenuItem>
                              <MenuItem value="phd">PhD</MenuItem>
                            </TextField>
                          )}
                          {m.key === 'startDate' && (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="From"
                                value={
                                  // startDate
                                  inputValues.find(
                                    (inputValue) =>
                                      inputValue.cardId === card.id,
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
                          )}
                          {m.key === 'endDate' && (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Till"
                                value={
                                  // endDate
                                  inputValues.find(
                                    (inputValue) =>
                                      inputValue.cardId === card.id,
                                  )?.values.endDate || endDate
                                }
                                minDate={startDate}
                                maxDate={dayjs()}
                                onChange={(date) => {
                                  handleChange(
                                    card.id,
                                    'endDate',
                                    date
                                      ? dayjs(date).format('YYYY-MM-DD')
                                      : dayjs(endDate).format('YYYY-MM-DD'),
                                  );
                                  setEndDate(dayjs(date));
                                }}
                              />
                            </LocalizationProvider>
                          )}
                          {m.key === 'country' && (
                            <TextField
                              id="select-country"
                              select
                              label="Country"
                              value={
                                inputValues.find(
                                  (inputValue) => inputValue.cardId === card.id,
                                )?.values.country || ''
                                // inputValuesSecondary.find(
                                //   (inputValue) =>
                                //     Object.keys(inputValue)[0] === 'country',
                                // )?.country || ''
                              }
                              onChange={(e) =>
                                handleChange(card.id, 'country', e.target.value)
                              }
                              required
                              helperText="Please select your country"
                              margin="normal"
                            >
                              <MenuItem value="Switzerland">
                                Switzerland
                              </MenuItem>
                              <MenuItem value="Europe">Europe</MenuItem>
                              <MenuItem value="Asia">Asia</MenuItem>
                              <MenuItem value="Africa">Africa</MenuItem>
                              <MenuItem value="North America">
                                North America
                              </MenuItem>
                              <MenuItem value="South America">
                                South America
                              </MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                          )}
                        </>
                      )}
                    </>
                  ))}
                </>
              )}{' '}
              <CardActions>
                <Button size="small" startIcon={<Add />} onClick={handleAdd}>
                  Add
                </Button>
                {showFields[index] ? (
                  <Button
                    size="small"
                    startIcon={<DoneIcon />}
                    onClick={() => handleDone(card.id)}
                  >
                    Done
                  </Button>
                ) : (
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(card.id)}
                  >
                    Edit
                  </Button>
                )}
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
        startIcon={<NavigateNextIcon />}
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Education;
