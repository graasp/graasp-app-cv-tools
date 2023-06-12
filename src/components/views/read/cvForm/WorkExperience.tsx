import dayjs from 'dayjs';
import countries from 'iso-3166-1/dist/iso-3166';

import { FC, useState } from 'react';

import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { CVInfoObj, WorkExperienceObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  cvValues: CVInfoObj;
  onCvValuesChange: (newCvValues: CVInfoObj) => void;
}
const WorkExperience: FC<Props> = ({
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
  const [workCards, setWorkCards] = useState<WorkExperienceObj[]>([
    {
      jobTitle: '',
      institutionName: '',
      startDate: dayjs(),
      endDate: dayjs(),
      country: '',
      jobDetails: '',
      keyAchievements: '',
    },
  ]);
  const [showFields, setShowFields] = useState<boolean[]>([false]);
  const countriesArr = countries.map((country) => ({
    value: country.alpha2,
    label: country.country,
  }));
  const handleAdd = (): void => {
    setWorkCards((prevCards) => [
      ...prevCards,
      {
        jobTitle: '',
        institutionName: '',
        startDate: dayjs(),
        endDate: dayjs(),
        country: '',
        jobDetails: '',
        keyAchievements: '',
      },
    ]);
    setShowFields((prevShowFields) => [...prevShowFields, false]);
  };
  const { workInfo } = cvValues;
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
    const updatedWorkInfo = [...workInfo];
    updatedWorkInfo[index] = {
      ...updatedWorkInfo[index],
      ...workCards[index],
    };

    const newCvValues: CVInfoObj = {
      ...cvValues,
      workInfo: updatedWorkInfo,
    };

    onCvValuesChange(newCvValues);
  };

  const handleRemove = (index: number): void => {
    setWorkCards((prevCards) => prevCards.filter((_, i) => i !== index));
    setShowFields((prevShowFields) =>
      prevShowFields.filter((_, i) => i !== index),
    );
  };
  const handleChange = (index: number, key: string, value: string): void => {
    setWorkCards((prevCards) => {
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
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'institutionName', label: 'Institution Name' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'country', label: 'Country' },
    { key: 'jobDetails', label: 'Job Details' },
    { key: 'keyAchievements', label: 'Key Achievements' },
  ];
  return (
    <Box>
      <Box>
        {workCards.map((card, index) => (
          <Card key={index}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Work Experience
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Work Experience
              </Typography>
              {showFields[index] && (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      <Typography>{m.label}</Typography>
                      {m.key === 'jobTitle' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.jobTitle || ''}
                          onChange={(e) =>
                            handleChange(index, 'jobTitle', e.target.value)
                          }
                          required
                        />
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
                      {m.key === 'jobDetails' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.jobDetails || ''}
                          onChange={(e) =>
                            handleChange(index, 'jobDetails', e.target.value)
                          }
                          required
                        />
                      )}
                      {m.key === 'keyAchievements' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.keyAchievements || ''}
                          onChange={(e) =>
                            handleChange(
                              index,
                              'keyAchievements',
                              e.target.value,
                            )
                          }
                          required
                        />
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
                  disabled={workCards.length === 1}
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

export default WorkExperience;
