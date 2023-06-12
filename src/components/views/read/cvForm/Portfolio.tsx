import dayjs from 'dayjs';

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
  cvValues: CVInfoObj;
  onCvValuesChange: (newCvValues: CVInfoObj) => void;
}
const Portfolio: FC<Props> = ({
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
  const [portfolioCards, setPortfolioCards] = useState<PortfolioObj[]>([
    {
      projectTitle: '',
      projectDescription: '',
      startDate: dayjs(),
      endDate: dayjs(),
      projectLink: '',
    },
  ]);
  const [showFields, setShowFields] = useState<boolean[]>([false]);
  const handleAdd = (): void => {
    setPortfolioCards((prevCards) => [
      ...prevCards,
      {
        projectTitle: '',
        projectDescription: '',
        startDate: dayjs(),
        endDate: dayjs(),
        projectLink: '',
      },
    ]);
    setShowFields((prevShowFields) => [...prevShowFields, false]);
  };
  const { portfolioInfo } = cvValues;
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
    const updatedPortfoliokInfo = [...portfolioInfo];
    updatedPortfoliokInfo[index] = {
      ...updatedPortfoliokInfo[index],
      ...portfolioCards[index],
    };

    const newCvValues: CVInfoObj = {
      ...cvValues,
      portfolioInfo: updatedPortfoliokInfo,
    };

    onCvValuesChange(newCvValues);
  };

  const handleRemove = (index: number): void => {
    setPortfolioCards((prevCards) => prevCards.filter((_, i) => i !== index));
    setShowFields((prevShowFields) =>
      prevShowFields.filter((_, i) => i !== index),
    );
  };
  const handleChange = (index: number, key: string, value: string): void => {
    setPortfolioCards((prevCards) => {
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
    { key: 'projectTitle', label: 'Project Title' },
    { key: 'projectDescription', label: 'Project Description' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'projectLink', label: 'Project Link' },
  ];
  return (
    <Box>
      <Box>
        {portfolioCards.map((card, index) => (
          <Card key={index}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Project
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Project To Your Portfolio
              </Typography>
              {showFields[index] && (
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
                            handleChange(index, 'projectTitle', e.target.value)
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
                              index,
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
                      {m.key === 'projectLink' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.projectLink || ''}
                          onChange={(e) =>
                            handleChange(index, 'projectLink', e.target.value)
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
                  disabled={portfolioCards.length === 1}
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

export default Portfolio;
