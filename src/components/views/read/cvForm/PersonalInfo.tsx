import dayjs from 'dayjs';

import { FC, RefObject, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { CVInfoObj, PersonalInfoObj } from './types';

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  personalInfo: PersonalInfoObj;
  onCvValuesChange: (
    subkey: string,
    newSubkeyValues: Partial<CVInfoObj>,
  ) => void;
}

const PersonalInfo: FC<Props> = ({
  nextPage,
  prevPage,
  nextStep,
  prevStep,
  personalInfo,
  onCvValuesChange,
}) => {
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const genders = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'noIndicate', label: 'Do not Indicate' },
  ];
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const mapping = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'birthDate', label: 'Birth Date' },
    { key: 'gender', label: 'Gender' },
    { key: 'emailAddress', label: 'Email Address' },
    { key: 'phoneNum', label: 'Phone Number' },
    { key: 'address', label: 'Address' },
    { key: 'profileLinks', label: 'Profile Links' },
    { key: 'personalLinks', label: 'Personal Links' },
    { key: 'personalPic', label: 'Personal Picture' },
  ];
  const [birthDate, setBirthDate] = useState<string | undefined>();
  const handleChange = (field: keyof PersonalInfoObj, value: string): void => {
    const newPersonalInfo: PersonalInfoObj = {
      ...personalInfo,
      [field]: value,
    };

    onCvValuesChange('personalInfo', newPersonalInfo);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const newPersonalInfo: PersonalInfoObj = {
          ...personalInfo,
          personalPic: reader.result as string,
        };

        onCvValuesChange('personalInfo', newPersonalInfo);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClick = (): void => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleNext = (): void => {
    nextPage();
    nextStep();
  };
  // Flex-wrap: wrap;
  return (
    <Box>
      <Box>
        {mapping.map((m) => (
          <>
            <Typography>{m.label}</Typography>
            {m.key === 'firstName' && (
              <TextField
                label={m.label}
                id={m.key}
                value={personalInfo.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            )}
            {m.key === 'lastName' && (
              <TextField
                label={m.label}
                id={m.key}
                value={personalInfo.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            )}
            {m.key === 'birthDate' && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Birth Date"
                  value={birthDate ? dayjs(birthDate) : undefined}
                  maxDate={dayjs()}
                  onChange={(date) => {
                    const formattedDate = date
                      ? dayjs(date).format('YYYY-MM-DD')
                      : '';
                    setBirthDate(formattedDate || undefined);
                    handleChange('birthDate', formattedDate);
                  }}
                />
              </LocalizationProvider>
            )}
            {m.key === 'gender' && (
              <TextField
                id="select-gender"
                select
                label="Gender"
                value={personalInfo.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                required
                helperText="Please select your gender"
                margin="normal"
              >
                {genders.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {m.key === 'emailAddress' && (
              <TextField
                label="Email Address"
                type="email"
                value={personalInfo.emailAddress}
                onChange={(e) => handleChange('emailAddress', e.target.value)}
                required
              />
            )}
            {m.key === 'phoneNum' && (
              <PhoneInput
                country="us"
                value={personalInfo.phoneNum}
                onChange={(phone: string) => handleChange('phoneNum', phone)}
              />
            )}
            {m.key === 'profileLinks' && (
              <TextField
                type="url"
                label="LinkedIn Link"
                value={personalInfo.profileLinks}
                onChange={(e) => handleChange('profileLinks', e.target.value)}
                required
              />
            )}
            {m.key === 'personalLinks' && (
              <TextField
                type="url"
                label="Personal Web Link"
                value={personalInfo.personalLink}
                onChange={(e) => handleChange('personalLink', e.target.value)}
                required
              />
            )}
            {m.key === 'personalPic' && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={inputRef}
                  onChange={handleFileChange}
                />
                {personalInfo.personalPic && (
                  <img src={personalInfo.personalPic} alt="Preview" />
                )}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<UploadFileIcon />}
                  onClick={handleClick}
                >
                  Upload Image
                </Button>
              </>
            )}
          </>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Home
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

export default PersonalInfo;
