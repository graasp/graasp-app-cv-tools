import { FC } from 'react';

import { Document, Image, Page, Text, View } from '@react-pdf/renderer';

import {
  EducationInfoObj,
  MotivationObj,
  PersonalInfoObj,
  PortfolioObj,
  ReferencesObj,
  SkillsObj,
  WorkExperienceObj,
} from '../types';
import Divider from './Divider';

interface Props {
  personalData: PersonalInfoObj;
  educationData: EducationInfoObj[];
  workData: WorkExperienceObj[];
  skillsData: SkillsObj[];
  portfolioData: PortfolioObj[];
  motivationData: MotivationObj;
  referencesData: ReferencesObj[];
}
const FirstTemplate: FC<Props> = ({
  personalData,
  educationData,
  workData,
  skillsData,
  portfolioData,
  motivationData,
  referencesData,
}) => (
  <Document>
    <Page size="A4" style={{ display: 'flex', flexDirection: 'row' }}>
      {/* LEFT SECTION OF THE CV */}
      <View
        style={{
          width: '25%',
          height: '100%',
          backgroundColor: '#084c41',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20',
            marginBottom: '20px',
            height: '150',
            fontFamily: 'Helvetica-Bold',
          }}
        >
          <View
            style={{
              justifyContent: 'center',
            }}
          >
            {personalData.personalPic && (
              <Image
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '90',
                }}
                src={personalData.personalPic}
              />
            )}
            <Text
              style={{
                paddingTop: '10px',
                paddingBottom: '5px',
                fontSize: '14px',
                color: 'white',
              }}
            >
              {personalData.firstName} {personalData.lastName}
            </Text>
            <Text
              style={{
                paddingTop: '10px',
                paddingBottom: '5px',
                fontSize: '8px',
                color: 'white',
              }}
            >
              {personalData.gender} - {personalData.birthDate}
            </Text>
            <Text
              style={{
                paddingTop: '10px',
                paddingBottom: '5px',
                fontSize: '11px',
                color: 'white',
              }}
            >
              {personalData.address}
            </Text>
          </View>
          <View
            style={{
              marginTop: '10px',
              width: '50%',
              height: '1px',
              backgroundColor: '#FFF',
              textAlign: 'center',
            }}
          />
          <Text
            style={{
              paddingTop: '10px',
              paddingBottom: '5px',
              fontSize: '10px',
              color: 'white',
            }}
          >
            {personalData.emailAddress}
          </Text>
          <Text
            style={{
              paddingTop: '10px',
              paddingBottom: '5px',
              fontSize: '14px',
              color: 'white',
            }}
          >
            +{personalData.phoneNum}
          </Text>
          <Text
            style={{
              paddingTop: '10px',
              paddingBottom: '5px',
              fontSize: '14px',
              color: 'white',
            }}
          >
            {personalData.profileLinks}
          </Text>
          <Text
            style={{
              paddingTop: '10px',
              paddingBottom: '5px',
              fontSize: '14px',
              color: 'white',
            }}
          >
            {personalData.personalLink}
          </Text>
        </View>
      </View>
      {/* RIGHT SECTION OF THE CV */}
      <View
        style={{
          margin: 10,
          padding: 10,
          paddingTop: 20,
          width: '75%',
        }}
      >
        <Text>Education</Text>
        <Divider />
        {educationData.map((item, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: '13px' }}>
              {item.major} - {item.institutionName}
            </Text>
            <Text
              style={{ fontSize: '9', color: '#959ba6', paddingBottom: '5' }}
            >
              {item.startDate} - {item.endDate}
            </Text>
            {Object.entries(item)
              .filter(
                ([key]) =>
                  ![
                    'id',
                    'major',
                    'institutionName',
                    'startDate',
                    'endDate',
                  ].includes(key),
              )
              .map(([key, value]) => (
                <View key={key}>
                  <Text style={{ fontSize: '11px' }}>
                    * {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </Text>
                </View>
              ))}
          </View>
        ))}
        <Text>Employment History</Text>
        <Divider />
        {workData.map((item, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            {Object.entries(item)
              .filter(([key]) => key !== 'id') // Exclude the key "id"
              .map(([key, value]) => (
                <View key={key}>
                  <Text style={{ fontSize: '11px' }}>
                    * {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </Text>
                </View>
              ))}
          </View>
        ))}
        <Text>Skills</Text>
        <Divider />
        {skillsData.map(
          (item, index) =>
            item.skills.length > 0 && (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: '12px' }}>
                  * {item.title.charAt(0).toUpperCase() + item.title.slice(1)}:
                </Text>
                {item.skills.map((skill: string, skillIndex: number) => (
                  <Text key={skillIndex} style={{ fontSize: '9px' }}>
                    - {skill}
                  </Text>
                ))}
              </View>
            ),
        )}

        <Text>Portfolio & Projects</Text>
        <Divider />
        {portfolioData.map((item, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            {Object.entries(item)
              .filter(([key]) => key !== 'id') // Exclude the key "id"
              .map(([key, value]) => (
                <View key={key}>
                  <Text style={{ fontSize: '11px' }}>
                    * {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </Text>
                </View>
              ))}
          </View>
        ))}
        <Text>Self-Motivation</Text>
        <Divider />
        <Text>{motivationData.motivationLetter}</Text>
        <Text>References</Text>
        <Divider />
        {referencesData.map((item, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            {Object.entries(item)
              .filter(([key]) => key !== 'id') // Exclude the key "id"
              .map(([key, value]) => (
                <View key={key}>
                  <Text style={{ fontSize: '11px' }}>
                    * {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </Text>
                </View>
              ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default FirstTemplate;
