import { FC, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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

import { CVInfoObj, ReferencesObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  cvValues: CVInfoObj;
  referencesData: ReferencesObj[];
  onCvValuesChange: (data: ReferencesObj[]) => void;
}
const References: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  cvValues,
  referencesData,
  onCvValuesChange,
}) => {
  const [referencesCards, setReferencesCards] = useState(referencesData);

  useEffect(() => {
    setReferencesCards(referencesData);
  }, [referencesData]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});

  const handleAdd = (): void => {
    const newCardId = `card${referencesCards.length + 1}`;
    setReferencesCards((prevCards) => [
      ...prevCards,
      {
        id: newCardId,
        referenceName: '',
        referenceRelation: '',
        referenceCompany: '',
        referencePhoneNum: '',
        referenceEmail: '',
      },
    ]);
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
    setShowFields((prevShowFields) => {
      const updatedShowFields = { ...prevShowFields };
      updatedShowFields[cardId] = false;
      return updatedShowFields;
    });
  };

  const handleRemove = (cardId: string): void => {
    setReferencesCards((prevCards) =>
      prevCards.filter((card) => card.id !== cardId),
    );
    setShowFields((prevShowFields) => {
      const updatedShowFields = { ...prevShowFields };
      delete updatedShowFields[cardId];
      return updatedShowFields;
    });
  };

  const handleChange = (cardId: string, key: string, value: string): void => {
    setReferencesCards((prevCards) => {
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
    console.log(cvValues);
    onCvValuesChange(referencesCards);
    nextPage();
    nextStep();
  };

  const mapping = [
    { key: 'referenceName', label: 'Reference Name' },
    { key: 'referenceRelation', label: 'Reference Relation' },
    { key: 'referenceCompany', label: 'Reference Company' },
    { key: 'referencePhoneNum', label: 'Reference Phone Number' },
    { key: 'referenceEmail', label: 'Reference Email' },
  ];
  return (
    <Box>
      <Box>
        {referencesCards.map((card) => (
          <Card key={card.id}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                References
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Reference
              </Typography>
              {showFields[card.id] && (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      <Typography>{m.label}</Typography>
                      {m.key === 'referenceName' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.referenceName || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'referenceName',
                              e.target.value,
                            )
                          }
                          required
                        />
                      )}
                      {m.key === 'referenceRelation' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.referenceRelation || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'referenceRelation',
                              e.target.value,
                            )
                          }
                          required
                        />
                      )}
                      {m.key === 'referenceCompany' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.referenceCompany || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'referenceCompany',
                              e.target.value,
                            )
                          }
                          required
                        />
                      )}
                      {m.key === 'referencePhoneNum' && (
                        <PhoneInput
                          country="us"
                          value={card.referencePhoneNum || ''}
                          onChange={(phone: string) =>
                            handleChange(card.id, 'referencePhoneNum', phone)
                          }
                        />
                      )}
                      {m.key === 'referenceEmail' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.referenceEmail || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'referenceEmail',
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
                  disabled={referencesCards.length === 1}
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

export default References;
