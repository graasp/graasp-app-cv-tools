import dayjs from 'dayjs';
import { List } from 'immutable';

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
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { useAppDataContext } from '../../../context/AppDataContext';
import { MotivationObj, PortfolioObj } from './types';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}
const Portfolio: FC<Props> = ({ nextStep, prevStep }) => {
  const { postAppData, patchAppData, deleteAppData, appDataArray } =
    useAppDataContext();

  const handlePost = (newdata: PortfolioObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.PORTFOLIO });
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
      (obj: AppData) => obj.type === APP_DATA_TYPES.PORTFOLIO,
    ) as List<AppData & { data: PortfolioObj }>;
    setPortfolioCards(portfolioData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saved, setSaved] = useState(false);

  const handleAdd = (): void => {
    const newCardId = `card${(portfolioCards?.size ?? 0) + 1}`;
    handlePost({
      id: newCardId,
      projectTitle: '',
      projectDescription: '',
      startDate: undefined,
      endDate: undefined,
      projectLink: '',
      present: false,
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
    const portfolioCard = portfolioCards?.find((card) => card.id === cardId);
    if (portfolioCard) {
      let isValid = true;
      const updatedErrors = { ...errors };

      if (!portfolioCard.data.projectTitle.trim()) {
        updatedErrors[`${cardId}-projectTitle`] = 'Project Title is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-projectTitle`] = '';
      }

      if (!portfolioCard.data.projectDescription.trim()) {
        updatedErrors[`${cardId}-projectDescription`] =
          'Project Description is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-projectDescription`] = '';
      }

      if (!portfolioCard.data.startDate?.trim()) {
        updatedErrors[`${cardId}-startDate`] = 'Start Date is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-startDate`] = '';
      }

      if (!portfolioCard.data.endDate?.trim()) {
        updatedErrors[`${cardId}-endDate`] = 'End Date is required';
        isValid = false;
      } else {
        updatedErrors[`${cardId}-endDate`] = '';
      }

      setErrors(updatedErrors);

      if (isValid) {
        setSaved(true);
        handlePatch(cardId, portfolioCard.data);
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
  };

  const handleMotivationPost = (newdata: MotivationObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.MOTIVATION });
  };
  const handlePrev = (): void => {
    prevStep();
  };
  const handleNext = (): void => {
    const motivationData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.MOTIVATION,
    );

    let isValid = true;
    const updatedErrors = { ...errors };

    // Check each card for unfilled required fields
    portfolioCards?.forEach((card) => {
      if (!card.data.projectTitle.trim()) {
        updatedErrors[`${card.id}-projectTitle`] = 'Project Title is required';
        isValid = false;
      } else {
        updatedErrors[`${card.id}-projectTitle`] = '';
      }

      if (!card.data.projectDescription.trim()) {
        updatedErrors[`${card.id}-projectDescription`] =
          'Project Description is required';
        isValid = false;
      } else {
        updatedErrors[`${card.id}-projectDescription`] = '';
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

      // Check if the card has any unfilled required fields
      if (!isValid) {
        setShowFields((prevShowFields) => ({
          ...prevShowFields,
          [card.id]: true,
        }));
      }
    });

    setErrors(updatedErrors);

    if (isValid && saved) {
      if (motivationData.size === 0) {
        handleMotivationPost({
          motivationLetter: '',
        });
      }
      nextStep();
    } else if (!saved && isValid) {
      console.error(
        'Please save your progress by clicking on Done button of the card you added',
      );
    }
  };
  const mapping = [
    { key: 'projectTitle', label: 'Project Title' },
    { key: 'projectDescription', label: 'Project Description' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'projectLink', label: 'Project Link' },
  ];
  return (
    <Box>
      <Box>
        <Typography variant="h4">Portfolio</Typography>
        <Typography sx={{ m: '0.5rem' }}>
          For this part you can add as many Projects as you like and done, you
          can also remove any Project you would like to remove from your
          application, modify the information by clicking on edit, fill up all
          the required fields, and when done editing just click on done button.
        </Typography>
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
                            handleChange(
                              card.id,
                              'projectTitle',
                              e.target.value,
                            )
                          }
                          required
                          fullWidth
                          margin="normal"
                          error={!!errors[`${card.id}-projectTitle`]}
                          helperText={errors[`${card.id}-projectTitle`]}
                        />
                      )}
                      {m.key === 'projectDescription' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.projectDescription || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'projectDescription',
                              e.target.value,
                            )
                          }
                          required
                          fullWidth
                          margin="normal"
                          error={!!errors[`${card.id}-projectDescription`]}
                          helperText={errors[`${card.id}-projectDescription`]}
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
                                  : undefined
                              }
                              maxDate={dayjs()}
                              onChange={(date) => {
                                const formattedDate = date
                                  ? dayjs(date).format('YYYY-MM-DD')
                                  : '';
                                handleChange(
                                  card.id,
                                  'startDate',
                                  formattedDate,
                                );
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!errors[`${card.id}-startDate`],
                                  helperText: errors[`${card.id}-startDate`],
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
                              disabled={card.data.present}
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
                                  'endDate',
                                  date ? dayjs(date).format('YYYY-MM-DD') : '',
                                );
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!errors[`${card.id}-endDate`],
                                  helperText: errors[`${card.id}-endDate`],
                                },
                              }}
                            />
                          </LocalizationProvider>
                          <Typography marginLeft={1}>Present</Typography>
                          <Checkbox
                            checked={card.data.present}
                            onChange={() => {
                              handleChange(
                                card.id,
                                'present',
                                !card.data.present,
                              );
                              handleChange(card.id, 'endDate', 'OnGoing');
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
                            handleChange(card.id, 'projectLink', e.target.value)
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
      <ButtonGroup
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
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
      </ButtonGroup>
    </Box>
  );
};

export default Portfolio;
