import { FC, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
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
  onCvValuesChange: (newCvValues: CVInfoObj) => void;
}
const References: FC<Props> = ({
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
  const [referencesCards, setReferencesCards] = useState<ReferencesObj[]>([
    {
      referenceName: '',
      referenceRelation: '',
      referenceCompany: '',
      referencePhoneNum: '',
      referenceEmail: '',
    },
  ]);
  const [showFields, setShowFields] = useState<boolean[]>([false]);
  const handleAdd = (): void => {
    setReferencesCards((prevCards) => [
      ...prevCards,
      {
        referenceName: '',
        referenceRelation: '',
        referenceCompany: '',
        referencePhoneNum: '',
        referenceEmail: '',
      },
    ]);
    setShowFields((prevShowFields) => [...prevShowFields, false]);
  };
  const { referencesInfo } = cvValues;
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
    const updatedReferecnesInfo = [...referencesInfo];
    updatedReferecnesInfo[index] = {
      ...updatedReferecnesInfo[index],
      ...referencesCards[index],
    };

    const newCvValues: CVInfoObj = {
      ...cvValues,
      referencesInfo: updatedReferecnesInfo,
    };

    onCvValuesChange(newCvValues);
  };

  const handleRemove = (index: number): void => {
    setReferencesCards((prevCards) => prevCards.filter((_, i) => i !== index));
    setShowFields((prevShowFields) =>
      prevShowFields.filter((_, i) => i !== index),
    );
  };
  const handleChange = (index: number, key: string, value: string): void => {
    setReferencesCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[index] = {
        ...updatedCards[index],
        [key]: value,
      };
      return updatedCards;
    });
  };

  const handleNext = (): void => {
    console.log(cvValues);
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
    <div>
      <h2>References</h2>
      <div>
        {referencesCards.map((card, index) => (
          <Card key={index}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Education
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Education
              </Typography>
              {showFields[index] && (
                <>
                  {mapping.map((m) => (
                    <div key={m.key}>
                      <p>{m.label}</p>
                      {m.key === 'referenceName' && (
                        <TextField
                          id={m.key}
                          label={m.label}
                          value={card.referenceName || ''}
                          onChange={(e) =>
                            handleChange(index, 'referenceName', e.target.value)
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
                              index,
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
                              index,
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
                            handleChange(index, 'referencePhoneNum', phone)
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
                              index,
                              'referenceEmail',
                              e.target.value,
                            )
                          }
                          required
                        />
                      )}
                    </div>
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
                  disabled={referencesCards.length === 1}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </div>
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
    </div>
  );
};

export default References;
