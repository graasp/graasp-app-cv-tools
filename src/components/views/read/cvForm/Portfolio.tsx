import dayjs from 'dayjs';

import { FC, useEffect, useState } from 'react';

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

import { CVInfoObj, PortfolioObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  portfolioData: PortfolioObj[];
  cvValues: CVInfoObj;
  onCvValuesChange: (data: PortfolioObj[]) => void;
}
const Portfolio: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  cvValues,
  portfolioData,
  onCvValuesChange,
}) => {
  console.log(cvValues);
  const [portfolioCards, setPortfolioCards] = useState(portfolioData);

  useEffect(() => {
    setPortfolioCards(portfolioData);
  }, [portfolioData]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const [isPresent, setIsPresent] = useState<{ [key: string]: boolean }>({});

  const handleAdd = (): void => {
    const newCardId = `card${portfolioCards.length + 1}`;
    setPortfolioCards((prevCards) => [
      ...prevCards,
      {
        id: newCardId,
        projectTitle: '',
        projectDescription: '',
        startDate: undefined,
        endDate: undefined,
        projectLink: '',
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
  };

  const handleRemove = (cardId: string): void => {
    setPortfolioCards((prevCards) =>
      prevCards.filter((card) => card.id !== cardId),
    );
    setShowFields((prevShowFields) => {
      const updatedShowFields = { ...prevShowFields };
      delete updatedShowFields[cardId];
      return updatedShowFields;
    });
  };

  const handleChange = (cardId: string, key: string, value: string): void => {
    setPortfolioCards((prevCards) => {
      const updatedCards = prevCards.map((card) =>
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
    onCvValuesChange(portfolioCards);
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
        {portfolioCards.map((card) => (
          <Card key={card.id}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Project
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Project To Your Portfolio
              </Typography>
              {showFields[card.id] && (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      <Typography>{m.label}</Typography>
                      {m.key === 'projectTitle' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.projectTitle || ''}
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
                          value={card.projectDescription || ''}
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
                      {m.key === 'projectLink' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.projectLink || ''}
                          onChange={(e) =>
                            handleChange(card.id, 'projectLink', e.target.value)
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
                  disabled={portfolioCards.length === 1}
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

export default Portfolio;
