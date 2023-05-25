import dayjs, { Dayjs } from 'dayjs';

import { FC, RefObject, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs('2022-04-17'));
  const [selectedGender, setSelectedGender] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profileLinks, setProfileLinks] = useState('');
  const [personalLink, setPersonalLink] = useState('');
  const [pic, setPic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const handleClick = (): void => {
    // 👇️ open file input box on click of another element
    inputRef.current?.click();
  };
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPic(files[0]);
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };
  const formattedBirthDate = birthDate ? birthDate.format('YYYY-MM-DD') : '';
  const handleChange = (event: SelectChangeEvent): void => {
    setSelectedGender(event.target.value as string);
  };
  const handleNext = (): void => {
    const modifiedValues = {
      ...values,
      'Personal Details': {
        'First Name': firstName,
        'Last Name': lastName,
        'Birth Date': formattedBirthDate,
        Gender: selectedGender,
        'Email Address': email,
        'Phone Number': phoneNumber,
        Address: address,
        'Profile Links': profileLinks,
        'Personal Link': personalLink,
        'Personal Picture': preview,
      },
    };
    handleValues(modifiedValues);
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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <p>Last Name</p>
          <TextField
            label="Last Name"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <p>Date of Birth</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Birth Date"
              value={birthDate}
              maxDate={dayjs()}
              onChange={(e) => setBirthDate(e)}
            />
          </LocalizationProvider>
          <p>Gender</p>
          <Select
            value={selectedGender}
            onChange={handleChange}
            style={{ width: '100%' }}
            label="Gender"
          >
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="noIndicate">Do not Indicate</MenuItem>
          </Select>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p>Phone Number</p>
            <PhoneInput
              country="us"
              value={phoneNumber}
              onChange={(phone: string) => setPhoneNumber(phone)}
            />
            <p>Address</p>
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <p>LinkedIn - Github Link</p>
            <TextField
              type="url"
              label="LinkedIn Link"
              value={profileLinks}
              onChange={(e) => setProfileLinks(e.target.value)}
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
              value={personalLink}
              onChange={(e) => setPersonalLink(e.target.value)}
              required
            />
            <p>Image</p>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              style={{ display: 'none' }}
              ref={inputRef}
              onChange={handleFileChange}
            />

            {preview && <img src={preview} alt="Preview" />}
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
