import dayjs from 'dayjs';
import { List } from 'immutable';
import { create, enforce, test } from 'vest';

import { FC, useEffect, useState } from 'react';

import { AppData } from '@graasp/apps-query-client/dist/types';

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
import { MotivationObj, PortfolioObj } from './types';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  onError: (isError: boolean) => void;
}
const Portfolio: FC<Props> = ({ nextStep, prevStep, onError }) => {
  const { postAppData, patchAppData, deleteAppData, appDataArray } =
    useAppDataContext();

  const handlePost = (newdata: PortfolioObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.PROJECTS_INFO });
  };
  const handlePatch = (id: AppData['id'], newData: PortfolioObj): void => {
    patchAppData({ id, data: newData });
  };
  const handleDelete = (id: AppData['id']): void => {
    deleteAppData({ id });
  };
  const [portfolioCards, setPortfolioCards] =
    useState<List<AppData & { data: PortfolioObj }>>();

  useEffect(() => {
    const portfolioData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.PROJECTS_INFO,
    ) as List<AppData & { data: PortfolioObj }>;
    setPortfolioCards(portfolioData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAdd = (): void => {
    const newCardId = `card${(portfolioCards?.size ?? 0) + 1}`;
    handlePost({
      id: newCardId,
      projectTitle: '',
      projectDescription: '',
      startDate: null,
      endDate: null,
      projectLink: '',
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
    test('projectTitle', 'Project Title is required', () => {
      enforce(data.projectTitle).isNotEmpty();
    });

    test('projectTitle', 'Project Title be at most 100 characters long', () => {
      enforce(data.projectTitle).shorterThan(100);
    });

    test('projectDescription', 'Project Description is required', () => {
      enforce(data.projectDescription).isNotEmpty();
    });

    test(
      'projectDescription',
      'Project Description must be at most 500 characters long',
      () => {
        enforce(data.projectDescription).shorterThan(500);
      },
    );

    test('startDate', 'Start Date is required', () => {
      enforce(data.startDate).isNotEmpty();
    });

    test('endDate', 'End Date is required', () => {
      enforce(data.endDate).isNotEmpty();
    });
  });

  const handleDone = (cardId: string): void => {
    const portfolioCard = portfolioCards?.find((card) => card.id === cardId);
    if (portfolioCard) {
      // Run the validation suite
      const result = suite(portfolioCard.data);
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
          ...portfolioCard.data,
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
    setPortfolioCards((prevCards) => {
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

  const handleMotivationPost = (newdata: MotivationObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.MOTIVATION_INFO });
  };
  const handlePrev = (): void => {
    prevStep();
  };
  const handleNext = (): void => {
    const motivationData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.MOTIVATION_INFO,
    );

    let isValid = true;
    // Check each card for unfilled required fields
    portfolioCards?.forEach((card) => {
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

    const allSaved = portfolioCards?.every((card) => card.data.saved);

    if (isValid && allSaved) {
      if (motivationData.size === 0) {
        handleMotivationPost({
          motivationLetter: '',
          saved: false,
        });
      }
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
    { key: 'projectTitle', label: 'Project Title' },
    { key: 'projectDescription', label: 'Project Description' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'projectLink', label: 'Project Link' },
  ];
  const title = 'Projects';
  const description =
    'Please fill the fields according to the following description. For this part you can add as many Projects as you like and done, you can also remove any Project you would like to remove from your application, modify the information by clicking on edit, fill up all the required fields, and when done editing just click on done button.';
  return (
    <Box>
      <Box>
        <Description title={title} description={description} />
        {portfolioCards?.map((card, index) => (
          <Card
            key={card.id}
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5">
                Project {index + 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click Edit to fill information you would like to provide and
                Done to save your progress.
              </Typography>
              {showFields[card.id] ? (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      {m.key === 'projectTitle' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.projectTitle || ''}
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
                      {m.key === 'projectDescription' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.projectDescription || ''}
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
                                'present',
                                !card.data.present,
                              );
                              handleChange(card.id, m.key, onGoing);
                            }}
                          />
                        </Box>
                      )}
                      {m.key === 'projectLink' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.projectLink || ''}
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
                Object.entries(card.data as PortfolioObj).map(
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
      <Box>
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

export default Portfolio;
