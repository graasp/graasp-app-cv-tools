export type PersonalInfoObj = {
  firstName: string;
  lastName: string;
  birthDate: string | undefined;
  gender: string;
  emailAddress: string;
  phoneNum: string;
  address: string;
  profileLinks: string;
  personalLink: string;
  personalPic: string;
};

export type EducationInfoObj = {
  id: string;
  degree: string;
  institutionName: string;
  major: string;
  startDate: string | undefined;
  endDate: string | undefined;
  gpa: string;
  country: string;
};

export type WorkExperienceObj = {
  id: string;
  jobTitle: string;
  institutionName: string;
  startDate: string | undefined;
  endDate: string | undefined;
  country: string;
  jobDetails: string;
  keyAchievements: string;
};

export type SkillsObj = {
  skills: string[];
  title: string;
};

export type PortfolioObj = {
  id: string;
  projectTitle: string;
  projectDescription: string;
  startDate: string | undefined;
  endDate: string | undefined;
  projectLink: string;
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

export type CVInfoObj = {
  personalInfo: PersonalInfoObj;
  educationInfo: EducationInfoObj[];
  workInfo: WorkExperienceObj[];
  skillsInfo: SkillsObj[];
  portfolioInfo: PortfolioObj[];
  motivationInfo: MotivationObj;
  referencesInfo: ReferencesObj[];
};
