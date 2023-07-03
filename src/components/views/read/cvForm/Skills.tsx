import { List } from 'immutable';

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

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { useAppDataContext } from '../../../context/AppDataContext';
import { SkillsObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
}
const Skills: FC<Props> = ({ nextPage, prevPage, nextStep, prevStep }) => {
  const { patchAppData, appDataArray } = useAppDataContext();
  const handlePatch = (id: AppData['id'], newData: SkillsObj): void => {
    patchAppData({ id, data: newData });
  };
  const [skillCards, setSkillCards] =
    useState<List<AppData & { data: SkillsObj }>>();

  useEffect(() => {
    const skillsData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.SKILLS,
    ) as List<AppData & { data: SkillsObj }>;
    setSkillCards(skillsData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});

  const handleEdit = (cardId: string): void => {
    setShowFields((prevShowFields) => ({
      ...prevShowFields,
      [cardId]: true,
    }));
  };
  const handleDone = (cardId: string, appID: string): void => {
    const skillsInfoCard = skillCards?.find(
      (card) => card.data.title === cardId,
    );
    if (skillsInfoCard) {
      handlePatch(appID, skillsInfoCard.data);
    }

    setShowFields((prevShowFields) => ({
      ...prevShowFields,
      [cardId]: false,
    }));
  };
  const removeSkill = (cardId: string, skillIndex: number): void => {
    setSkillCards((prevCards) => {
      const updatedCards = prevCards?.map((card) => {
        if (card.id === cardId) {
          const updatedSkills = [...card.data.skills];
          updatedSkills.splice(skillIndex, 1);
          return {
            ...card,
            data: {
              ...card.data,
              skills: updatedSkills,
            },
          };
        }
        return card;
      });
      return updatedCards;
    });
  };

  const addSkill = (
    cardId: string,
    value: string,
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    if (e.key === ' ' && value.trim() !== '') {
      setSkillCards((prevCards) => {
        const updatedCards = prevCards?.map((card) =>
          card.id === cardId
            ? {
                ...card,
                data: {
                  ...card.data,
                  skills: [...card.data.skills, value.trim()],
                },
              }
            : card,
        );
        return updatedCards;
      });

      e.currentTarget.value = '';
    } else if (e.key === 'Backspace' && value === '') {
      setSkillCards((prevCards) => {
        const updatedCards = prevCards?.map((card) =>
          card.id === cardId
            ? {
                ...card,
                data: {
                  ...card.data,
                  skills: card.data.skills.slice(0, -1),
                },
              }
            : card,
        );
        return updatedCards;
      });
    }
  };

  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const handleNext = (): void => {
    nextPage();
    nextStep();
  };
  return (
    <Box>
      <Box>
        {skillCards?.map((card) => (
          <Card key={card.data.title}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                {card.data.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A Skill
              </Typography>
              {showFields[card.data.title] ? (
                <Box className="skill">
                  <TextField
                    InputProps={{
                      startAdornment: card.data.skills.map((skill, i) => (
                        <Chip
                          label={skill}
                          key={i}
                          onDelete={() => removeSkill(card.id, i)}
                        />
                      )),
                      onKeyDown: (e) =>
                        addSkill(card.id, e.currentTarget.value, e),
                    }}
                    size="small"
                  />
                </Box>
              ) : (
                Object.entries(card.data as SkillsObj).map(([key, values]) => {
                  if (key !== 'title' && values.length !== 0) {
                    return (
                      <Box key={key}>
                        <Typography variant="subtitle2">
                          {key}: {Array.from(values).join(', ')}
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                })
              )}
              <CardActions>
                {showFields[card.data.title] ? (
                  <Button
                    size="small"
                    startIcon={<DoneIcon />}
                    onClick={() => handleDone(card.data.title, card.id)}
                  >
                    Done
                  </Button>
                ) : (
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(card.data.title)}
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
