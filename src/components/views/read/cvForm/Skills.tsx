import React, { FC, KeyboardEvent, useState } from 'react';

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
  List,
  ListItem,
  Typography,
} from '@mui/material';

import './Styles.css';
import { CVInfoObj, SkillsObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  cvValues: CVInfoObj;
  onCvValuesChange: (newCvValues: CVInfoObj) => void;
}
const Skills: FC<Props> = ({
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
  const [skillCards, setSkillCards] = useState<SkillsObj[]>([
    { title: 'Tech Skills', skills: [] },
    { title: 'Lang Skills', skills: [] },
    { title: 'Other Skills', skills: [] },
  ]);
  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const { skillsInfo } = cvValues;
  const handleEdit = (cardId: string): void => {
    setShowFields((prevShowFields) => ({
      ...prevShowFields,
      [cardId]: true,
    }));
  };
  const handleDone = (cardId: string): void => {
    setShowFields((prevShowFields) => ({
      ...prevShowFields,
      [cardId]: false,
    }));

    const index = skillCards.findIndex((card) => card.title === cardId);
    const updatedSkillsInfo = skillsInfo.map((info, i) =>
      i === index ? { ...info, ...skillCards[index] } : info,
    );

    const newCvValues: CVInfoObj = {
      ...cvValues,
      skillsInfo: { ...updatedSkillsInfo, ...skillCards },
    };

    onCvValuesChange(newCvValues);
  };

  const removeSkill = (cardId: string, skillIndex: number): void => {
    setSkillCards((prevCards) => {
      const updatedCards = [...prevCards];
      const index = skillCards.findIndex((card) => card.title === cardId);
      updatedCards[index].skills.splice(skillIndex, 1);
      return updatedCards;
    });
  };

  const addSkill = (
    cardId: string,
    value: string,
    e: KeyboardEvent<HTMLInputElement>,
  ): void => {
    const index = skillCards.findIndex((card) => card.title === cardId);
    if (e.key === ' ' && value.trim() !== '') {
      const updatedSkillCards = [...skillCards];
      const updatedSkills = [...updatedSkillCards[index].skills, value.trim()];
      updatedSkillCards[index] = {
        ...updatedSkillCards[index],
        skills: updatedSkills,
      };
      setSkillCards(updatedSkillCards);
      e.currentTarget.value = '';
    } else if (e.key === 'Backspace' && value === '') {
      // Remove the last skill when backspace is pressed and input field is empty
      const updatedSkillCards = [...skillCards];
      const updatedSkills = [...updatedSkillCards[index].skills];
      updatedSkills.pop();
      updatedSkillCards[index] = {
        ...updatedSkillCards[index],
        skills: updatedSkills,
      };
      setSkillCards(updatedSkillCards);
    }
  };

  const handleNext = (): void => {
    nextPage();
    nextStep();
  };
  return (
    <Box>
      <Box>
        {skillCards.map((card) => (
          <Card key={card.title}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A Skill
              </Typography>
              {showFields[card.title] && (
                <Box className="skill">
                  <List>
                    {card.skills.map((skill, i) => (
                      <ListItem key={i}>
                        {skill}
                        <Button onClick={() => removeSkill(card.title, i)}>
                          +
                        </Button>
                      </ListItem>
                    ))}
                    <ListItem className="input-skill">
                      <input
                        onKeyDown={(e) =>
                          addSkill(card.title, e.currentTarget.value, e)
                        }
                        type="text"
                        size={2}
                      />
                    </ListItem>
                  </List>
                </Box>
              )}
              <CardActions>
                {showFields[card.title] ? (
                  <Button
                    size="small"
                    startIcon={<DoneIcon />}
                    onClick={() => handleDone(card.title)}
                  >
                    Done
                  </Button>
                ) : (
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(card.title)}
                  >
                    Edit
                  </Button>
                )}
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

export default Skills;
