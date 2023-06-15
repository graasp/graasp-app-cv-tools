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
  Checkbox,
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
  workData: WorkExperienceObj[];
  onCvValuesChange: (
    subkey: string,
    newSubkeyValues: Partial<CVInfoObj>,
  ) => void;
}
const WorkExperience: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  workData,
  onCvValuesChange,
}) => {
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const [workCards, setWorkCards] = useState<WorkExperienceObj[]>([
    {
      id: 'card1',
      jobTitle: '',
      institutionName: '',
      startDate: undefined,
      endDate: undefined,
      country: '',
      jobDetails: '',
      keyAchievements: '',
    },
  ]);
  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const [isPresent, setIsPresent] = useState<{ [key: string]: boolean }>({});
  const countriesArr = countries.map((country) => ({
    value: country.alpha2,
    label: country.country,
  }));
  const handleAdd = (): void => {
    const newCardId = `card${workCards.length + 1}`;
    setWorkCards((prevCards) => [
      ...prevCards,
      {
        id: newCardId,
        jobTitle: '',
        institutionName: '',
        startDate: undefined,
        endDate: undefined,
        country: '',
        jobDetails: '',
        keyAchievements: '',
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

    const updatedWorkInfo: WorkExperienceObj[] = [...workData];
    const index = workCards.findIndex((card) => card.id === cardId);
    updatedWorkInfo[index] = {
      ...updatedWorkInfo[index],
      ...workCards[index],
    };
    onCvValuesChange('workInfo', updatedWorkInfo);
  };

  const handleRemove = (cardId: string): void => {
    setWorkCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    setShowFields((prevShowFields) => {
      const updatedShowFields = { ...prevShowFields };
      delete updatedShowFields[cardId];
      return updatedShowFields;
    });
  };

  const handleChange = (cardId: string, key: string, value: string): void => {
    setWorkCards((prevCards) => {
      const index = workCards.findIndex((card) => card.id === cardId);
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
        {workCards.map((card) => (
          <Card key={card.id}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Work Experience
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Work Experience
              </Typography>
              {showFields[card.id] && (
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
                            handleChange(card.id, 'jobTitle', e.target.value)
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
                              card.id,
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
                      {m.key === 'jobDetails' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.jobDetails || ''}
                          onChange={(e) =>
                            handleChange(card.id, 'jobDetails', e.target.value)
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
                              card.id,
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
                  disabled={workCards.length === 1}
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

export default WorkExperience;
