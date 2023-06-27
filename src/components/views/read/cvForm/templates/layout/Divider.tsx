import { FC } from 'react';

import { View } from '@react-pdf/renderer';

const Divider: FC = () => (
  <View
    style={{
      marginTop: '10px',
      width: '50%',
      height: '1px',
      backgroundColor: '#000',
      textAlign: 'center',
    }}
  />
);

export default Divider;
