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
        enforce('phoneNum').isKeyOf(dataObj.personalInfo);
        enforce('address').isKeyOf(dataObj.personalInfo);
        enforce('profileLinks').isKeyOf(dataObj.personalInfo);
        enforce('personalLink').isKeyOf(dataObj.personalInfo);
        enforce('personalPic').isKeyOf(dataObj.personalInfo);
        enforce('saved').isKeyOf(dataObj.personalInfo);
      });

      test('educationInfo', 'Education info is required', () => {
        enforce('educationInfo').isKeyOf(dataObj);
      });

      if (dataObj.educationInfo.length > 0) {
        test('educationInfo', 'Invalid education info structure', () => {
          enforce('id').isKeyOf(dataObj.educationInfo[0]);
          enforce('degree').isKeyOf(dataObj.educationInfo[0]);
          enforce('institutionName').isKeyOf(dataObj.educationInfo[0]);
          enforce('major').isKeyOf(dataObj.educationInfo[0]);
          enforce('startDate').isKeyOf(dataObj.educationInfo[0]);
          enforce('endDate').isKeyOf(dataObj.educationInfo[0]);
          enforce('gpa').isKeyOf(dataObj.educationInfo[0]);
          enforce('country').isKeyOf(dataObj.educationInfo[0]);
          enforce('saved').isKeyOf(dataObj.educationInfo[0]);
        });
      }

      test('workInfo', 'Work info is required', () => {
        enforce('workInfo').isKeyOf(dataObj);
      });

      if (dataObj.workInfo.length > 0) {
        test('workInfo', 'Invalid work info structure', () => {
          enforce('id').isKeyOf(dataObj.workInfo[0]);
          enforce('jobTitle').isKeyOf(dataObj.workInfo[0]);
          enforce('institutionName').isKeyOf(dataObj.workInfo[0]);
          enforce('startDate').isKeyOf(dataObj.workInfo[0]);
          enforce('endDate').isKeyOf(dataObj.workInfo[0]);
          enforce('country').isKeyOf(dataObj.workInfo[0]);
          enforce('jobDetails').isKeyOf(dataObj.workInfo[0]);
          enforce('keyAchievements').isKeyOf(dataObj.workInfo[0]);
          enforce('saved').isKeyOf(dataObj.workInfo[0]);
        });
      }

      test('skillsInfo', 'Skills info is required', () => {
        enforce('skillsInfo').isKeyOf(dataObj);
      });

      if (dataObj.skillsInfo.length > 0) {
        test('skillsInfo', 'Invalid skills info structure', () => {
          enforce('skills').isKeyOf(dataObj.skillsInfo[0]);
          enforce('title').isKeyOf(dataObj.skillsInfo[0]);
        });
      }

      test('portfolioInfo', 'Portfolio info is required', () => {
        enforce('portfolioInfo').isKeyOf(dataObj);
      });

      if (dataObj.portfolioInfo.length > 0) {
        test('portfolioInfo', 'Invalid portoflio info structure', () => {
          enforce('id').isKeyOf(dataObj.portfolioInfo[0]);
          enforce('projectTitle').isKeyOf(dataObj.portfolioInfo[0]);
          enforce('projectDescription').isKeyOf(dataObj.portfolioInfo[0]);
          enforce('startDate').isKeyOf(dataObj.portfolioInfo[0]);
          enforce('endDate').isKeyOf(dataObj.portfolioInfo[0]);
          enforce('projectLink').isKeyOf(dataObj.portfolioInfo[0]);
          enforce('saved').isKeyOf(dataObj.portfolioInfo[0]);
        });
      }

      test('motivationInfo', 'Motivation info is required', () => {
        enforce('motivationInfo').isKeyOf(dataObj);
      });

      test('motivationInfo', 'Invalid motivation info structure', () => {
        enforce('motivationLetter').isKeyOf(dataObj.motivationInfo);
      });

      test('referencesInfo', 'References info is required', () => {
        enforce('referencesInfo').isKeyOf(dataObj);
      });

      if (dataObj.referencesInfo.length > 0) {
        test('referencesInfo', 'Invalid references info structure', () => {
          enforce('id').isKeyOf(dataObj.referencesInfo[0]);
          enforce('referenceName').isKeyOf(dataObj.referencesInfo[0]);
          enforce('referenceRelation').isKeyOf(dataObj.referencesInfo[0]);
          enforce('referenceCompany').isKeyOf(dataObj.referencesInfo[0]);
          enforce('referencePhoneNum').isKeyOf(dataObj.referencesInfo[0]);
          enforce('referenceEmail').isKeyOf(dataObj.referencesInfo[0]);
          enforce('saved').isKeyOf(dataObj.referencesInfo[0]);
        });
      }

      test('cvStatusInfo', 'CV status info is required', () => {
        enforce('cvStatusInfo').isKeyOf(dataObj);
      });

      test('cvStatusInfo', 'Invalid cv status info structure', () => {
        enforce('selectedTemplateId').isKeyOf(dataObj.cvStatusInfo);
        enforce('customCv').isKeyOf(dataObj.cvStatusInfo);
        enforce.optional('fileUrl').isKeyOf(dataObj.cvStatusInfo);
      });
    });
    const result = suite(data);
    return result;
  }

  return null;
};

export default Validation;
