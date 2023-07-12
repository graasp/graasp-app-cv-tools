import { FC } from 'react';

import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  description: string;
}

const Description: FC<Props> = ({ title, description }) => (
  <Box>
    <Typography variant="h4">{title}</Typography>
    <Typography sx={{ m: '0.5rem' }}>{description}</Typography>
  </Box>
);

export default Description;
