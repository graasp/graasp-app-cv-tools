import dayjs from 'dayjs';
import countries from 'iso-3166-1/dist/iso-3166';

import { FC, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Button, Checkbox, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { CVInfoObj, EducationInfoObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  cvValues: CVInfoObj;
  onCvValuesChange: (newCvValues: CVInfoObj) => void;
}
const Education: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  cvValues,
  onCvValuesChange,
}) => {
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const [educationCards, setEducationCards] = useState<EducationInfoObj[]>([
    {
      id: 'card1',
      degree: '',
      institutionName: '',
      major: '',
      startDate: undefined,
      endDate: undefined,
      gpa: '',
      country: '',
    },
  ]);
  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const [isPresent, setIsPresent] = useState<{ [key: string]: boolean }>({});
  // const [isPresent, setIsPresent] = useState(false);
  const degrees = [
    { value: 'bachelor', label: 'Bachelor' },
    { value: 'master', label: 'Master' },
    { value: 'phd', label: 'PhD' },
  ];
  const countriesArr = countries.map((country) => ({
    value: country.alpha2,
    label: country.country,
  }));
  const handleAdd = (): void => {
    const newCardId = `card${educationCards.length + 1}`;
    setEducationCards((prevCards) => [
      ...prevCards,
      {
        id: newCardId,
        degree: '',
        institutionName: '',
        major: '',
        startDate: undefined,
        endDate: undefined,
        gpa: '',
        country: '',
      },
    ]);
    setShowFields((prevShowFields) => ({
      ...prevShowFields,
      [newCardId]: false,
    }));
    setIsPresent((prevShowFields) => ({
      ...prevShowFields,
      [newCardId]: false,
    }));
  };

  const { educationInfo } = cvValues;
  const handleEdit = (cardId: string): void => {
    setShowFields((prevShowFields) => ({
      ...prevShowFields,
      [cardId]: true,
    }));
  };
  const handleDone = (cardId: string): void => {
    setShowFields((prevShowFields) => {
      const updatedShowFields = { ...prevShowFields };
      updatedShowFields[cardId] = false;
      return updatedShowFields;
    });
    const updatedEducationInfo = [...educationInfo];
    const index = educationCards.findIndex((card) => card.id === cardId);
    updatedEducationInfo[index] = {
      ...updatedEducationInfo[index],
      ...educationCards[index],
    };

    const newCvValues: CVInfoObj = {
      ...cvValues,
      educationInfo: updatedEducationInfo,
    };

    onCvValuesChange(newCvValues);
  };

  const handleRemove = (cardId: string): void => {
    setEducationCards((prevCards) =>
      prevCards.filter((card) => card.id !== cardId),
    );
    setShowFields((prevShowFields) => {
      const updatedShowFields = { ...prevShowFields };
      delete updatedShowFields[cardId];
      return updatedShowFields;
    });
  };

  const handleChange = (cardId: string, key: string, value: string): void => {
    setEducationCards((prevCards) => {
      const index = educationCards.findIndex((card) => card.id === cardId);
      const updatedCards = [...prevCards];
      updatedCards[index] = {
        ...updatedCards[index],
        [key]: value,
      };
      return updatedCards;
    });
  };

  const handleNext = (): void => {
    nextPage();
    nextStep();
  };

  const mapping = [
    { key: 'degree', label: 'Degree' },
    { key: 'institutionName', label: 'Institution Name' },
    { key: 'major', label: 'Major' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'gpa', label: 'GPA' },
    { key: 'country', label: 'Country' },
  ];
  return (
    <Box>
      <Box>
        {educationCards.map((card) => (
          <Card key={card.id}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Education
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Education
              </Typography>
              {showFields[card.id] && (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      <Typography>{m.label}</Typography>
                      {m.key === 'degree' && (
                        <TextField
                          id="select-degree"
                          select
                          label="Degree"
                          value={card.degree}
                          onChange={(e) =>
                            handleChange(card.id, 'degree', e.target.value)
                          }
                          required
                          helperText="Please select your degree"
                          margin="normal"
                        >
                          {degrees.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                      {m.key === 'institutionName' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.institutionName || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'institutionName',
                              e.target.value,
                            )
                          }
                          required
                        />
                      )}
                      {m.key === 'major' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.major || ''}
                          onChange={(e) =>
                            handleChange(card.id, 'major', e.target.value)
                          }
                          required
                        />
                      )}
                      {m.key === 'startDate' && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="From"
                            value={
                              card.startDate ? dayjs(card.startDate) : undefined
                            }
                            maxDate={dayjs()}
                            onChange={(date) => {
                              const formattedDate = date
                                ? dayjs(date).format('YYYY-MM-DD')
                                : '';
                              handleChange(card.id, 'startDate', formattedDate);
                            }}
                          />
                        </LocalizationProvider>
                      )}
                      {m.key === 'endDate' && (
                        <Box display="flex" alignItems="center">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Till"
                              disabled={isPresent[card.id]}
                              minDate={dayjs(card.startDate)}
                              value={
                                card.endDate ? dayjs(card.endDate) : undefined
                              }
                              maxDate={dayjs()}
                              onChange={(date) => {
                                handleChange(
                                  card.id,
                                  'endDate',
                                  date ? dayjs(date).format('YYYY-MM-DD') : '',
                                );
                              }}
                            />
                          </LocalizationProvider>
                          <Typography marginLeft={1}>Present</Typography>
                          <Checkbox
                            checked={isPresent[card.id]}
                            onChange={() => {
                              setIsPresent((prevShowFields) => ({
                                ...prevShowFields,
                                [card.id]: true,
                              }));
                              // setIsPresent(e.target.checked);
                              handleChange(
                                card.id,
                                'endDate',
                                'OnGoing',
                                // dayjs().format('YYYY-MM-DD'),
                              );
                            }}
                          />
                        </Box>
                      )}
                      {m.key === 'gpa' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.gpa || ''}
                          onChange={(e) =>
                            handleChange(card.id, 'gpa', e.target.value)
                          }
                          required
                        />
                      )}
                      {m.key === 'country' && (
                        <TextField
                          id="select-country"
                          select
                          label="Country"
                          value={card.country}
                          onChange={(e) =>
                            handleChange(card.id, 'country', e.target.value)
                          }
                          required
                          helperText="Please select your country"
                          margin="normal"
                        >
                          {countriesArr.map((country) => (
                            <MenuItem key={country.value} value={country.value}>
                              {country.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </Box>
                  ))}
                </>
              )}
              <CardActions>
                <Button size="small" startIcon={<Add />} onClick={handleAdd}>
                  Add
                </Button>
                {showFields[card.id] ? (
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
                  disabled={educationCards.length === 1}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove(card.id)}
                >
                  Remove
                </Button>
              </CardActions>
            </CardContent>
          </Card>
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
        startIcon={<NavigateNextIcon />}
        onClick={handleNext}
      >
        Next
      </Button>
    </Box>
  );
};

export default Education;
