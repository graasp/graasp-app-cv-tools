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
    { title: 'Tech Skills', skills: ['React', 'Node.js'] },
    { title: 'Lang Skills', skills: ['JavaScript', 'HTML', 'CSS'] },
    { title: 'Other Skills', skills: ['Python', 'Django'] },
  ]);
  const [showFields, setShowFields] = useState<boolean[]>([false]);
  const { skillsInfo } = cvValues;
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
    const updatedSkillsInfo = [...skillsInfo];
    updatedSkillsInfo[index] = {
      ...updatedSkillsInfo[index],
      ...skillCards[index],
    };

    const newCvValues: CVInfoObj = {
      ...cvValues,
      skillsInfo: updatedSkillsInfo,
    };

    onCvValuesChange(newCvValues);
  };
  const removeSkill = (index: number, skillIndex: number): void => {
    setSkillCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[index].skills.splice(skillIndex, 1);
      return updatedCards;
    });
  };

  const addSkill = (
    cardIndex: number,
    value: string,
    e: KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === ' ' && value.trim() !== '') {
      const updatedSkillCards = [...skillCards];
      const updatedSkills = [
        ...updatedSkillCards[cardIndex].skills,
        value.trim(),
      ];
      updatedSkillCards[cardIndex] = {
        ...updatedSkillCards[cardIndex],
        skills: updatedSkills,
      };
      setSkillCards(updatedSkillCards);
      e.currentTarget.value = '';
    } else if (e.key === 'Backspace' && value === '') {
      // Remove the last skill when backspace is pressed and input field is empty
      const updatedSkillCards = [...skillCards];
      const updatedSkills = [...updatedSkillCards[cardIndex].skills];
      updatedSkills.pop();
      updatedSkillCards[cardIndex] = {
        ...updatedSkillCards[cardIndex],
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
        {skillCards.map((card, index) => (
          <Card key={card.title}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A Skill
              </Typography>
              {showFields[index] && (
                <Box className="skill">
                  <ul>
                    {card.skills.map((skill, i) => (
                      <li key={i}>
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index, i)}
                        >
                          +
                        </button>
                      </li>
                    ))}
                    <li className="input-skill">
                      <input
                        onKeyDown={(e) =>
                          addSkill(index, e.currentTarget.value, e)
                        }
                        type="text"
                        size={2}
                      />
                    </li>
                  </ul>
                </Box>
              )}
              <CardActions>
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
