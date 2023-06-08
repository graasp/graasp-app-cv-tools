declare type PersonalInfoObj = {
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

declare type EducationInfoObj = {
  degree: string;
  institutionName: string;
  major: string;
  startDate: Dayjs;
  endDate: Dayjs;
  gpa: string;
  country: string;
};

declare type WorkExperienceObj = {
  jobTitle: string;
  institutionName: string;
  startDate: Dayjs;
  endDate: Dayjs;
  country: string;
  jobDetails: string;
  keyAchievements: string;
};

declare type SkillsObj = {
  skills: string[];
  title: string;
};

declare type PortfolioObj = {
  projectTitle: string;
  projectDescription: string;
  startDate: Dayjs;
  endDate: Dayjs;
  projectLink: string;
};

declare type MotivationObj = {
  motivationLetter: string;
};

declare type ReferencesObj = {
  referenceName: string;
  referenceRelation: string;
  referenceCompany: string;
  referencePhoneNum: string;
  referenceEmail: string;
};

declare type CVInfoObj = {
  personalInfo: PersonalInfoObj;
  educationInfo: EducationInfoObj[];
  workInfo: WorkExperienceObj[];
  skillsInfo: SkillsObj[];
  portfolioInfo: PortfolioObj[];
  motivationInfo: MotivationObj;
  referencesInfo: ReferencesObj[];
};
