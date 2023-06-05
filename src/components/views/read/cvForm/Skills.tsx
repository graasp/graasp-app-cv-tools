import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  RefObject,
  createRef,
  useEffect,
  useRef,
  useState,
} from 'react';

import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import './Styles.css';

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
interface CardState {
  id: number;
  showFields: boolean;
}
const Skills: FC<Props> = ({
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
  const [cards, setCards] = useState([
    { id: 1, skills: ['React', 'Node.js'], title: 'Tech Skills' },
    { id: 2, skills: ['JavaScript', 'HTML', 'CSS'], title: 'Lang Skills' },
    { id: 3, skills: ['Python', 'Django'], title: 'Other Skills' },
  ]);
  const [cardStates, setCardStates] = useState<CardState[]>(
    cards.map((card) => ({ id: card.id, showFields: false })),
  );
  const handleEdit = (cardId: number): void => {
    const updatedCardStates = cardStates.map((cardState) => {
      if (cardState.id === cardId) {
        return { ...cardState, showFields: true };
      }
      return cardState;
    });
    setCardStates(updatedCardStates);
  };

  const handleDone = (cardId: number): void => {
    const updatedCardStates = cardStates.map((cardState) => {
      if (cardState.id === cardId) {
        return { ...cardState, showFields: false };
      }
      return cardState;
    });
    setCardStates(updatedCardStates);
  };

  // Skills
  const [inputRefs, setInputRefs] = useState<Record<
    number,
    RefObject<HTMLInputElement> | null
  > | null>(null);

  useEffect(() => {
    // Initialize inputRefs for each card
    const refs: Record<number, RefObject<HTMLInputElement> | null> = {};
    cards.forEach((card) => {
      refs[card.id] = createRef<HTMLInputElement>();
    });
    setInputRefs(refs);
  }, [cards]);

  // remove skill
  const removeSkill = (cardId: number, i: number): void => {
    const updatedCards = cards.map((card) => {
      if (card.id === cardId) {
        const updatedSkills = [...card.skills];
        updatedSkills.splice(i, 1);
        return { ...card, skills: updatedSkills };
      }
      return card;
    });
    setCards(updatedCards);
  };

  // add skill
  const addSkill = (
    cardId: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    const { value } = e.currentTarget;
    if (e.key === ' ' && value) {
      if (
        cards.some((card) =>
          card.skills.some(
            (skill) => skill.toLowerCase() === value.toLowerCase(),
          ),
        )
      ) {
        alert('No duplicate value allowed');
      } else {
        const updatedCards = cards.map((card) => {
          if (card.id === cardId) {
            const updatedSkills = [...card.skills, value];
            return { ...card, skills: updatedSkills };
          }
          return card;
        });
        setCards(updatedCards);
        const inputRef = inputRefs?.[cardId]?.current;
        if (inputRef) {
          inputRef.value = '';
        }
      }
    } else if (e.key === 'Backspace' && !value) {
      const foundCard = cards.find((card) => card.id === cardId);
      if (foundCard !== undefined) {
        const skillLength = foundCard.skills?.length ?? 0;
        removeSkill(cardId, skillLength - 1);
      }
    }
  };
  const handleNext = (): void => {
    const skillsObj: { [key: string]: string[] } = cards.reduce(
      (obj: any, card) => ({
        ...obj,
        [card.title]: [...card.skills],
      }),
      {},
    );
    const modifiedValues = skillsObj;
    handleValues('Skills', [modifiedValues]);
    nextPage();
    nextStep();
  };
  return (
    <div>
      <h2>Skills</h2>
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
              {card.title} - {card.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add A Skill
            </Typography>
            {cardStates[index].showFields && (
              <div className="skill">
                <ul>
                  {card.skills.map((skill, i) => (
                    <li key={i}>
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(card.id, i)}
                      >
                        +
                      </button>
                    </li>
                  ))}
                  <li className="input-skill">
                    <input
                      onKeyDown={(e) => addSkill(card.id, e)}
                      type="text"
                      size={2}
                      ref={inputRefs?.[card.id]}
                    />
                  </li>
                </ul>
              </div>
            )}
            <CardActions>
              {cardStates[index].showFields ? (
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
            </CardActions>
          </CardContent>
        </Card>
      ))}
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

export default Skills;
