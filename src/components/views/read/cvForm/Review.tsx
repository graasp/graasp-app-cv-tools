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
interface CVValues {
  [category: string]: {
    [fieldName: string]: any;
  }[];
}
interface Props {
  nextPage: () => void;
  prevPage: () => void;
  homeStep: () => void;
  prevStep: () => void;
  values: CVValues;
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
  // const personalInfoKeys = Object.keys(values['Personal Details']);
  // const educationKeys = Object.keys(values.Education);
  // const workExperienceKeys = Object.keys(values['Work Experience']);
  // const skillsKeys = Object.keys(values.Skills);
  // const portfolioKeys = Object.keys(values.Portfolio);
  // const motivationKeys = Object.keys(values['Motivation Letter']);
  // const referencesKeys = Object.keys(values.References);
  const personalData = values['Personal Info'];
  const educationData = values.Education;
  const workData = values['Work Experience'];
  const skillsData = values.Skills;
  const portfolioData = values.Portfolio;
  const motivationData = values['Motivation Letter'];
  const referencesData = values.References;
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
                {personalData.map((personal, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Typography variant="h5">Personal Data</Typography>
                      <Grid container spacing={2}>
                        {Object.entries(personal).map(([field, value]) => (
                          <Grid item xs={12} sm={6} key={field}>
                            <Typography>
                              {field}:{' '}
                              {field === 'Personal Picture' ? (
                                <img src={value} alt="123" />
                              ) : (
                                value
                              )}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                {educationData.map((education, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Typography variant="h5">
                        Education {index + 1}
                      </Typography>
                      <Grid container spacing={2}>
                        {Object.entries(education).map(([field, value]) => (
                          <Grid item xs={12} sm={6} key={field}>
                            <Typography>
                              {field}: {value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                {workData.map((job, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Typography variant="h5">
                        Work Experience {index + 1}
                      </Typography>
                      <Grid container spacing={2}>
                        {Object.entries(job).map(([field, value]) => (
                          <Grid item xs={12} sm={6} key={field}>
                            <Typography>
                              {field}: {value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                {skillsData.map((skill, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Typography variant="h5">Skills</Typography>
                      <Grid container spacing={2}>
                        {Object.entries(skill).map(([field, value]) => (
                          <Grid item xs={12} sm={6} key={field}>
                            <Typography>
                              {field}: {value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                {portfolioData.map((project, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Typography variant="h5">Project {index + 1}</Typography>
                      <Grid container spacing={2}>
                        {Object.entries(project).map(([field, value]) => (
                          <Grid item xs={12} sm={6} key={field}>
                            <Typography>
                              {field}: {value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                {motivationData.map((motivation, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Typography variant="h5">Motivation Letter</Typography>
                      <Grid container spacing={2}>
                        {Object.entries(motivation).map(([field, value]) => (
                          <Grid item xs={12} sm={6} key={field}>
                            <Typography>
                              {field}: {value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                {referencesData.map((reference, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Typography variant="h5">
                        Reference {index + 1}
                      </Typography>
                      <Grid container spacing={2}>
                        {Object.entries(reference).map(([field, value]) => (
                          <Grid item xs={12} sm={6} key={field}>
                            <Typography>
                              {field}: {value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
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
