import { FC, ReactNode } from 'react';

import { Box } from '@mui/material';

interface Props {
  children: ReactNode;

  stepper: ReactNode;
}
const FormLayout: FC<Props> = ({ children, stepper }: Props) => (
  // check if there is any errors from any section in that appData array of the certain type, based on that, we need to show the errors and the alert message.
  <Box>
    <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
      <Box>{stepper}</Box>
    </Box>
    <Box m={2} p={1} border="1px solid gray" borderRadius={2}>
      {children}
    </Box>
  </Box>
);

export default FormLayout;
