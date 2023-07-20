import React, { FC, useState } from 'react';

import {
  Box,
  MenuItem,
  Rating,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { useAppDataContext } from '../../context/AppDataContext';

const BuilderView: FC = () => {
  const { postAppData, patchAppData, appDataArray } = useAppDataContext();
  const groupedData = appDataArray.groupBy((data) => data.type).toJS();
  const [selectedType, setSelectedType] = useState('');
  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
  };
  const dataArray: any[] = Object.keys(groupedData)
    .filter((key) => key === selectedType)
    .map((key) => groupedData[key]);
  console.log(dataArray);

  const [ratings, setRatings] = useState<{ [key: string]: number | null }>({});
  const dimensions = [
    { value: 'mock_type', label: 'Mock Info' },
    { value: 'personalInfo', label: 'Personal Info' },
    { value: 'educationInfo', label: 'Education Info' },
    { value: 'workInfo', label: 'Work Info' },
    { value: 'skillsInfo', label: 'Skills Info' },
    { value: 'portfolioInfo', label: 'Portfolio Info' },
    { value: 'motivationInfo', label: 'Self-Motivation' },
  ];
  return (
    <Box>
      <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
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
