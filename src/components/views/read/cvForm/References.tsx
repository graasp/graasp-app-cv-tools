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
  TextField,
  Typography,
} from '@mui/material';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { useAppDataContext } from '../../../context/AppDataContext';
import { MuiPhone } from './MuiPhone';
import { ReferencesObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
}
const References: FC<Props> = ({ nextPage, prevPage, nextStep, prevStep }) => {
  const { postAppData, patchAppData, deleteAppData, appDataArray } =
    useAppDataContext();
  const handlePost = (newdata: ReferencesObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.REFERENCES });
  };
  const handlePatch = (id: AppData['id'], newData: ReferencesObj): void => {
    patchAppData({ id, data: newData });
  };
  const handleDelete = (id: AppData['id']): void => {
    deleteAppData({ id });
  };

  const [referencesCards, setReferencesCards] =
    useState<List<AppData & { data: ReferencesObj }>>();

  useEffect(() => {
    const referencesData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.REFERENCES,
    ) as List<AppData & { data: ReferencesObj }>;
    setReferencesCards(referencesData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});

  const handleAdd = (): void => {
    const newCardId = `card${(referencesCards?.size ?? 0) + 1}`;
    handlePost({
      id: newCardId,
      referenceName: '',
      referenceRelation: '',
      referenceCompany: '',
      referencePhoneNum: '',
      referenceEmail: '',
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
    const referencesInfoCard = referencesCards?.find(
      (card) => card.id === cardId,
    );
    if (referencesInfoCard) {
      handlePatch(cardId, referencesInfoCard.data);
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

  const handleChange = (cardId: string, key: string, value: string): void => {
    setReferencesCards((prevCards) => {
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
    { key: 'referenceName', label: 'Reference Name' },
    { key: 'referenceRelation', label: 'Reference Relation' },
    { key: 'referenceCompany', label: 'Reference Company' },
    { key: 'referencePhoneNum', label: 'Reference Phone Number' },
    { key: 'referenceEmail', label: 'Reference Email' },
  ];
  return (
    <Box>
      <Box>
        <Typography sx={{ m: '0.5rem' }}>
          For this part you can add as many References as you like and done, you
          can also remove any Reference you would like to remove from your
          application, modify the information by clicking on edit, fill up all
          the required fields, and when done editing just click on done button.
        </Typography>
        {referencesCards?.map((card, index) => (
          <Card key={card.id}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                References {index + 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click Edit to fill information you would like to provide and
                Done to save your progress.
              </Typography>
              {showFields[card.id] ? (
                <>
                  {mapping.map((m) => (
                    <Box key={m.key}>
                      {m.key === 'referenceName' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.referenceName || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'referenceName',
                              e.target.value,
                            )
                          }
                          required
                          fullWidth
                          margin="normal"
                        />
                      )}
                      {m.key === 'referenceRelation' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.referenceRelation || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'referenceRelation',
                              e.target.value,
                            )
                          }
                          required
                          fullWidth
                          margin="normal"
                        />
                      )}
                      {m.key === 'referenceCompany' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.referenceCompany || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'referenceCompany',
                              e.target.value,
                            )
                          }
                          required
                          fullWidth
                          margin="normal"
                        />
                      )}
                      {m.key === 'referencePhoneNum' && (
                        <MuiPhone
                          required
                          fullWidth
                          margin="normal"
                          label={m.label}
                          value={card.data.referencePhoneNum || ''}
                          onChange={(phone: string) =>
                            handleChange(card.id, 'referencePhoneNum', phone)
                          }
                        />
                      )}
                      {m.key === 'referenceEmail' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.referenceEmail || ''}
                          onChange={(e) =>
                            handleChange(
                              card.id,
                              'referenceEmail',
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
                Object.entries(card.data as ReferencesObj).map(
                  ([key, value]) => {
                    if (
                      value !== '' &&
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

export default References;
