import dayjs, { Dayjs } from 'dayjs';

import { FC, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Button,
  InputLabel,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Import the default theme styles
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
const Education: FC<Props> = ({
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
  const [degree, setDegree] = useState('');
  const [instName, setInstName] = useState('');
  const [major, setMajor] = useState('');
  const [gpa, setGpa] = useState('');

  const [country, setCountry] = useState('');
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
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2022-04-17'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs('2022-04-18'));
  const formattedStartDate = startDate ? startDate.format('YYYY-MM-DD') : '';
  const formattedEndDate = endDate ? endDate.format('YYYY-MM-DD') : '';
  const handleNext = (): void => {
    const modifiedValues = {
      ...values,
      Education: {
        Degree: degree,
        'Institution Name': instName,
        Major: major,
        'Start Date': formattedStartDate,
        'End Date': formattedEndDate,
        GPA: gpa,
        Country: country,
      },
    };
    handleValues(modifiedValues);
    nextPage();
    nextStep();
  };
  return (
    <div>
      <h2>Education</h2>
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
                Education
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add A New Education
              </Typography>
              {showFields && (
                <>
                  <InputLabel id="select-label-degree">Degree Type</InputLabel>
                  <Select
                    labelId="select-label-degree"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                  >
                    <MenuItem value="Diploma">Diploma</MenuItem>
                    <MenuItem value="Bachelors">Bachelors</MenuItem>
                    <MenuItem value="Master">Master</MenuItem>
                    <MenuItem value="PhD">PhD</MenuItem>
                    <MenuItem value="Training">Internship - Training</MenuItem>
                  </Select>
                  <TextField
                    label="Institution Name"
                    value={instName}
                    onChange={(e) => {
                      setInstName(e.target.value);
                    }}
                    required
                  />
                  <TextField
                    label="Major - Field of Study"
                    value={major}
                    onChange={(e) => {
                      setMajor(e.target.value);
                    }}
                    required
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="From"
                      value={startDate}
                      maxDate={dayjs()}
                      onChange={(e) => setStartDate(e)}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Till"
                      value={endDate}
                      minDate={startDate}
                      maxDate={dayjs()}
                      onChange={(e) => setEndDate(e)}
                    />
                  </LocalizationProvider>
                  <TextField
                    label="GPA"
                    value={gpa}
                    onChange={(e) => {
                      setGpa(e.target.value);
                    }}
                  />
                  <InputLabel id="select-label-country">Country</InputLabel>
                  <Select
                    labelId="select-label-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <MenuItem value="Switzerland">Switzerland</MenuItem>
                    <MenuItem value="Europe">Europe</MenuItem>
                    <MenuItem value="Asia">Asia</MenuItem>
                    <MenuItem value="Africa">Africa</MenuItem>
                    <MenuItem value="North America">North America</MenuItem>
                    <MenuItem value="South America">South America</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
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

export default Education;
