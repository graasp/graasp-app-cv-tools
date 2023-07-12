import dayjs from 'dayjs';
import { List } from 'immutable';
import countries from 'iso-3166-1/dist/iso-3166';

import { FC, useEffect, useState } from 'react';

import { AppData } from '@graasp/apps-query-client';

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
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { showErrorToast } from '../../../../utils/toast';
import { useAppDataContext } from '../../../context/AppDataContext';
import Description from './Description';
import { onGoing } from './constants';
import { SkillsObj, WorkExperienceObj } from './types';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}
const WorkExperience: FC<Props> = ({ nextStep, prevStep }) => {
  const { postAppData, patchAppData, deleteAppData, appDataArray } =
    useAppDataContext();

  const handlePost = (newdata: WorkExperienceObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.WORK_EXPERIENCE_INFO });
  };
  const handlePatch = (id: AppData['id'], newData: WorkExperienceObj): void => {
    patchAppData({ id, data: newData });
  };
  const handleDelete = (id: AppData['id']): void => {
    deleteAppData({ id });
  };
  const [workCards, setWorkCards] =
    useState<List<AppData & { data: WorkExperienceObj }>>();

  useEffect(() => {
    const workData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.WORK_EXPERIENCE_INFO,
    ) as List<AppData & { data: WorkExperienceObj }>;
    setWorkCards(workData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const countriesArr = countries.map((country) => ({
    value: country.alpha2,
    label: country.country,
  }));

  const handleAdd = (): void => {
    const newCardId = `card${(workCards?.size ?? 0) + 1}`;
    handlePost({
      id: newCardId,
      jobTitle: '',
      institutionName: '',
      startDate: null,
      endDate: null,
      country: '',
      jobDetails: '',
      keyAchievements: '',
      saved: false,
    });
    setShowFields((prevShowFields) => ({
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
    const workInfoCard = workCards?.find((card) => card.id === cardId);
    if (workInfoCard) {
      let isValid = true;
      const updatedErrors = { ...errors };

      if (!workInfoCard.data.jobTitle.trim()) {
        updatedErrors[`${cardId}-jobTitle`] = 'Job Title is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-jobTitle`] = '';
      }

      if (!workInfoCard.data.institutionName.trim()) {
        updatedErrors[`${cardId}-institutionName`] =
          'Institution Name is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-institutionName`] = '';
      }

      if (!workInfoCard.data.startDate?.trim()) {
        updatedErrors[`${cardId}-startDate`] = 'Start Date is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-startDate`] = '';
      }

      if (!workInfoCard.data.endDate?.trim()) {
        updatedErrors[`${cardId}-endDate`] = 'End Date is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-endDate`] = '';
      }

      if (!workInfoCard.data.country.trim()) {
        updatedErrors[`${cardId}-country`] = 'Country is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-country`] = '';
      }

      if (!workInfoCard.data.jobDetails.trim()) {
        updatedErrors[`${cardId}-jobDetails`] = 'Job Details is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-jobDetails`] = '';
      }

      setErrors(updatedErrors);

      if (isValid) {
        handlePatch(cardId, { ...workInfoCard.data, saved: true });
        setShowFields((prevShowFields) => {
          const updatedShowFields = { ...prevShowFields };
          updatedShowFields[cardId] = false;
          return updatedShowFields;
        });
      }
    }
  };

  const handleRemove = (cardId: string): void => {
    handleDelete(cardId);

    setShowFields((prevShowFields) => {
      const updatedShowFields = { ...prevShowFields };
      delete updatedShowFields[cardId];
      return updatedShowFields;
    });
  };

  const handleChange = (
    cardId: string,
    key: string,
    value: string | boolean,
  ): void => {
    setWorkCards((prevCards) => {
      const updatedCards = prevCards?.map((card) =>
        card.id === cardId
          ? { ...card, data: { ...card.data, [key]: value } }
          : card,
      );
      return updatedCards;
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${cardId}-${key}`]: '',
    }));
  };
  const handleSkillsPost = (newdata: SkillsObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.SKILLS_INFO });
  };
  const handlePrev = (): void => {
    prevStep();
  };

  const handleNext = (): void => {
    const skillsData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.SKILLS_INFO,
    );

    let isValid = true;
    const updatedErrors = { ...errors };

    // Check each card for unfilled required fields
    workCards?.forEach((card) => {
      if (!card.data.jobTitle.trim()) {
        updatedErrors[`${card.id}-jobTitle`] = 'Job Title is required';
        isValid = false;
      } else {
        updatedErrors[`${card.id}-jobTitle`] = '';
      }

      if (!card.data.institutionName.trim()) {
        updatedErrors[`${card.id}-institutionName`] =
          'Institution Name is required';
        isValid = false;
      } else {
        updatedErrors[`${card.id}-institutionName`] = '';
      }

      if (!card.data.startDate?.trim()) {
        updatedErrors[`${card.id}-startDate`] = 'Start Date is required';
        isValid = false;
      } else {
        updatedErrors[`${card.id}-startDate`] = '';
      }
      if (!card.data.endDate?.trim()) {
        updatedErrors[`${card.id}-endDate`] = 'End Date is required';
        isValid = false;
      } else {
        updatedErrors[`${card.id}-endDate`] = '';
      }

      if (!card.data.country.trim()) {
        updatedErrors[`${card.id}-country`] = 'Country is required';
        isValid = false;
      } else {
        updatedErrors[`${card.id}-country`] = '';
      }

      if (!card.data.jobDetails.trim()) {
        updatedErrors[`${card.id}-jobDetails`] = 'Job Details is required';
        isValid = false;
      } else {
        updatedErrors[`${card.id}-jobDetails`] = '';
      }

      // Check if the card has any unfilled required fields
      if (!isValid) {
        setShowFields((prevShowFields) => ({
          ...prevShowFields,
          [card.id]: true,
        }));
      }
    });

    setErrors(updatedErrors);

    const allSaved = workCards?.every((card) => card.data.saved);

    if (isValid && allSaved) {
      if (skillsData.size === 0) {
        handleSkillsPost({ title: 'Tech Skills', skills: [] });
        handleSkillsPost({ title: 'Lang Skills', skills: [] });
        handleSkillsPost({ title: 'Other Skills', skills: [] });
      }
      nextStep();
    } else if (isValid && !allSaved) {
      showErrorToast(
        'Please save your progress by clicking on the Done button of the card you added',
      );
    }
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
  const title = 'Work Exerpience';
  const description =
    'For this part you can add as many Experiences as you like, you can also remove any Experience you would like to remove from your application, modify the information by clicking on edit, fill up all the required fields, and when done editing just click on done button.';
  return (
    <Box>
      <Box>
        <Description title={title} description={description} />
        {workCards?.map((card, index) => (
          <Card
            key={card.id}
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5">
                Work Experience {index + 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click Edit to fill information you would like to provide and
                Done to save your progress.
              </Typography>
              {showFields[card.id] ? (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      {m.key === 'jobTitle' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.jobTitle || ''}
                          onChange={(e) =>
                            handleChange(card.id, m.key, e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
                          error={!!errors[`${card.id}-${m.key}`]}
                          helperText={errors[`${card.id}-${m.key}`]}
                        />
                      )}
                      {m.key === 'institutionName' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.institutionName || ''}
                          onChange={(e) =>
                            handleChange(card.id, m.key, e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
                          error={!!errors[`${card.id}-${m.key}`]}
                          helperText={errors[`${card.id}-${m.key}`]}
                        />
                      )}
                      {m.key === 'startDate' && (
                        <Box marginTop="16px" marginBottom="16px">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="From"
                              value={
                                card.data.startDate
                                  ? dayjs(card.data.startDate)
                                  : null
                              }
                              maxDate={dayjs()}
                              onChange={(date) => {
                                const formattedDate = date
                                  ? dayjs(date).format('YYYY-MM-DD')
                                  : '';
                                handleChange(card.id, m.key, formattedDate);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!errors[`${card.id}-${m.key}`],
                                  helperText: errors[`${card.id}-${m.key}`],
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Box>
                      )}
                      {m.key === 'endDate' && (
                        <Box
                          display="flex"
                          alignItems="center"
                          marginTop="16px"
                          marginBottom="16px"
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Till"
                              disabled={card.data.endDate === onGoing}
                              minDate={dayjs(card.data.startDate)}
                              value={
                                card.data.endDate
                                  ? dayjs(card.data.endDate)
                                  : null
                              }
                              maxDate={dayjs()}
                              onChange={(date) => {
                                handleChange(
                                  card.id,
                                  m.key,
                                  date ? dayjs(date).format('YYYY-MM-DD') : '',
                                );
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!errors[`${card.id}-${m.key}`],
                                  helperText: errors[`${card.id}-${m.key}`],
                                },
                              }}
                            />
                          </LocalizationProvider>
                          <Typography marginLeft={1}>Present</Typography>
                          <Checkbox
                            checked={card.data.endDate === onGoing}
                            onChange={() => {
                              handleChange(
                                card.id,
                                m.key,
                                card.data.endDate === onGoing ? '' : onGoing,
                              );
                            }}
                          />
                        </Box>
                      )}
                      {m.key === 'country' && (
                        <TextField
                          select
                          label={m.label}
                          value={card.data.country}
                          onChange={(e) =>
                            handleChange(card.id, m.key, e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
                          error={!!errors[`${card.id}-${m.key}`]}
                          helperText={errors[`${card.id}-${m.key}`]}
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
                          value={card.data.jobDetails || ''}
                          onChange={(e) =>
                            handleChange(card.id, m.key, e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
                          error={!!errors[`${card.id}-${m.key}`]}
                          helperText={errors[`${card.id}-${m.key}`]}
                        />
                      )}
                      {m.key === 'keyAchievements' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.keyAchievements || ''}
                          onChange={(e) =>
                            handleChange(card.id, m.key, e.target.value)
                          }
                          fullWidth
                          margin="normal"
                        />
                      )}
                    </Box>
                  ))}
                </>
              ) : (
                Object.entries(card.data as WorkExperienceObj).map(
                  ([key, value]) => {
                    if (
                      value !== '' &&
                      typeof value !== 'undefined' &&
                      value !== null &&
                      mapping.some((item) => item.key === key)
                    ) {
                      return (
                        <Box key={key}>
                          <Typography variant="subtitle2">
                            {key}: {value}
                          </Typography>
                        </Box>
                      );
                    }
                    return null;
                  },
                )
              )}
              <CardActions>
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
      <Box marginTop="16px" marginBottom="16px">
        <Button size="small" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>
      <Stack justifyContent="space-between" marginBottom="16px" direction="row">
        <Button
          variant="contained"
          color="primary"
          startIcon={<NavigateBeforeIcon />}
          onClick={handlePrev}
          style={{ alignSelf: 'flex-start' }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<NavigateNextIcon />}
          onClick={handleNext}
          style={{ alignSelf: 'flex-end' }}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default WorkExperience;
