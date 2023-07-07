import dayjs from 'dayjs';

import {
  ChangeEvent,
  FC,
  Fragment,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

import { AppData } from '@graasp/apps-query-client/dist/types';

import ClearIcon from '@mui/icons-material/Clear';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { APP_DATA_TYPES } from '../../../../config/appDataTypes';
import { useAppDataContext } from '../../../context/AppDataContext';
import { MuiPhone } from './MuiPhone';
import { PersonalInfoObj } from './types';

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const PersonalInfo: FC<Props> = ({ nextStep, prevStep }) => {
  // Below is an example of translating the comps.
  // const { t } = useTranslation();
  // inside each rendered input field, set the label to be like this: label={t('Birth Date')}
  const { patchAppData, appDataArray } = useAppDataContext();
  const personalInfoObject = appDataArray.find(
    (obj) => obj.type === APP_DATA_TYPES.PERSONALINFO,
  );

  const handlePatch = (dataObj: AppData, newData: PersonalInfoObj): void => {
    patchAppData({ id: dataObj.id, data: newData });
  };
  const genders = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'noIndicate', label: 'Do not Indicate' },
  ];
  const mapping = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'birthDate', label: 'Birth Date' },
    { key: 'gender', label: 'Gender' },
    { key: 'emailAddress', label: 'Email Address' },
    { key: 'phoneNum', label: 'Phone Number' },
    { key: 'address', label: 'Address' },
    { key: 'profileLinks', label: 'Profile Links' },
    { key: 'personalLink', label: 'Personal Links' },
    { key: 'personalPic', label: 'Personal Picture' },
  ];
  const [personalInfoState, setPersonalInfoState] = useState<
    AppData & { data: PersonalInfoObj }
  >();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const personalData = appDataArray.find(
      (obj: AppData) => obj.type === APP_DATA_TYPES.PERSONALINFO,
    ) as AppData & { data: PersonalInfoObj };
    setPersonalInfoState(personalData);
  }, [appDataArray]);

  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const [url, setUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState(false);

  const handleClick = (): void => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  const handleChange = (key: string, value: string): void => {
    setPersonalInfoState((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          [key]: value,
        },
      };
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: '', // Clear the error message for the field being edited
    }));
  };
  const handleInputBlur = (key: string, label: string): void => {
    if (
      !personalInfoState ||
      !(personalInfoState as AppData & { data: PersonalInfoObj }).data[key]
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: `${label} is required`, // Set the error message for the empty required field
      }));
    } else {
      const value = (personalInfoState as AppData & { data: PersonalInfoObj })
        .data[key] as string;
      if (!value.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: `${label} is required`,
        }));
      }
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { files } = e.target;
    const file = files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setUrl(dataUrl as string);
        setUploadedFile(file);
        setPersonalInfoState((prev) => {
          if (!prev) {
            return prev; // Return the current state if it is undefined
          }
          return {
            ...prev,
            data: {
              ...prev.data,
              personalPic: dataUrl as string,
            },
          };
        });
      };
      reader.readAsDataURL(file);
    } else {
      setUrl('');
      setUploadedFile(null);
      setPersonalInfoState((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          data: {
            ...prev.data,
            personalPic: '',
          },
        };
      });
    }
  };

  const handleFileRemove = (): void => {
    setUrl('');
    setUploadedFile(null);
    setPersonalInfoState((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          personalPic: '',
        },
      };
    });
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  const handleVisibility = (): void => {
    setVisibility(!visibility);
  };

  const handleSave = (): void => {
    setPersonalInfoState((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          saved: true,
        },
      };
    });
    let isValid = true;
    const updatedErrors = { ...errors };

    // Perform validation for each required field
    if (!personalInfoState?.data.firstName.trim()) {
      updatedErrors.firstName = 'First Name is required';
      isValid = false;
    } else {
      updatedErrors.firstName = '';
    }

    if (!personalInfoState?.data.lastName.trim()) {
      updatedErrors.lastName = 'Last Name is required';
      isValid = false;
    } else {
      updatedErrors.lastName = '';
    }

    if (!personalInfoState?.data.birthDate?.trim()) {
      updatedErrors.birthDate = 'Birth Date is required';
      isValid = false;
    } else {
      updatedErrors.birthDate = '';
    }

    if (!personalInfoState?.data.emailAddress.trim()) {
      updatedErrors.emailAddress = 'Email Address is required';
      isValid = false;
    } else {
      updatedErrors.emailAddress = '';
    }

    if (!personalInfoState?.data.phoneNum.trim()) {
      updatedErrors.phoneNum = 'Phone Number is required';
      isValid = false;
    } else {
      updatedErrors.phoneNum = '';
    }

    if (!personalInfoState?.data.profileLinks.trim()) {
      updatedErrors.profileLinks = 'Profile Links is required';
      isValid = false;
    } else {
      updatedErrors.profileLinks = '';
    }

    setErrors(updatedErrors);

    console.log(personalInfoState);
    // Save the data if it's valid
    if (isValid) {
      // Search in appDataArray to find the object of the same type 'personalInfo' and patch its data by its id
      const personalInfoObj = appDataArray.find(
        (obj: AppData) => obj.type === APP_DATA_TYPES.PERSONALINFO,
      ) as AppData & { data: PersonalInfoObj };

      if (personalInfoObj && personalInfoState) {
        handlePatch(personalInfoObj, personalInfoState.data);
      }
    }
  };
  const hasChanges =
    personalInfoState &&
    Object.keys(personalInfoState.data).some(
      (key) => personalInfoState.data[key] !== personalInfoObject?.data[key],
    );
  const handlePrev = (): void => {
    prevStep();
  };
  const handleNext = (): void => {
    let isValid = true;
    const updatedErrors = { ...errors };

    // Perform validation for each required field
    if (!personalInfoState?.data.firstName.trim()) {
      updatedErrors.firstName = 'First Name is required';
      isValid = false;
    }

    if (!personalInfoState?.data.lastName.trim()) {
      updatedErrors.lastName = 'Last Name is required';
      isValid = false;
    }

    if (!personalInfoState?.data.birthDate?.trim()) {
      updatedErrors.birthDate = 'Birth Date is required';
      isValid = false;
    }

    if (!personalInfoState?.data.emailAddress.trim()) {
      updatedErrors.emailAddress = 'Email Address is required';
      isValid = false;
    }

    if (!personalInfoState?.data.phoneNum.trim()) {
      updatedErrors.phoneNum = 'Phone Number is required';
      isValid = false;
    }

    if (!personalInfoState?.data.profileLinks.trim()) {
      updatedErrors.profileLinks = 'Profile Links is required';
      isValid = false;
    }

    setErrors(updatedErrors);

    // Proceed to the next step if all required fields are filled
    if (isValid && personalInfoState?.data.saved) {
      nextStep();
    } else if (!personalInfoState?.data.saved && isValid) {
      console.error(
        'Please save your progress by clicking on Save button before proceeding on',
      );
    }
  };
  // Flex-wrap: wrap;
  return (
    <Box>
      <Box>
        <Typography variant="h4">Personal Details</Typography>
        <Typography sx={{ m: '0.5rem' }}>
          For this part, you are supposed to fill all the required fields with
          your information, you can also upload a personal picture to have on
          your Cv.
        </Typography>
        {mapping.map((m) => (
          <Fragment key={m.key}>
            {m.key === 'firstName' && (
              <TextField
                label={m.label}
                id={m.key}
                value={personalInfoState?.data.firstName || ''}
                onChange={(e) => handleChange(m.key, e.target.value)}
                onBlur={() => handleInputBlur(m.key, m.label)}
                required
                margin="normal"
                fullWidth
                error={!!errors[m.key]}
                helperText={errors[m.key]}
              />
            )}
            {m.key === 'lastName' && (
              <TextField
                label={m.label}
                id={m.key}
                value={personalInfoState?.data.lastName || ''}
                onChange={(e) => handleChange(m.key, e.target.value)}
                onBlur={() => handleInputBlur(m.key, m.label)}
                required
                margin="normal"
                fullWidth
                error={!!errors[m.key]}
                helperText={errors[m.key]}
              />
            )}
            {m.key === 'birthDate' && (
              <Box marginTop="16px" marginBottom="16px">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={m.label}
                    value={
                      personalInfoState?.data.birthDate
                        ? dayjs(personalInfoState?.data.birthDate)
                        : null
                    }
                    maxDate={dayjs()}
                    onChange={(date) => {
                      const formattedDate = date
                        ? dayjs(date).format('YYYY-MM-DD')
                        : '';
                      handleChange(m.key, formattedDate);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors[m.key],
                        helperText: errors[m.key],
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            )}
            {m.key === 'gender' && (
              <TextField
                id="select-gender"
                select
                label={m.label}
                value={personalInfoState?.data?.gender || ''}
                onChange={(e) => handleChange(m.key, e.target.value)}
                fullWidth
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
                label={m.label}
                type="email"
                value={personalInfoState?.data.emailAddress || ''}
                onChange={(e) => handleChange(m.key, e.target.value)}
                onBlur={() => handleInputBlur(m.key, m.label)}
                required
                margin="normal"
                fullWidth
                error={!!errors[m.key]}
                helperText={errors[m.key]}
              />
            )}
            {m.key === 'phoneNum' && (
              <MuiPhone
                required
                fullWidth
                margin="normal"
                label={m.label}
                value={personalInfoState?.data.phoneNum || ''}
                onChange={(phone: string) => handleChange(m.key, phone)}
                onBlur={() => handleInputBlur(m.key, m.label)}
                error={!!errors[m.key]}
                helperText={errors[m.key]}
              />
            )}
            {m.key === 'address' && (
              <TextField
                label={m.label}
                id={m.key}
                value={personalInfoState?.data.address || ''}
                onChange={(e) => handleChange(m.key, e.target.value)}
                margin="normal"
                fullWidth
              />
            )}
            {m.key === 'profileLinks' && (
              <TextField
                type="url"
                label={m.label}
                value={personalInfoState?.data.profileLinks || ''}
                onChange={(e) => handleChange(m.key, e.target.value)}
                onBlur={() => handleInputBlur(m.key, m.label)}
                required
                margin="normal"
                fullWidth
                error={!!errors[m.key]}
                helperText={errors[m.key]}
              />
            )}
            {m.key === 'personalLink' && (
              <TextField
                type="url"
                label={m.label}
                value={personalInfoState?.data.personalLink || ''}
                onChange={(e) => handleChange(m.key, e.target.value)}
                margin="normal"
                fullWidth
              />
            )}
            {m.key === 'personalPic' && (
              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<UploadFileIcon />}
                  onClick={handleClick}
                  style={{ marginTop: '16px', marginBottom: '16px' }}
                >
                  Upload Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={inputRef}
                  onChange={onChange}
                />
                {uploadedFile && (
                  <Box display="flex" alignItems="center" marginLeft="8px">
                    <Typography>{uploadedFile.name}</Typography>
                    <IconButton onClick={handleFileRemove} color="primary">
                      <ClearIcon />
                    </IconButton>
                    <IconButton onClick={handleVisibility} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                )}
                {visibility && url && <img src={url} alt="Preview" />}
              </Box>
            )}
          </Fragment>
        ))}
      </Box>
      <ButtonGroup
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<NavigateBeforeIcon />}
          onClick={handlePrev}
          style={{ alignSelf: 'flex-start' }}
        >
          Home
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          style={{ alignSelf: 'center' }}
          disabled={!hasChanges}
        >
          Save
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
      </ButtonGroup>
    </Box>
  );
};

export default PersonalInfo;
