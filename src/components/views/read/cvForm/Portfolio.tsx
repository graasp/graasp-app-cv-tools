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
import { PortfolioObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
}
const Portfolio: FC<Props> = ({ nextPage, prevPage, nextStep, prevStep }) => {
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
      handlePatch(cardId, portfolioCard.data);
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
    setPortfolioCards((prevCards) => {
      const updatedCards = prevCards?.map((card) =>
        card.id === cardId ? { ...card, [key]: value } : card,
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
    { key: 'projectTitle', label: 'Project Title' },
    { key: 'projectDescription', label: 'Project Description' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'projectLink', label: 'Project Link' },
  ];
  return (
    <Box>
      <Box>
        {portfolioCards?.map((card) => (
          <Card key={card.id}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Project
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Project To Your Portfolio
              </Typography>
              {showFields[card.id] ? (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      <Typography>{m.label}</Typography>
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
                        />
                      )}
                      {m.key === 'startDate' && (
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
                          required
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

export default Portfolio;
