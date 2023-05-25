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

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  values: ValuesObject;
  handleValues: (Values: any) => void;
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
  const [showFields, setShowFields] = useState(false);
  // const [cardCount, setCardCount] = useState(1);
  const [cards, setCards] = useState([{ id: 1 }]);
  const handleAdd = (): void => {
    const newCard = { id: cards.length + 1 };
    setCards([...cards, newCard]);
  };

  const handleRemove = (cardId: number): void => {
    if (cards.length === 1) {
      return; // Do not allow removing the only card
    }

    const updatedCards = cards.filter((card) => card.id !== cardId);
    setCards(updatedCards);
  };
  const handleEdit = (): void => {
    setShowFields(true);
  };
  const handleDone = (): void => {
    setShowFields(false);
  };
  const [refName, setRefName] = useState('');
  const [refRelation, setRefRelation] = useState('');
  const [refCompany, setRefCompany] = useState('');
  const [refPhoneNum, setRefPhoneNum] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const handleNext = (): void => {
    const modifiedValues = {
      ...values,
      References: {
        'Reference Name': refName,
        'Reference Relation': refRelation,
        'Reference Company': refCompany,
        'Reference Phone Number': refPhoneNum,
        'Reference Email': refEmail,
      },
    };
    handleValues(modifiedValues);
    nextPage();
    nextStep();
  };
  return (
    <div>
      <h2>References</h2>
      <div>
        {cards.map((card) => (
          <Card
            key={card.id}
            sx={{
              maxWidth: 900,
              position: 'relative',
              zIndex: 100,
              height: '400px',
              overflow: 'auto',
            }}
            style={{ position: 'absolute', top: '400px', left: '720px' }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                References
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Reference
              </Typography>
              {showFields && (
                <>
                  <TextField
                    label="Reference Name"
                    value={refName}
                    onChange={(e) => {
                      setRefName(e.target.value);
                    }}
                  />
                  <TextField
                    label="Reference Relation"
                    value={refRelation}
                    onChange={(e) => {
                      setRefRelation(e.target.value);
                    }}
                  />
                  <TextField
                    label="Reference Company"
                    value={refCompany}
                    onChange={(e) => {
                      setRefCompany(e.target.value);
                    }}
                  />
                  <PhoneInput
                    country="us"
                    value={refPhoneNum}
                    onChange={(phone: string) => setRefPhoneNum(phone)}
                  />
                  <TextField
                    label="Reference Email Address"
                    type="email"
                    value={refEmail}
                    onChange={(e) => {
                      setRefEmail(e.target.value);
                    }}
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
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DoneIcon />}
                  onClick={handleDone}
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
