import dayjs from 'dayjs';
import { List } from 'immutable';
import countries from 'iso-3166-1/dist/iso-3166';
import { create, enforce, test } from 'vest';

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
  Checkbox,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { showErrorToast } from '../../../../utils/toast';
import { useAppDataContext } from '../../../context/AppDataContext';
import Description from './Description';
import { onGoing } from './constants';
import { EducationInfoObj } from './types';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  onError: (isError: boolean) => void;
}
const Education: FC<Props> = ({ nextStep, prevStep, onError }) => {
  const { postAppData, patchAppData, deleteAppData, appDataArray } =
    useAppDataContext();

  const handlePost = (newdata: EducationInfoObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.EDUCATION_INFO });
  };
  const handlePatch = (id: AppData['id'], newData: EducationInfoObj): void => {
    patchAppData({ id, data: newData });
  };
  const handleDelete = (id: AppData['id']): void => {
    deleteAppData({ id });
  };
  const [educationCards, setEducationCards] =
    useState<List<AppData & { data: EducationInfoObj }>>();

  useEffect(() => {
    const educationData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.EDUCATION_INFO,
    ) as List<AppData & { data: EducationInfoObj }>;
    setEducationCards(educationData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const newCardId = `card${(educationCards?.size ?? 0) + 1}`;
    handlePost({
      id: newCardId,
      degree: '',
      institutionName: '',
      major: '',
      startDate: null,
      endDate: null,
      gpa: '',
      country: '',
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
  const suite = create((data) => {
    // Validation rules for each field
    test('degree', 'Degree is required', () => {
      enforce(data.degree).isNotEmpty();
    });

    test('institutionName', 'Institution Name is required', () => {
      enforce(data.institutionName).isNotEmpty();
    });

    test(
      'institutionName',
      'Institution Name must be at most 80 characters long',
      () => {
        enforce(data.institutionName).shorterThan(80);
      },
    );

    test('major', 'Major is required', () => {
      enforce(data.major).isNotEmpty();
    });

    test('major', 'Major must be at most 50 characters long', () => {
      enforce(data.major).shorterThan(50);
    });

    test('startDate', 'Start Date is required', () => {
      enforce(data.startDate).isNotEmpty();
    });

    test('endDate', 'End Date is required', () => {
      enforce(data.endDate).isNotEmpty();
    });

    test('country', 'Country is required', () => {
      enforce(data.country).isNotEmpty();
    });
  });
  const handleDone = (cardId: string): void => {
    const educationInfoCard = educationCards?.find(
      (card) => card.id === cardId,
    );
    if (educationInfoCard) {
      // Run the validation suite
      const result = suite(educationInfoCard.data);
      if (result.hasErrors()) {
        // Handle validation errors
        const updatedErrors = { ...errors };
        Object.keys(result.tests).forEach((fieldName) => {
          const fieldErrors = result.tests[fieldName].errors || [];
          if (fieldErrors.length > 0) {
            updatedErrors[`${cardId}-${fieldName}`] = fieldErrors[0] || '';
          }
        });
        onError(true);
        setErrors(updatedErrors);
      } else if (result.isValid()) {
        handlePatch(cardId, {
          ...educationInfoCard.data,
          saved: true,
        });
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
    setEducationCards((prevCards) => {
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
    onError(false);
  };

  const handlePrev = (): void => {
    prevStep();
  };
  const handleNext = (): void => {
    let isValid = true;
    // Check each card for unfilled required fields
    educationCards?.forEach((card) => {
      const result = suite(card.data);
      if (result.hasErrors()) {
        isValid = false;
        // Handle validation errors
        const updatedErrors = { ...errors };
        Object.keys(result.tests).forEach((fieldName) => {
          const fieldErrors = result.tests[fieldName].errors || [];
          if (fieldErrors.length > 0) {
            updatedErrors[`${card.id}-${fieldName}`] = fieldErrors[0] || '';
          }
        });
        setErrors(updatedErrors);
        setShowFields((prevShowFields) => ({
          ...prevShowFields,
          [card.id]: true,
        }));
      }
    });

    const allSaved = educationCards?.every((card) => card.data.saved);

    if (isValid && allSaved) {
      nextStep();
    } else if (!isValid && !allSaved) {
      showErrorToast(
        'Please save your progress by clicking on the Done button of the card you added',
      );
    } else {
      onError(true);
    }
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
  const title = 'Education and Training';
  const description =
    'Please fill the fields according to the following description. For this part you can add as many educations you would like to add, you can also remove any education you would like to remove from your application, modify the information by clicking on edit, fill up all the required fields, and when done editing just click on done button.';
  return (
    <Box>
      <Box>
        <Description title={title} description={description} />
        {educationCards?.map((card, index) => (
          <Card
            key={card.id}
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5">
                Education {index + 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click Edit to fill information you would like to provide and
                Done to save your progress.
              </Typography>
              {showFields[card.id] ? (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      {m.key === 'degree' && (
                        <TextField
                          id={m.key}
                          select
                          label={m.label}
                          value={card.data.degree}
                          onChange={(e) =>
                            handleChange(card.id, m.key, e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
                          error={!!errors[`${card.id}-${m.key}`]}
                          helperText={errors[`${card.id}-${m.key}`]}
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
                      {m.key === 'major' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.major || ''}
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
                                  required: true,
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
                                card.data.endDate &&
                                card.data.endDate !== onGoing
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
                                  required: true,
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
                      {m.key === 'gpa' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.gpa || ''}
                          onChange={(e) =>
                            handleChange(card.id, m.key, e.target.value)
                          }
                          fullWidth
                          margin="normal"
                        />
                      )}
                      {m.key === 'country' && (
                        <TextField
                          select
                          required
                          label={m.label}
                          value={card.data.country}
                          onChange={(e) =>
                            handleChange(card.id, m.key, e.target.value)
                          }
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
                    </Box>
                  ))}
                </>
              ) : (
                Object.entries(card.data as EducationInfoObj).map(
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

export default Education;
