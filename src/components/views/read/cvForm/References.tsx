import { List } from 'immutable';
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
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { showErrorToast } from '../../../../utils/toast';
import { useAppDataContext } from '../../../context/AppDataContext';
import Description from './Description';
import { MuiPhone } from './MuiPhone';
import { CvStatusObj, ReferencesObj } from './types';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  onError: (isError: boolean) => void;
}
const References: FC<Props> = ({ nextStep, prevStep, onError }) => {
  const { postAppData, patchAppData, deleteAppData, appDataArray } =
    useAppDataContext();
  const handlePost = (newdata: ReferencesObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.REFERENCES_INFO });
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
      (obj: AppData) => obj.type === APP_DATA_TYPES.REFERENCES_INFO,
    ) as List<AppData & { data: ReferencesObj }>;
    setReferencesCards(referencesData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(true);

  const handleAdd = (): void => {
    const newCardId = `card${(referencesCards?.size ?? 0) + 1}`;
    handlePost({
      id: newCardId,
      referenceName: '',
      referenceRelation: '',
      referenceCompany: '',
      referencePhoneNum: '',
      referenceEmail: '',
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
    test('referenceName', 'Reference Name is required', () => {
      enforce(data.referenceName).isNotEmpty();
    });

    test(
      'referenceName',
      'Reference Name be at most 50 characters long',
      () => {
        enforce(data.referenceName).shorterThan(50);
      },
    );

    test('referenceRelation', 'Reference Relation is required', () => {
      enforce(data.referenceRelation).isNotEmpty();
    });

    test(
      'referenceRelation',
      'Reference Relation must be at most 30 characters long',
      () => {
        enforce(data.referenceRelation).shorterThan(30);
      },
    );

    test('referenceCompany', 'Reference Company is required', () => {
      enforce(data.referenceCompany).isNotEmpty();
    });

    test(
      'referenceCompany',
      'Reference Company must be at most 30 characters long',
      () => {
        enforce(data.referenceCompany).shorterThan(30);
      },
    );

    test('referenceEmail', 'Reference Email is required', () => {
      enforce(data.referenceEmail).isNotEmpty();
    });

    test(
      'referenceEmail',
      'Reference Email must be at most 50 characters long',
      () => {
        enforce(data.referenceEmail).shorterThan(50);
      },
    );
  });

  const handleDone = (cardId: string): void => {
    const referencesInfoCard = referencesCards?.find(
      (card) => card.id === cardId,
    );
    if (referencesInfoCard) {
      // Run the validation suite
      const result = suite(referencesInfoCard.data);
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
        setIsValid(false);
        setErrors(updatedErrors);
      } else if (result.isValid()) {
        setIsValid(true);
        handlePatch(cardId, {
          ...referencesInfoCard.data,
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

  const handleChange = (cardId: string, key: string, value: string): void => {
    const phoneNumLen = key === 'referencePhoneNum' && value.trim().length >= 4;
    setReferencesCards((prevCards) => {
      const updatedCards = prevCards?.map((card) =>
        card.id === cardId
          ? {
              ...card,
              data: { ...card.data, [key]: phoneNumLen ? '' : value },
            }
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

  const handleCvStatePost = (newdata: CvStatusObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.CV_STATUS_INFO });
  };
  const handlePrev = (): void => {
    prevStep();
  };
  const handleNext = (): void => {
    const cvStatusData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.CV_STATUS_INFO,
    );

    // Check each card for unfilled required fields
    referencesCards?.forEach((card) => {
      const result = suite(card.data);
      if (result.hasErrors()) {
        setIsValid(false);
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
    const allSaved = referencesCards?.every((card) => card.data.saved);

    if (isValid && allSaved) {
      if (cvStatusData.size === 0) {
        handleCvStatePost({
          selectedTemplateId: '',
          customCv: false,
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
    { key: 'referenceName', label: 'Reference Name' },
    { key: 'referenceRelation', label: 'Reference Relation' },
    { key: 'referenceCompany', label: 'Reference Company' },
    { key: 'referencePhoneNum', label: 'Reference Phone Number' },
    { key: 'referenceEmail', label: 'Reference Email' },
  ];
  const title = 'References';
  const description =
    'For this part you can add as many References as you like and done, you can also remove any Reference you would like to remove from your application, modify the information by clicking on edit, fill up all the required fields, and when done editing just click on done button.';
  return (
    <Box>
      <Box>
        <Description title={title} description={description} />
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
                            handleChange(card.id, m.key, e.target.value)
                          }
                          required
                          fullWidth
                          margin="normal"
                          error={!!errors[`${card.id}-${m.key}`]}
                          helperText={errors[`${card.id}-${m.key}`]}
                        />
                      )}
                      {m.key === 'referenceRelation' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.referenceRelation || ''}
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
                      {m.key === 'referenceCompany' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.referenceCompany || ''}
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
                      {m.key === 'referencePhoneNum' && (
                        <MuiPhone
                          fullWidth
                          margin="normal"
                          label={m.label}
                          value={card.data.referencePhoneNum || ''}
                          onChange={(phone: string) =>
                            handleChange(card.id, m.key, phone)
                          }
                        />
                      )}
                      {m.key === 'referenceEmail' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.data.referenceEmail || ''}
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
                    </Box>
                  ))}
                </>
              ) : (
                Object.entries(card.data as ReferencesObj).map(
                  ([key, value]) => {
                    const mappingItem = mapping.find(
                      (item) => item.key === key,
                    );
                    if (value !== '' && mappingItem) {
                      const phoneNumLen =
                        value.toString.length <= 4 &&
                        key === 'referencePhoneNum';

                      // Render the key&value pair if it doesn't satisfy the condition.
                      if (!phoneNumLen) {
                        return (
                          <Box key={key}>
                            <Typography variant="subtitle2">
                              {mappingItem.label}: {value}
                            </Typography>
                          </Box>
                        );
                      }
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
