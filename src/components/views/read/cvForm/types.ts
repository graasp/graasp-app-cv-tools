import { Dayjs } from 'dayjs';

export type PersonalInfoObj = {
  firstName: string;
  lastName: string;
  birthDate: Dayjs;
  gender: string;
  emailAddress: string;
  phoneNum: string;
  address: string;
  profileLinks: string;
  personalLink: string;
  personalPic: string;
};

export type EducationInfoObj = {
  degree: string;
  institutionName: string;
  major: string;
  startDate: Dayjs;
  endDate: Dayjs;
  gpa: string;
  country: string;
};

export type WorkExperienceObj = {
  jobTitle: string;
  institutionName: string;
  startDate: Dayjs;
  endDate: Dayjs;
  country: string;
  jobDetails: string;
  keyAchievements: string;
};

export type SkillsObj = {
  skills: string[];
  title: string;
};

export type PortfolioObj = {
  projectTitle: string;
  projectDescription: string;
  startDate: Dayjs;
  endDate: Dayjs;
  projectLink: string;
};

export type MotivationObj = {
  motivationLetter: string;
};

export type ReferencesObj = {
  referenceName: string;
  referenceRelation: string;
  referenceCompany: string;
  referencePhoneNum: string;
  referenceEmail: string;
};

export type CVInfoObj = {
  personalInfo: PersonalInfoObj;
  educationInfo: EducationInfoObj[];
  workInfo: WorkExperienceObj[];
  skillsInfo: SkillsObj[];
  portfolioInfo: PortfolioObj[];
  motivationInfo: MotivationObj;
  referencesInfo: ReferencesObj[];
};
