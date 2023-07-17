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

      test('personalInfo', 'Invalid personal info field rules', () => {
        enforce(dataObj.personalInfo.firstName).isNotEmpty();

        enforce(dataObj.personalInfo.firstName).shorterThan(30);

        enforce(dataObj.personalInfo.lastName).isNotEmpty();

        enforce(dataObj.personalInfo.lastName).shorterThan(30);

        enforce(dataObj.personalInfo.birthDate).isNotEmpty();

        enforce(dataObj.personalInfo.emailAddress).isNotEmpty();

        enforce(dataObj.personalInfo.phoneNum).isNotEmpty();

        enforce(dataObj.personalInfo.profileLinks).isNotEmpty();
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
      if (dataObj.educationInfo.length > 0) {
        test('educationInfo', 'Invalid education info field rules', () => {
          enforce(dataObj.educationInfo[0].degree).isNotEmpty();

          enforce(dataObj.educationInfo[0].institutionName).isNotEmpty();

          enforce(dataObj.educationInfo[0].institutionName).shorterThan(80);

          enforce(dataObj.educationInfo[0].major).isNotEmpty();

          enforce(dataObj.educationInfo[0].major).shorterThan(50);

          enforce(dataObj.educationInfo[0].startDate).isNotEmpty();

          enforce(dataObj.educationInfo[0].endDate).isNotEmpty();

          enforce(dataObj.educationInfo[0].country).isNotEmpty();
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

      if (dataObj.workInfo.length > 0) {
        test('workInfo', 'Invalid work info field rules', () => {
          enforce(dataObj.workInfo[0].jobTitle).isNotEmpty();
          enforce(dataObj.workInfo[0].jobTitle).shorterThan(50);
          enforce(dataObj.workInfo[0].institutionName).isNotEmpty();
          enforce(dataObj.workInfo[0].institutionName).shorterThan(80);
          enforce(dataObj.workInfo[0].jobDetails).isNotEmpty();
          enforce(dataObj.workInfo[0].jobDetails).shorterThan(500);
          enforce(dataObj.workInfo[0].startDate).isNotEmpty();
          enforce(dataObj.workInfo[0].endDate).isNotEmpty();
          enforce(dataObj.workInfo[0].country).isNotEmpty();
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

      if (dataObj.portfolioInfo.length > 0) {
        test('portfolioInfo', 'Invalid portoflio info field rules', () => {
          enforce(dataObj.portfolioInfo[0].projectTitle).isNotEmpty();
          enforce(dataObj.portfolioInfo[0].projectTitle).shorterThan(100);
          enforce(dataObj.portfolioInfo[0].projectDescription).isNotEmpty();
          enforce(dataObj.portfolioInfo[0].projectDescription).shorterThan(500);
          enforce(dataObj.portfolioInfo[0].startDate).isNotEmpty();
          enforce(dataObj.portfolioInfo[0].endDate).isNotEmpty();
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

      if (dataObj.referencesInfo.length > 0) {
        test('referencesInfo', 'Invalid references info field rules', () => {
          enforce(dataObj.referencesInfo[0].referenceName).isNotEmpty();
          enforce(dataObj.referencesInfo[0].referenceName).shorterThan(50);
          enforce(dataObj.referencesInfo[0].referenceRelation).isNotEmpty();
          enforce(dataObj.referencesInfo[0].referenceRelation).shorterThan(30);
          enforce(dataObj.referencesInfo[0].referenceCompany).isNotEmpty();
          enforce(dataObj.referencesInfo[0].referenceCompany).shorterThan(30);
          enforce(dataObj.referencesInfo[0].referenceEmail).isNotEmpty();
          enforce(dataObj.referencesInfo[0].referenceEmail).shorterThan(50);
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
