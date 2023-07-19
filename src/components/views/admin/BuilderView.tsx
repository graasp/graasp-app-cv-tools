import { List } from 'immutable';

import { FC, useState } from 'react';

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
  const { appDataArray } = useAppDataContext();
  const groupObjectsByMemberId = (): List<{
    memberId: string;
    objects: any[];
  }> => {
    const groupedData = appDataArray.groupBy((data) => data.memberId);

    const groupedObjectsArray = groupedData
      .entrySeq()
      .map(([memberId, objects]) => ({
        memberId,
        objects: objects.toArray(),
      }));

    return List(groupedObjectsArray);
  };

  const groupedObjects = groupObjectsByMemberId();

  const [selectedType, setSelectedType] = useState('');

  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
  };

  const filteredObjects = groupedObjects.filter((group) =>
    group.objects.some((obj) => obj.type === selectedType),
  );
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
        {filteredObjects.size > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member ID</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredObjects.map((group) => (
                <TableRow key={group.memberId}>
                  <TableCell>{group.memberId}</TableCell>
                  <TableCell>{group.objects[0].data.content}</TableCell>
                  <TableCell>
                    <Rating
                      value={ratings[group.memberId] || null}
                      onChange={(event, newValue) => {
                        setRatings((prevRatings) => ({
                          ...prevRatings,
                          [group.memberId]: newValue,
                        }));
                      }}
                      size="medium"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default BuilderView;
