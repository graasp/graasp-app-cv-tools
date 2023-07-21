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

import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import { useAppDataContext } from '../../context/AppDataContext';
import DataFilter from './DataFilter';
import { CandidateRateObj } from './types';

const BuilderView: FC = () => {
  const { postAppData, patchAppData, appDataArray } = useAppDataContext();
  const handlePatch = (
    dataObj: AppData['id'],
    newData: CandidateRateObj,
  ): void => {
    patchAppData({ id: dataObj, data: newData });
  };
  const handlePost = (newdata: CandidateRateObj): void => {
    postAppData({ data: newdata, type: APP_DATA_TYPES.CANDIDATE_RATE_INFO });
  };
  const groupedData = appDataArray.groupBy((data) => data.type).toJS();
  const [selectedType, setSelectedType] = useState('');
  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
  };
  const dataArray: any[] = Object.keys(groupedData)
    .filter((key) => key === selectedType)
    .map((key) => groupedData[key]);
  const dimensions = [
    { value: 'mock_type', label: 'Mock Info' },
    { value: 'personalInfo', label: 'Personal Info' },
    { value: 'educationInfo', label: 'Education Info' },
    { value: 'workInfo', label: 'Work Info' },
    { value: 'skillsInfo', label: 'Skills Info' },
    { value: 'portfolioInfo', label: 'Portfolio Info' },
    { value: 'motivationInfo', label: 'Self-Motivation' },
  ];

  // Construct the 'cv' object with filtered and grouped data
  const cv: { [key: string]: { [key: string]: any } } = {};

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
      if (memberId in cv) {
        cv[memberId][type] = typeDataByMemberId[memberId].map(
          (item) => item.data,
        );
      } else {
        cv[memberId] = {
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
  const handleDownload = (): void => {
    const x = 'Downloaded';
    // eslint-disable-next-line no-console
    console.log(x);
  };
  const handleView = (): void => {
    const x = 'Viewed';
    // eslint-disable-next-line no-console
    console.log(x);
  };
  return (
    <Box>
      <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
        <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
          {Object.keys(cv).map((memberId) => (
            <Box key={memberId} display="flex" alignItems="center">
              <Typography>{memberId}</Typography>
              <IconButton onClick={handleDownload}>
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={handleView}>
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
          {dimensions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
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
              {dataArray.map((dataObject, index) => (
                <React.Fragment key={index}>
                  {dataObject.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.memberId}</TableCell>
                      <TableCell>{item.data.content}</TableCell>
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
