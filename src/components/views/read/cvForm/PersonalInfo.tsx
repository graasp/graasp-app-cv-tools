import dayjs, { Dayjs } from 'dayjs';

import { FC, RefObject, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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

const PersonalInfo: FC<Props> = ({
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
  const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs('2022-04-17'));
  const [phoneNumber, setPhoneNumber] = useState('');
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const handleClick = (): void => {
    // 👇️ open file input box on click of another element
    inputRef.current?.click();
  };
  const [inputValues, setInputValues] = useState<{ [key: string]: string }[]>(
    [],
  );
  const handleChange = (field: string, value: string): void => {
    setInputValues((prevInputValues) => {
      const updatedInputValues = [...prevInputValues];
      const fieldValue = { [field]: value };
      const existingFieldIndex = updatedInputValues.findIndex(
        (inputValue) => Object.keys(inputValue)[0] === field,
      );

      if (existingFieldIndex !== -1) {
        // Field already exists, update its value
        updatedInputValues[existingFieldIndex] = fieldValue;
      } else {
        // Field doesn't exist, add it to the input values
        updatedInputValues.push(fieldValue);
      }

      return updatedInputValues;
    });
  };
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const filePreview = reader.result as string;
        handleChange('preview', filePreview);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleNext = (): void => {
    const modifiedValues = {
      'First Name':
        inputValues.find(
          (inputValue) => Object.keys(inputValue)[0] === 'firstName',
        )?.firstName || '',
      'Last Name':
        inputValues.find(
          (inputValue) => Object.keys(inputValue)[0] === 'lastName',
        )?.lastName || '',
      'Birth Date':
        inputValues.find(
          (inputValue) => Object.keys(inputValue)[0] === 'birthDate',
        )?.birthDate || '',
      Gender:
        inputValues.find(
          (inputValue) => Object.keys(inputValue)[0] === 'gender',
        )?.gender || '',
      'Email Address':
        inputValues.find((inputValue) => Object.keys(inputValue)[0] === 'email')
          ?.email || '',
      'Phone Number':
        inputValues.find(
          (inputValue) => Object.keys(inputValue)[0] === 'phoneNumber',
        )?.phoneNumber || '',
      Address:
        inputValues.find(
          (inputValue) => Object.keys(inputValue)[0] === 'address',
        )?.address || '',
      'Profile Links':
        inputValues.find(
          (inputValue) => Object.keys(inputValue)[0] === 'profileLinks',
        )?.profileLinks || '',
      'Personal Link':
        inputValues.find(
          (inputValue) => Object.keys(inputValue)[0] === 'personalLink',
        )?.personalLink || '',
      'Personal Picture':
        inputValues.find(
          (inputValue) => Object.keys(inputValue)[0] === 'preview',
        )?.preview || '',
    };

    handleValues('Personal Info', [modifiedValues]);
    nextPage();
    nextStep();
  };
  return (
    <div>
      <div>
        <form
          style={{
            position: 'absolute',
            top: '305px',
            left: '528px',
            minWidth: '120px',
          }}
        >
          <p>First Name</p>
          <TextField
            label="First Name"
            id="firstName"
            value={
              inputValues.find(
                (inputValue) => Object.keys(inputValue)[0] === 'firstName',
              )?.firstName || ''
            }
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />
          <p>Last Name</p>
          <TextField
            label="Last Name"
            id="lastName"
            value={
              inputValues.find(
                (inputValue) => Object.keys(inputValue)[0] === 'lastName',
              )?.lastName || ''
            }
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
          <p>Date of Birth</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Birth Date"
              value={birthDate}
              maxDate={dayjs()}
              onChange={(date) => {
                const formattedDate = date
                  ? dayjs(date).format('YYYY-MM-DD')
                  : '';
                setBirthDate(date);
                setInputValues((prevInputValues) => [
                  ...prevInputValues.filter(
                    (inputValue) => Object.keys(inputValue)[0] !== 'birthDate',
                  ),
                  { birthDate: formattedDate },
                ]);
              }}
            />
          </LocalizationProvider>
          <p>Gender</p>
          <TextField
            id="select-gender"
            select
            label="Gender"
            value={
              inputValues.find(
                (inputValue) => Object.keys(inputValue)[0] === 'gender',
              )?.gender || ''
            }
            onChange={(e) => handleChange('gender', e.target.value)}
            required
            helperText="Please select your gender"
            margin="normal"
          >
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="noIndicate">Do not Indicate</MenuItem>
          </TextField>
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '328px',
              // display: 'flex',
            }}
          >
            <p>Email</p>
            <TextField
              label="Email Address"
              type="email"
              value={
                inputValues.find(
                  (inputValue) => Object.keys(inputValue)[0] === 'email',
                )?.email || ''
              }
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
            <p>Phone Number</p>
            <PhoneInput
              country="us"
              value={phoneNumber}
              onChange={(phone: string) => {
                setPhoneNumber(phone);
                setInputValues((prevInputValues) => [
                  ...prevInputValues.filter(
                    (inputValue) =>
                      Object.keys(inputValue)[0] !== 'phoneNumber',
                  ),
                  { phoneNumber: phone },
                ]);
              }}
            />
            <p>Address</p>
            <TextField
              label="Address"
              value={
                inputValues.find(
                  (inputValue) => Object.keys(inputValue)[0] === 'address',
                )?.address || ''
              }
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />
            <p>LinkedIn - Github Link</p>
            <TextField
              type="url"
              label="LinkedIn Link"
              value={
                inputValues.find(
                  (inputValue) => Object.keys(inputValue)[0] === 'profileLinks',
                )?.profileLinks || ''
              }
              onChange={(e) => handleChange('profileLinks', e.target.value)}
              required
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '628px',
              width: '100%',
              // display: 'flex',
            }}
          >
            <p>Own website</p>
            <TextField
              type="url"
              label="Personal Web Link"
              value={
                inputValues.find(
                  (inputValue) => Object.keys(inputValue)[0] === 'personalLink',
                )?.personalLink || ''
              }
              onChange={(e) => handleChange('personalLink', e.target.value)}
              required
            />
            <p>Image</p>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={inputRef}
              onChange={handleFileChange}
            />

            {inputValues.find(
              (inputValue) => Object.keys(inputValue)[0] === 'preview',
            )?.preview && (
              <img
                src={
                  inputValues.find(
                    (inputValue) => Object.keys(inputValue)[0] === 'preview',
                  )?.preview
                }
                alt="Preview"
              />
            )}

            <Button
              style={{ position: 'absolute', top: '170px', left: '30px' }}
              sx={{ width: 165 }}
              variant="contained"
              color="primary"
              startIcon={<UploadFileIcon />}
              onClick={handleClick}
            >
              Upload Image
            </Button>
          </div>
        </form>
      </div>
      <Button
        style={{ position: 'absolute', top: '855px', left: '628px' }}
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Home
      </Button>
      <Button
        style={{ position: 'absolute', top: '855px', left: '1070px' }}
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

export default PersonalInfo;
