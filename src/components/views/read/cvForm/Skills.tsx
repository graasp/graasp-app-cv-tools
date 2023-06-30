import { FC, KeyboardEvent, useEffect, useState } from 'react';

import { AppData } from '@graasp/apps-query-client/dist/types';

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
  Chip,
  TextField,
  Typography,
} from '@mui/material';

import { useAppDataContext } from '../../../context/AppDataContext';
import { SkillsObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skillsData: SkillsObj[];
  onCvValuesChange: (data: SkillsObj[]) => void;
}
const Skills: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  skillsData,
  onCvValuesChange,
}) => {
  const { postAppData, patchAppData, appDataArray } = useAppDataContext();
  const skillsInfoObject = appDataArray.find(
    (obj) => obj.type === 'skillsInfo',
  );
  const handlePost = (newdata: SkillsObj): void => {
    postAppData({ data: newdata, type: 'skillsInfo' });
  };
  const handlePatch = (dataObj: AppData, newData: SkillsObj): void => {
    patchAppData({ id: dataObj.id, data: newData });
  };
  const [skillCards, setSkillCards] = useState(skillsData);

  useEffect(() => {
    setSkillCards(skillsData);
  }, [skillsData]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});

  const handleEdit = (cardId: string): void => {
    setShowFields((prevShowFields) => ({
      ...prevShowFields,
      [cardId]: true,
    }));
  };
  const handleDone = (cardId: string): void => {
    const skillsInfoCard = skillCards.find((card) => card.title === cardId);
    if (
      skillsInfoObject &&
      skillsInfoObject?.data.title === skillsInfoCard?.title &&
      skillsInfoCard
    ) {
      handlePatch(skillsInfoObject, skillsInfoCard);
    } else if (
      (!skillsInfoObject && skillsInfoCard) ||
      (skillsInfoObject?.data.title !== skillsInfoCard?.title && skillsInfoCard)
    ) {
      handlePost(skillsInfoCard);
    }

    setShowFields((prevShowFields) => ({
      ...prevShowFields,
      [cardId]: false,
    }));
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
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const handlePrev = (): void => {
    onCvValuesChange(skillCards);
    prevPage();
    prevStep();
  };
  const handleNext = (): void => {
    onCvValuesChange(skillCards);
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
              {showFields[card.title] ? (
                <Box className="skill">
                  <TextField
                    InputProps={{
                      startAdornment: card.skills.map((skill, i) => (
                        <Chip
                          label={skill}
                          key={i}
                          onDelete={() => removeSkill(card.title, i)}
                        />
                      )),
                      onKeyDown: (e) =>
                        addSkill(card.title, e.currentTarget.value, e),
                    }}
                    size="small"
                  />
                </Box>
              ) : (
                Object.entries(card).map(([key, value]) => {
                  if (key !== 'title' && value.length !== 0) {
                    return (
                      <Box key={key}>
                        <Typography variant="subtitle2">
                          {key}: {value}
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                })
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
