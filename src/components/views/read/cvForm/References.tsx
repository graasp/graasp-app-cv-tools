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

interface InnerObject {
  [key: string]: string;
}

interface ValuesObject {
  [key: string]: InnerObject;
}
interface HandleModifyFunction {
  (category: string, modifiedValues: any): void;
}
interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  values: ValuesObject;
  handleValues: HandleModifyFunction;
}
const References: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  values,
  handleValues,
}) => {
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const [cards, setCards] = useState([{ id: 1 }]);
  const handleAdd = (): void => {
    const newCard = { id: cards.length + 1 };
    setCards([...cards, newCard]);
  };
  const [showFields, setShowFields] = useState<boolean[]>([]);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const handleRemove = (cardId: number): void => {
    if (cards.length === 1) {
      return; // Do not allow removing the only card
    }

    const updatedCards = cards.filter((card) => card.id !== cardId);
    setCards(updatedCards);
  };
  const handleEdit = (cardId: number): void => {
    // Find the index of the card being edited
    const cardIndex = cards.findIndex((card) => card.id === cardId);

    // Update the active card index
    setActiveCardIndex(cardIndex);
    const updatedShowFields = [...showFields];

    // Update the visibility for the selected card
    updatedShowFields[cardIndex] = true;

    // Update the state with the new visibility array
    setShowFields(updatedShowFields);
  };
  const handleDone = (cardId: number): void => {
    const updatedShowFields = [...showFields];
    const cardIndex = cards.findIndex((card) => card.id === cardId);
    updatedShowFields[cardIndex] = false; // Set the visibility for the selected card to false
    setShowFields(updatedShowFields); // Update the state with the new visibility array
  };
  const [inputValues, setInputValues] = useState<
    { cardId: number; values: { [key: string]: string } }[]
  >([]);
  const handleChange = (cardId: number, field: string, value: string): void => {
    setInputValues((prevInputValues) => {
      const cardIndex = prevInputValues.findIndex(
        (inputValue) => inputValue.cardId === cardId,
      );

      if (cardIndex === -1) {
        // Card not found in the input values array, add a new entry
        return [...prevInputValues, { cardId, values: { [field]: value } }];
      }

      // Card found in the input values array, update the existing entry
      return prevInputValues.map((inputValue) => {
        if (inputValue.cardId === cardId) {
          return {
            ...inputValue,
            values: { ...inputValue.values, [field]: value },
          };
        }
        return inputValue;
      });
    });
  };
  const handleNext = (): void => {
    const modifiedValues = cards.map((card) => {
      const cardInputValues = inputValues.find(
        (inputValue) => inputValue.cardId === card.id,
      );

      return {
        'Reference Name': cardInputValues?.values.refName || '',
        'Reference Relation': cardInputValues?.values.refRelation || '',
        'Reference Company': cardInputValues?.values.refCompany || '',
        'Reference Phone Number': cardInputValues?.values.refPhoneNum || '',
        'Reference Email': cardInputValues?.values.email || '',
      };
    });
    handleValues('References', modifiedValues);
    nextPage();
    nextStep();
  };
  return (
    <div>
      <h2>References</h2>
      <div>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            sx={{
              maxWidth: 900,
              position: 'relative',
              zIndex: 100,
              height: '400px',
              overflow: 'auto',
            }}
            className={`card-item card-${card.id}`}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                References
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Reference
              </Typography>
              {showFields[index] && (
                <>
                  <TextField
                    label="Reference Name"
                    value={
                      inputValues.find(
                        (inputValue) => inputValue.cardId === card.id,
                      )?.values.refName || ''
                    }
                    onChange={(e) =>
                      handleChange(card.id, 'refName', e.target.value)
                    }
                  />
                  <TextField
                    label="Reference Relation"
                    value={
                      inputValues.find(
                        (inputValue) => inputValue.cardId === card.id,
                      )?.values.refRelation || ''
                    }
                    onChange={(e) =>
                      handleChange(card.id, 'refRelation', e.target.value)
                    }
                  />
                  <TextField
                    label="Reference Company"
                    value={
                      inputValues.find(
                        (inputValue) => inputValue.cardId === card.id,
                      )?.values.refCompany || ''
                    }
                    onChange={(e) =>
                      handleChange(card.id, 'refCompany', e.target.value)
                    }
                  />
                  <PhoneInput
                    country="us"
                    value={
                      inputValues.find(
                        (inputValue) => inputValue.cardId === card.id,
                      )?.values.refPhoneNum || ''
                    }
                    onChange={(e: string) =>
                      handleChange(card.id, 'refPhoneNum', e)
                    }
                  />
                  <TextField
                    label="Reference Email Address"
                    type="email"
                    value={
                      inputValues.find(
                        (inputValue) => inputValue.cardId === card.id,
                      )?.values.refEmail || ''
                    }
                    onChange={(e) =>
                      handleChange(card.id, 'refEmail', e.target.value)
                    }
                  />
                </>
              )}
              <CardActions>
                <Button size="small" startIcon={<Add />} onClick={handleAdd}>
                  Add
                </Button>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(card.id)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DoneIcon />}
                  onClick={() => handleDone(card.id)}
                >
                  Done
                </Button>
                <Button
                  size="small"
                  disabled={cards.length === 1}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove(card.id)}
                >
                  Remove
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        style={{ position: 'absolute', top: '605px', left: '628px' }}
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Back
      </Button>
      <Button
        style={{ position: 'absolute', top: '599px', left: '1070px' }}
        sx={{ width: 165 }}
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
