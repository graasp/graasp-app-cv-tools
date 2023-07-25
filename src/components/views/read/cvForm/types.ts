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
  saved: boolean;
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
  saved: boolean;
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
  saved: boolean;
};

export type MotivationObj = {
  motivationLetter: string;
  saved: boolean;
};

export type ReferencesObj = {
  id: string;
  referenceName: string;
  referenceRelation: string;
  referenceCompany: string;
  referencePhoneNum: string;
  referenceEmail: string;
  saved: boolean;
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
  projectsInfo: PortfolioObj[];
  motivationInfo: MotivationObj;
  referencesInfo: ReferencesObj[];
  cvStatusInfo: CvStatusObj;
};

export type SubmissionStatus = { message: string };
