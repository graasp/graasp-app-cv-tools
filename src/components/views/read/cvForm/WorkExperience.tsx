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

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { useAppDataContext } from '../../../context/AppDataContext';
import { SkillsObj, WorkExperienceObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
}
const WorkExperience: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
}) => {
  const { postAppData, patchAppData, deleteAppData, appDataArray } =
    useAppDataContext();

  const handlePost = (newdata: WorkExperienceObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.WORKEXPERIENCE });
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
      (obj: AppData) => obj.type === APP_DATA_TYPES.WORKEXPERIENCE,
    ) as List<AppData & { data: WorkExperienceObj }>;
    setWorkCards(workData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});

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
      startDate: undefined,
      endDate: undefined,
      country: '',
      jobDetails: '',
      keyAchievements: '',
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
    const workInfoCard = workCards?.find((card) => card.id === cardId);
    if (workInfoCard) {
      handlePatch(cardId, workInfoCard.data);
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
    setWorkCards((prevCards) => {
      const updatedCards = prevCards?.map((card) =>
        card.id === cardId
          ? { ...card, data: { ...card.data, [key]: value } }
          : card,
      );
      return updatedCards;
    });
  };
  const handleSkillsPost = (newdata: SkillsObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.SKILLS });
  };
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  let counter = 0;
  const handleNext = (): void => {
    if (counter === 0) {
      counter += 1;
      handleSkillsPost({ title: 'Tech Skills', skills: [] });
      handleSkillsPost({ title: 'Lang Skills', skills: [] });
      handleSkillsPost({ title: 'Other Skills', skills: [] });
    }
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
        <Typography sx={{ m: '0.5rem' }}>
          For this part you can add as many Jobs as you like, you can also
          remove any Job you would like to remove from your application, modify
          the information by clicking on edit, fill up all the required fields,
          and when done editing just click on done button.
        </Typography>
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
                            handleChange(card.id, 'jobTitle', e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
                        />
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
                              slotProps={{ textField: { fullWidth: true } }}
                            />
                          </LocalizationProvider>
                          <Typography marginLeft={1}>Present</Typography>
                          <Checkbox
                            checked={card.data.present}
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
                      {m.key === 'jobDetails' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.jobDetails || ''}
                          onChange={(e) =>
                            handleChange(card.id, 'jobDetails', e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
                        />
                      )}
                      {m.key === 'keyAchievements' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.keyAchievements || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'keyAchievements',
                              e.target.value,
                            )
                          }
                          required
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

export default WorkExperience;
