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
import { Box, Button, TextField, Typography } from '@mui/material';
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
      degree: '',
      institutionName: '',
      major: '',
      startDate: dayjs(),
      endDate: dayjs(),
      gpa: '',
      country: '',
    },
  ]);
  const [showFields, setShowFields] = useState<boolean[]>([false]);
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
    setEducationCards((prevCards) => [
      ...prevCards,
      {
        degree: '',
        institutionName: '',
        major: '',
        startDate: dayjs(),
        endDate: dayjs(),
        gpa: '',
        country: '',
      },
    ]);
    setShowFields((prevShowFields) => [...prevShowFields, false]);
  };
  const { educationInfo } = cvValues;
  const handleEdit = (index: number): void => {
    setShowFields((prevShowFields) => {
      const updatedShowFields = [...prevShowFields];
      updatedShowFields[index] = true;
      return updatedShowFields;
    });
  };

  const handleDone = (index: number): void => {
    setShowFields((prevShowFields) => {
      const updatedShowFields = [...prevShowFields];
      updatedShowFields[index] = false;
      return updatedShowFields;
    });
    const updatedEducationInfo = [...educationInfo];
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

  const handleRemove = (index: number): void => {
    setEducationCards((prevCards) => prevCards.filter((_, i) => i !== index));
    setShowFields((prevShowFields) =>
      prevShowFields.filter((_, i) => i !== index),
    );
  };
  const handleChange = (index: number, key: string, value: string): void => {
    setEducationCards((prevCards) => {
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
        {educationCards.map((card, index) => (
          <Card key={index}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Education
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Education
              </Typography>
              {showFields[index] && (
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
                            handleChange(index, 'degree', e.target.value)
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
                              index,
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
                            handleChange(index, 'major', e.target.value)
                          }
                          required
                        />
                      )}
                      {m.key === 'startDate' && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="From"
                            value={card.startDate}
                            maxDate={dayjs()}
                            onChange={(date) =>
                              handleChange(
                                index,
                                'startDate',
                                date ? dayjs(date).format('YYYY-MM-DD') : '',
                              )
                            }
                          />
                        </LocalizationProvider>
                      )}
                      {m.key === 'endDate' && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Till"
                            value={card.endDate}
                            minDate={card.startDate}
                            maxDate={dayjs()}
                            onChange={(date) =>
                              handleChange(
                                index,
                                'endDate',
                                date ? dayjs(date).format('YYYY-MM-DD') : '',
                              )
                            }
                          />
                        </LocalizationProvider>
                      )}
                      {m.key === 'gpa' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.gpa || ''}
                          onChange={(e) =>
                            handleChange(index, 'gpa', e.target.value)
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
                            handleChange(index, 'country', e.target.value)
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
                {showFields[index] ? (
                  <Button
                    size="small"
                    startIcon={<DoneIcon />}
                    onClick={() => handleDone(index)}
                  >
                    Done
                  </Button>
                ) : (
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  size="small"
                  disabled={educationCards.length === 1}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove(index)}
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
