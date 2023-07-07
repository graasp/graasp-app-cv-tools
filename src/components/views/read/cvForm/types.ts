export type PersonalInfoObj = {
  firstName: string;
  lastName: string;
  birthDate: string | null;
  gender: string;
  emailAddress: string;
  phoneNum: string;
  address: string;
  profileLinks: string;
  personalLink: string;
  personalPic: string;
  saved: boolean;
};

export type EducationInfoObj = {
  id: string;
  degree: string;
  institutionName: string;
  major: string;
  startDate: string | null;
  endDate: string | null;
  gpa: string;
  country: string;
  present?: boolean;
};

export type WorkExperienceObj = {
  id: string;
  jobTitle: string;
  institutionName: string;
  startDate: string | null;
  endDate: string | null;
  country: string;
  jobDetails: string;
  keyAchievements: string;
  present?: boolean;
};

export type SkillsObj = {
  skills: string[];
  title: string;
};

export type PortfolioObj = {
  id: string;
  projectTitle: string;
  projectDescription: string;
  startDate: string | null;
  endDate: string | null;
  projectLink: string;
  present?: boolean;
};

export type MotivationObj = {
  motivationLetter: string;
};

export type ReferencesObj = {
  id: string;
  referenceName: string;
  referenceRelation: string;
  referenceCompany: string;
  referencePhoneNum: string;
  referenceEmail: string;
};

export type CvStatusObj = {
  selectedTemplateId: string;
  customCv: boolean;
  fileUrl?: string;
};

export type CVInfoObj = {
  personalInfo: PersonalInfoObj;
  educationInfo: EducationInfoObj[];
  workInfo: WorkExperienceObj[];
  skillsInfo: SkillsObj[];
  portfolioInfo: PortfolioObj[];
  motivationInfo: MotivationObj;
  referencesInfo: ReferencesObj[];
  cvStateInfo: CvStatusObj;
};

export type SubmissionStatus = { message: string };
