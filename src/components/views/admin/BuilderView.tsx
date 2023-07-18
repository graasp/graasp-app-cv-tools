import React, { FC, useEffect, useState } from 'react';

import {
  Box,
  MenuItem,
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
  const [groupedObjects, setGroupedObjects] = useState<
    { memberId: string; objects: any[] }[]
  >([]);
  const [selectedType, setSelectedType] = useState('');
  const groupObjectsByMemberId = (): void => {
    const groupedData: { [key: string]: any[] } = {};
    appDataArray.forEach((data) => {
      const { memberId } = data;
      if (memberId in groupedData) {
        groupedData[memberId].push(data);
      } else {
        groupedData[memberId] = [data];
      }
    });

    const groupedObjectsArray = Object.entries(groupedData).map(
      ([memberId, objects]) => ({
        memberId,
        objects,
      }),
    );

    setGroupedObjects(groupedObjectsArray);
  };
  useEffect(() => {
    groupObjectsByMemberId();
  }, []);

  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
  };

  const filteredObjects = groupedObjects.filter((group) =>
    group.objects.some((obj) => obj.type === selectedType),
  );

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
          <MenuItem value="mock_type">Mock Type</MenuItem>
          <MenuItem value="personalInfo">Personal Info</MenuItem>
          <MenuItem value="educationInfo">Education Info</MenuItem>
          <MenuItem value="workInfo">Work Info</MenuItem>
        </Select>
        {filteredObjects.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member ID</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredObjects.map((group) => (
                <TableRow key={group.memberId}>
                  <TableCell>{group.memberId}</TableCell>
                  <TableCell>{group.objects[0].data.content}</TableCell>
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
