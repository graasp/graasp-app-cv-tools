import { FC, useState } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

interface InnerObject {
  [key: string]: string;
}

interface ValuesObject {
  [key: string]: InnerObject;
}

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  homeStep: () => void;
  prevStep: () => void;
  values: ValuesObject;
}
const Review: FC<Props> = ({
  nextPage,
  prevPage,
  homeStep,
  prevStep,
  values,
}) => {
  const handleNext = (): void => {
    nextPage();
    homeStep();
  };
  const handlePrev = (): void => {
    prevPage();
    prevStep();
  };
  const [cards, setCards] = useState([{ id: 1 }]);
  const handleDownload = (): void => {
    const CvGenerated = 'link';
    <a
      href={CvGenerated}
      download="Example-PDF-document"
      target="_blank"
      rel="noreferrer"
    >
      <Button type="button">Download .pdf file</Button>
    </a>;
  };
  const personalInfoKeys = Object.keys(values['Personal Details']);
  const educationKeys = Object.keys(values.Education);
  const workExperienceKeys = Object.keys(values['Work Experience']);
  const skillsKeys = Object.keys(values.Skills);
  const portfolioKeys = Object.keys(values.Portfolio);
  const motivationKeys = Object.keys(values['Motivation Letter']);
  const referencesKeys = Object.keys(values.References);
  return (
    <div>
      <h2>Review</h2>
      <div>
        {cards.map((card) => (
          <Card
            key={card.id}
            sx={{
              maxWidth: 900,
              position: 'relative',
              zIndex: 100,
              overflow: 'visible',
            }}
            style={{
              position: 'absolute',
              height: 'auto',
              top: '350px',
              left: '650px',
            }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Your Generated CV
              </Typography>
              <p>CV Goes Here</p>
              <div>
                <Card style={{ height: 'auto' }}>
                  <CardContent>
                    <Typography variant="h5">Personal Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find((key) => key === 'First Name')}
                          :{' '}
                          {values['Personal Details']['First Name'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find((key) => key === 'Last Name')}:{' '}
                          {values['Personal Details']['Last Name'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find((key) => key === 'Birth Date')}
                          :{' '}
                          {values['Personal Details']['Birth Date'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find((key) => key === 'Gender')}:{' '}
                          {values['Personal Details'].Gender.toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find(
                            (key) => key === 'Email Address',
                          )}
                          :{' '}
                          {values['Personal Details'][
                            'Email Address'
                          ].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find(
                            (key) => key === 'Phone Number',
                          )}
                          :{' '}
                          {values['Personal Details'][
                            'Phone Number'
                          ].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find((key) => key === 'Address')}:{' '}
                          {values['Personal Details'].Address.toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find(
                            (key) => key === 'Profile Links',
                          )}
                          :{' '}
                          {values['Personal Details'][
                            'Profile Links'
                          ].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find(
                            (key) => key === 'Personal Link',
                          )}
                          :{' '}
                          {values['Personal Details'][
                            'Personal Link'
                          ].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {personalInfoKeys.find(
                            (key) => key === 'Personal Picture',
                          )}
                          :{' '}
                          {values['Personal Details']['Personal Picture'] && (
                            <img
                              src={
                                values['Personal Details']['Personal Picture']
                              }
                              alt="Preview"
                            />
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card style={{ height: 'auto' }}>
                  <CardContent>
                    <Typography variant="h5">Education</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {educationKeys.find((key) => key === 'Degree')}:{' '}
                          {values.Education.Degree.toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {educationKeys.find(
                            (key) => key === 'Institution Name',
                          )}
                          : {values.Education['Institution Name'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {educationKeys.find((key) => key === 'Major')}:{' '}
                          {values.Education.Major.toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {educationKeys.find((key) => key === 'Start Date')}:{' '}
                          {values.Education['Start Date'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {educationKeys.find((key) => key === 'End Date')}:{' '}
                          {values.Education['End Date'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {educationKeys.find((key) => key === 'GPA')}:{' '}
                          {values.Education.GPA.toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {educationKeys.find((key) => key === 'Country')}:{' '}
                          {values.Education.Country.toString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card style={{ height: 'auto' }}>
                  <CardContent>
                    <Typography variant="h5">Work Experience</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {workExperienceKeys.find(
                            (key) => key === 'Job Title',
                          )}
                          : {values['Work Experience']['Job Title'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {workExperienceKeys.find(
                            (key) => key === 'Institution Name',
                          )}
                          :{' '}
                          {values['Work Experience'][
                            'Institution Name'
                          ].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {workExperienceKeys.find(
                            (key) => key === 'Start Date',
                          )}
                          : {values['Work Experience']['Start Date'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {workExperienceKeys.find((key) => key === 'End Date')}
                          : {values['Work Experience']['End Date'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {workExperienceKeys.find((key) => key === 'Country')}:{' '}
                          {values['Work Experience'].Country.toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {workExperienceKeys.find(
                            (key) => key === 'Job Details',
                          )}
                          :{' '}
                          {values['Work Experience']['Job Details'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {workExperienceKeys.find(
                            (key) => key === 'Key Achievements',
                          )}
                          :{' '}
                          {values['Work Experience'][
                            'Key Achievements'
                          ].toString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card style={{ height: 'auto' }}>
                  <CardContent>
                    <Typography variant="h5">Skills</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {skillsKeys.find((key) => key === 'Tech Skills')}:{' '}
                          {values.Skills['Tech Skills'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {skillsKeys.find((key) => key === 'Lang Skills')}:{' '}
                          {values.Skills['Lang Skills'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {skillsKeys.find((key) => key === 'Other Skills')}:{' '}
                          {values.Skills['Other Skills'].toString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card style={{ height: 'auto' }}>
                  <CardContent>
                    <Typography variant="h5">Portfolio</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {portfolioKeys.find((key) => key === 'Project Title')}
                          : {values.Portfolio['Project Title'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {portfolioKeys.find(
                            (key) => key === 'Project Description',
                          )}
                          : {values.Portfolio['Project Description'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {portfolioKeys.find((key) => key === 'Start Date')}:{' '}
                          {values.Portfolio['Start Date'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {portfolioKeys.find((key) => key === 'End Date')}:{' '}
                          {values.Portfolio['End Date'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {portfolioKeys.find((key) => key === 'Project Link')}:{' '}
                          {values.Portfolio['Project Link'].toString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card style={{ height: 'auto' }}>
                  <CardContent>
                    <Typography variant="h5">Motivation Letter</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {motivationKeys.find((key) => key === 'Motivation')}:{' '}
                          {values['Motivation Letter'].Motivation.toString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card style={{ height: 'auto' }}>
                  <CardContent>
                    <Typography variant="h5">References</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {referencesKeys.find(
                            (key) => key === 'Reference Name',
                          )}
                          : {values.References['Reference Name'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {referencesKeys.find(
                            (key) => key === 'Reference Relation',
                          )}
                          : {values.References['Reference Relation'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {referencesKeys.find(
                            (key) => key === 'Reference Company',
                          )}
                          : {values.References['Reference Company'].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {referencesKeys.find(
                            (key) => key === 'Reference Phone Number',
                          )}
                          :{' '}
                          {values.References[
                            'Reference Phone Number'
                          ].toString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          {referencesKeys.find(
                            (key) => key === 'Reference Email',
                          )}
                          : {values.References['Reference Email'].toString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
              <CardActions>
                {/* <a href="./yourfile.pdf" download>
                  Download CV
                </a> */}
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                >
                  Download CV
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        style={{ position: 'absolute', top: '1555px', left: '550px' }}
        variant="contained"
        color="primary"
        startIcon={<NavigateBeforeIcon />}
        onClick={handlePrev}
      >
        Back
      </Button>
      <Button
        style={{ position: 'absolute', top: '1555px', left: '1570px' }}
        sx={{ width: 165 }}
        variant="contained"
        color="primary"
        startIcon={<CheckCircleIcon />}
        onClick={handleNext}
      >
        Submit
      </Button>
    </div>
  );
};

export default Review;
