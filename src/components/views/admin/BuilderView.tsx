import saveAs from 'file-saver';
import JSZip from 'jszip';

import React, { FC, useState } from 'react';

import { AppData } from '@graasp/apps-query-client/dist/types';

import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  IconButton,
  MenuItem,
  Rating,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { pdf } from '@react-pdf/renderer';

import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import { useAppDataContext } from '../../context/AppDataContext';
import { TEMPLATES } from '../read/cvForm/constants';
import FirstTemplate from '../read/cvForm/templates/FirstTemplate';
import DataFilter from './DataFilter';
import { CandidateRateObj } from './types';

const BuilderView: FC = () => {
  const { postAppData, patchAppData, appDataArray } = useAppDataContext();
  const handlePatch = (id: AppData['id'], newData: CandidateRateObj): void => {
    patchAppData({ id, data: newData });
  };
  const handlePost = (newdata: CandidateRateObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.CANDIDATE_RATE_INFO });
  };
  const groupedData = appDataArray.groupBy((data) => data.type).toJS() as {
    [key: string]: AppData[];
  };
  const [selectedType, setSelectedType] = useState('');
  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
  };
  const dataArray: AppData[] | undefined = groupedData[selectedType];
  const dimensions = [
    { value: 'mock_type', label: 'Mock Info' },
    { value: 'personalInfo', label: 'Personal Info' },
    { value: 'educationInfo', label: 'Education Info' },
    { value: 'workInfo', label: 'Work Info' },
    { value: 'skillsInfo', label: 'Skills Info' },
    { value: 'projectsInfo', label: 'Projects Info' },
    { value: 'motivationInfo', label: 'Self-Motivation' },
    { value: 'referencesInfo', label: 'References Info' },
    { value: 'cvStatusInfo', label: '' },
  ];

  // Construct the 'cv' object with filtered and grouped data
  const candidatesCv: { [key: string]: { [key: string]: any } } = {};

  dimensions.forEach((dimension) => {
    const type = dimension.value;
    const dataObj = Object.keys(groupedData)
      .filter((key) => key === type)
      .map((key) => groupedData[key]);

    const typeDataByMemberId = DataFilter({
      dataObject: dataObj,
      targetType: type,
    });

    Object.keys(typeDataByMemberId).forEach((memberId) => {
      if (memberId in candidatesCv) {
        candidatesCv[memberId][type] = typeDataByMemberId[memberId].map(
          (item) => item.data,
        );
      } else {
        candidatesCv[memberId] = {
          [type]: typeDataByMemberId[memberId].map((item) => item.data),
        };
      }
    });
  });

  const [ratings, setRatings] = useState<{ [key: string]: number | null }>({});
  const handleRatingChange = (
    memberId: string,
    newRating: number | null,
  ): void => {
    const rateData = appDataArray.find(
      (data) =>
        data.data.memberId === memberId && data.type === 'candidateRateInfo',
    );
    if (rateData) {
      handlePatch(rateData.id, {
        ...rateData.data,
        rating: newRating,
        memberId,
      });
    } else {
      handlePost({ memberId, rating: newRating });
    }
    setRatings((prevRatings) => ({
      ...prevRatings,
      [memberId]: newRating,
    }));
  };

  const handleDownload = async (memberId: string): Promise<void> => {
    const candidateCvData = candidatesCv[memberId];
    if (!candidateCvData.cvStatusInfo.customCv) {
      const { component: CvTemplate } = TEMPLATES.find(
        (t) => t.id === candidateCvData.cvStatusInfo.selectedTemplateId,
      ) || { component: FirstTemplate };
      const renderedTemplate = <CvTemplate cvValues={candidateCvData} />;
      const pdfBlob = await pdf(renderedTemplate).toBlob();
      saveAs(pdfBlob, 'generated-cv.pdf');
    } else if (candidateCvData.cvStatusInfo.customCv) {
      const uploadedFile = candidateCvData.cvStatusInfo.fileUrl;
      const response = await fetch(uploadedFile);
      const uploadedFileBlob = await response.blob();
      saveAs(uploadedFileBlob, 'custom-cv.pdf');
    }
  };
  const [visibility, setVisibility] = useState<string | null>(null);
  const [renderedFile, setRenderedFile] = useState<string | null>(null);
  const handleView = async (memberId: string): Promise<void> => {
    if (visibility === memberId) {
      setVisibility(null);
      setRenderedFile(null);
    } else {
      const candidateCvData = candidatesCv[memberId];
      if (!candidateCvData.cvStatusInfo.customCv) {
        const { component: CvTemplate } = TEMPLATES.find(
          (t) => t.id === candidateCvData.cvStatusInfo.selectedTemplateId,
        ) || { component: FirstTemplate };
        const fileToRender = <CvTemplate cvValues={candidateCvData} />;
        const pdfBlob = await pdf(fileToRender).toBlob();
        const dataUrl = URL.createObjectURL(pdfBlob);
        setRenderedFile(dataUrl);
        window.open(dataUrl, '_blank');
      } else if (candidateCvData.cvStatusInfo.customCv) {
        const uploadedCv = candidateCvData.cvStatusInfo.fileUrl;
        const response = await fetch(uploadedCv);
        const uploadedFileBlob = await response.blob();
        const dataUrl = URL.createObjectURL(uploadedFileBlob);
        setRenderedFile(dataUrl);
        window.open(dataUrl, '_blank');
      }
      setVisibility(memberId);
    }
  };
  const handleDownloadAll = async (): Promise<void> => {
    const zip = new JSZip();
    const candidateIds = Object.keys(candidatesCv);

    // Use Promise.all with map to wait for all async operations to complete
    await Promise.all(
      candidateIds.map(async (memberId) => {
        const candidateCvData = candidatesCv[memberId];
        if (!candidateCvData.cvStatusInfo.customCv) {
          const { component: CvTemplate } = TEMPLATES.find(
            (t) => t.id === candidateCvData.cvStatusInfo.selectedTemplateId,
          ) || { component: FirstTemplate };
          const renderedTemplate = <CvTemplate cvValues={candidateCvData} />;
          const pdfBlob = await pdf(renderedTemplate).toBlob();
          zip.file(`${memberId}-generated-cv.pdf`, pdfBlob);
        } else if (candidateCvData.cvStatusInfo.customCv) {
          const uploadedFile = candidateCvData.cvStatusInfo.fileUrl;
          const response = await fetch(uploadedFile);
          const uploadedFileBlob = await response.blob();
          zip.file(`${memberId}-custom-cv.pdf`, uploadedFileBlob);
        }
      }),
    );

    // Generate the Zip archive and trigger the download
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'candidates-cv.zip');
    });
  };
  return (
    <Box>
      <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
        <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
          <Box display="flex" alignItems="center">
            <Typography>Download All Candidates CVs</Typography>
            <IconButton onClick={() => handleDownloadAll()}>
              <DownloadIcon />
            </IconButton>
          </Box>
          {Object.keys(candidatesCv).map((memberId) => (
            <Box key={memberId} display="flex" alignItems="center">
              <Typography flex={1}>{memberId}</Typography>
              <IconButton onClick={() => handleDownload(memberId)}>
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={() => handleView(memberId)}>
                <VisibilityIcon />
              </IconButton>
              <Rating
                name={`rating-${memberId}`}
                value={ratings[memberId] || 0}
                onChange={(event, newValue) =>
                  handleRatingChange(memberId, newValue)
                }
                size="medium"
              />
            </Box>
          ))}
        </Box>
        <Select
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          displayEmpty
          sx={{ mr: 2 }}
        >
          <MenuItem value="" disabled>
            Select Type
          </MenuItem>
          {dimensions.map((option) =>
            option.value === 'cvStatusInfo' ? null : (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ),
          )}
        </Select>
        {dataArray.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member ID</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataArray?.map((dataObject, index) => (
                <React.Fragment key={index}>
                  {Array.isArray(dataObject) &&
                    dataObject.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.memberId}</TableCell>
                        <TableCell>{item.data}</TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default BuilderView;
