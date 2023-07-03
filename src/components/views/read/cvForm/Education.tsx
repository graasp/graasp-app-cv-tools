import dayjs from 'dayjs';
import { List } from 'immutable';
import countries from 'iso-3166-1/dist/iso-3166';

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
  Checkbox,
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
import { useAppDataContext } from '../../../context/AppDataContext';
import { EducationInfoObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
}
const Education: FC<Props> = ({ nextPage, prevPage, nextStep, prevStep }) => {
  const { postAppData, patchAppData, deleteAppData, appDataArray } =
    useAppDataContext();

  const handlePost = (newdata: EducationInfoObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.EDUCATION });
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
      (obj: AppData) => obj.type === APP_DATA_TYPES.EDUCATION,
    ) as List<AppData & { data: EducationInfoObj }>;
    setEducationCards(educationData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});

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
      startDate: undefined,
      endDate: undefined,
      gpa: '',
      country: '',
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
    const educationInfoCard = educationCards?.find(
      (card) => card.id === cardId,
    );
    if (educationInfoCard) {
      handlePatch(cardId, educationInfoCard.data);
    }

    setShowFields((prevShowFields) => {
      const updatedShowFields = { ...prevShowFields };
      updatedShowFields[cardId] = false;
      return updatedShowFields;
    });
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
  };
  const handlePrev = (): void => {
    prevPage();
    prevStep();
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
        <Typography sx={{ m: '0.5rem' }}>
          For this part you can add as many educations you would like to add,
          you can also remove any education you would like to remove from your
          application, modify the information by clicking on edit, fill up all
          the required fields, and when done editing just click on done button.
        </Typography>
        {educationCards?.map((card, index) => (
          <Card key={card.id}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Education {index + 1}
              </Typography>
              {/* <Typography variant="body2" color="text.secondary">
                Add A New Education
              </Typography> */}
              {showFields[card.id] ? (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      {m.key === 'degree' && (
                        <TextField
                          id="select-degree"
                          select
                          label={m.label}
                          value={card.data.degree}
                          onChange={(e) =>
                            handleChange(card.id, 'degree', e.target.value)
                          }
                          required
                          fullWidth
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
                          value={card.data.institutionName || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'institutionName',
                              e.target.value,
                            )
                          }
                          required
                          fullWidth
                          margin="normal"
                        />
                      )}
                      {m.key === 'major' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.major || ''}
                          onChange={(e) =>
                            handleChange(card.id, 'major', e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
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
                              slotProps={{ textField: { fullWidth: true } }}
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
                              disabled={card.data.endDate === 'OnGoing'}
                              minDate={dayjs(card.data.startDate)}
                              value={
                                card.data.endDate &&
                                card.data.endDate !== 'OnGoing'
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
                              slotProps={{ textField: { fullWidth: true } }}
                            />
                          </LocalizationProvider>
                          <Typography marginLeft={1}>Present</Typography>
                          <Checkbox
                            checked={card.data.endDate === 'OnGoing'}
                            onChange={() => {
                              handleChange(
                                card.id,
                                'endDate',
                                card.data.endDate === 'OnGoing'
                                  ? ''
                                  : 'OnGoing',
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
                            handleChange(card.id, 'gpa', e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
                        />
                      )}
                      {m.key === 'country' && (
                        <TextField
                          id="select-country"
                          select
                          label={m.label}
                          value={card.data.country}
                          onChange={(e) =>
                            handleChange(card.id, 'country', e.target.value)
                          }
                          required
                          fullWidth
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
              ) : (
                Object.entries(card.data as EducationInfoObj).map(
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
      <Box marginTop="16px" marginBottom="16px">
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

export default Education;
