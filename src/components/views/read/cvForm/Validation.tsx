import { SuiteRunResult, create, enforce, test } from 'vest';

import { CVInfoObj } from './types';

interface Props {
  type: string;
  data?: CVInfoObj;
}

const Validation = ({ type, data }: Props): SuiteRunResult | null => {
  if (type === 'uploadData' && data) {
    const suite = create((dataObj) => {
      test('personalInfo', 'Personal info is required', () => {
        enforce('personalInfo').isKeyOf(dataObj);
      });

      test('personalInfo', 'Invalid personal info structure', () => {
        enforce('firstName').isKeyOf(dataObj.personalInfo);
        enforce('lastName').isKeyOf(dataObj.personalInfo);
        enforce('birthDate').isKeyOf(dataObj.personalInfo);
        enforce('gender').isKeyOf(dataObj.personalInfo);
        enforce('emailAddress').isKeyOf(dataObj.personalInfo);
        enforce('phonenNum').isKeyOf(dataObj.personalInfo);
        enforce('address').isKeyOf(dataObj.personalInfo);
        enforce('profileLinks').isKeyOf(dataObj.personalInfo);
        enforce('personalLink').isKeyOf(dataObj.personalInfo);
        enforce('personalPic').isKeyOf(dataObj.personalInfo);
        enforce('saved').isKeyOf(dataObj.personalInfo);
      });

      test('educationInfo', 'Education info is required', () => {
        enforce('educationInfo').isKeyOf(dataObj);
      });

      test('educationInfo', 'Invalid education info structure', () => {
        enforce('id').isKeyOf(dataObj.educationInfo);
        enforce('degree').isKeyOf(dataObj.educationInfo);
        enforce('institutionName').isKeyOf(dataObj.educationInfo);
        enforce('major').isKeyOf(dataObj.educationInfo);
        enforce('startDate').isKeyOf(dataObj.educationInfo);
        enforce('endDate').isKeyOf(dataObj.educationInfo);
        enforce('gpa').isKeyOf(dataObj.educationInfo);
        enforce('country').isKeyOf(dataObj.educationInfo);
        enforce('saved').isKeyOf(dataObj.educationInfo);
      });

      test('workInfo', 'Work info is required', () => {
        enforce('workInfo').isKeyOf(dataObj);
      });

      test('workInfo', 'Invalid work info structure', () => {
        enforce('id').isKeyOf(dataObj.workInfo);
        enforce('jobTitle').isKeyOf(dataObj.workInfo);
        enforce('institutionName').isKeyOf(dataObj.workInfo);
        enforce('startDate').isKeyOf(dataObj.workInfo);
        enforce('endDate').isKeyOf(dataObj.workInfo);
        enforce('country').isKeyOf(dataObj.workInfo);
        enforce('jobDetails').isKeyOf(dataObj.workInfo);
        enforce('keyAchievements').isKeyOf(dataObj.workInfo);
        enforce('saved').isKeyOf(dataObj.workInfo);
      });

      test('skillsInfo', 'Skills info is required', () => {
        enforce('skillsInfo').isKeyOf(dataObj);
      });

      test('skillsInfo', 'Invalid skills info structure', () => {
        enforce('skills').isKeyOf(dataObj.skillsInfo);
        enforce('title').isKeyOf(dataObj.skillsInfo);
      });

      test('portfolioInfo', 'Portfolio info is required', () => {
        enforce('portfolioInfo').isKeyOf(dataObj);
      });

      test('portfolioInfo', 'Invalid portoflio info structure', () => {
        enforce('id').isKeyOf(dataObj.portfolioInfo);
        enforce('projectTitle').isKeyOf(dataObj.portfolioInfo);
        enforce('projectDescription').isKeyOf(dataObj.portfolioInfo);
        enforce('startDate').isKeyOf(dataObj.portfolioInfo);
        enforce('endDate').isKeyOf(dataObj.portfolioInfo);
        enforce('projectLink').isKeyOf(dataObj.portfolioInfo);
        enforce('saved').isKeyOf(dataObj.portfolioInfo);
      });

      test('motivationInfo', 'Motivation info is required', () => {
        enforce('motivationInfo').isKeyOf(dataObj);
      });

      test('motivationInfo', 'Invalid motivation info structure', () => {
        enforce('motivationLetter').isKeyOf(dataObj.motivationInfo);
      });

      test('referencesInfo', 'References info is required', () => {
        enforce('referencesInfo').isKeyOf(dataObj);
      });

      test('referencesInfo', 'Invalid references info structure', () => {
        enforce('id').isKeyOf(dataObj.referencesInfo);
        enforce('referenceName').isKeyOf(dataObj.referencesInfo);
        enforce('referenceRelation').isKeyOf(dataObj.referencesInfo);
        enforce('referenceCompany').isKeyOf(dataObj.referencesInfo);
        enforce('referencePhoneNum').isKeyOf(dataObj.referencesInfo);
        enforce('referenceEmail').isKeyOf(dataObj.referencesInfo);
        enforce('saved').isKeyOf(dataObj.referencesInfo);
      });

      test('cvStatusInfo', 'CV status info is required', () => {
        enforce('cvStatusInfo').isKeyOf(dataObj);
      });

      test('cvStatusInfo', 'Invalid cv status info structure', () => {
        enforce('selectedTemplateId').isKeyOf(dataObj.cvStatusInfo);
        enforce('customCv').isKeyOf(dataObj.cvStatusInfo);
        enforce('fileUrl').isKeyOf(dataObj.cvStatusInfo);
      });
    });
    const result = suite(data);
    return result;
  }

  return null;
};

export default Validation;
