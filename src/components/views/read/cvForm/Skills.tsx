import { List } from 'immutable';

import { FC, KeyboardEvent, useEffect, useState } from 'react';

import { AppData } from '@graasp/apps-query-client';

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
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { showErrorToast } from '../../../../utils/toast';
import { useAppDataContext } from '../../../context/AppDataContext';
import Description from './Description';
import { SkillsObj } from './types';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}
const Skills: FC<Props> = ({ nextStep, prevStep }) => {
  const { patchAppData, appDataArray } = useAppDataContext();
  const handlePatch = (id: AppData['id'], newData: SkillsObj): void => {
    patchAppData({ id, data: newData });
  };
  const [skillCards, setSkillCards] =
    useState<List<AppData & { data: SkillsObj }>>();

  useEffect(() => {
    const skillsData = appDataArray.filter(
      (obj: AppData) => obj.type === APP_DATA_TYPES.SKILLS_INFO,
    ) as List<AppData & { data: SkillsObj }>;
    setSkillCards(skillsData);
  }, [appDataArray]);

  const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({});
  const [editing, setEditing] = useState(false);

  const handleEdit = (cardId: string): void => {
    setEditing(true);
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
      setEditing(false);
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
    prevStep();
  };
  const handleNext = (): void => {
    if (!editing) {
      nextStep();
    } else {
      showErrorToast('Please save your progress by clicking on Done button');
    }
  };
  const title = 'Skills';
  const description =
    "Please fill the fields according to the following description. For this part you have 3 types of skills 'Digital Skills','Language Skills', and 'Other Skills', each of which you can fill as many skills as you have by clicking on edit button, then in the box of text just enter any skill then you can simply hit Spacebar it will be saved, deleting the skill can be done either by clicking on the x button it will appear on the skill itself, or by hitting Backspace from your keyboard. For 'Digital Skills', enter any technological skill from 'Programming', to 'Desgin', to 'Editing', etc. For 'Language Skills', enter any language that you can speak at good level such as 'English', to 'French', to 'Arabic', etc. For 'Other Skills', enter any other skill that you feel it doesn't fall under 'Digital Skills' or 'Language Skills' for example 'Team Leading', to 'Time Management', to 'Multi Tasking', 'Organisational Skills', 'Communication and Interpersonal Skills', 'Management and Leadership Skills', etc.";
  return (
    <Box>
      <Box>
        <Description title={title} description={description} />
        {skillCards?.map((card) => (
          <Card
            key={card.data.title}
            style={{ marginTop: '16px', marginBottom: '16px' }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5">
                {card.data.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click Edit to fill information you would like to provide and
                Done to save your progress.
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
                    fullWidth
                    margin="normal"
                  />
                </Box>
              ) : (
                Object.entries(card.data as SkillsObj).map(([key, values]) => {
                  if (key !== 'title' && values.length !== 0) {
                    const valuesArray = Array.isArray(values)
                      ? values
                      : [values];
                    return (
                      <Box key={key}>
                        <Typography variant="subtitle2">
                          {key}:{' '}
                          {valuesArray.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              color="primary"
                              style={{ marginLeft: '3px', marginRight: '3px' }}
                            />
                          ))}
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
      <Stack justifyContent="space-between" marginBottom="16px" direction="row">
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
      </Stack>
    </Box>
  );
};

export default Skills;
