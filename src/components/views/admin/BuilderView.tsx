import React, { FC, useState } from 'react';

import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import { IconButton, Rating } from '@mui/material';

interface ListItemProps {
  cv: string;
}
const ListItem = ({ cv }: ListItemProps): JSX.Element => {
  // todo: implement the logic
  const handleDownload = (): void => {
    const x = 'Downloaded';
    // eslint-disable-next-line no-console
    console.log(x);
  };
  // todo: implement the logic
  const handleView = (): void => {
    const x = 'Viewed';
    // eslint-disable-next-line no-console
    console.log(x);
  };
  const [rating, setRating] = useState<number | null>(2);
  return (
    <li>
      {cv}
      <IconButton onClick={handleDownload}>
        <DownloadIcon />
      </IconButton>
      <IconButton onClick={handleView}>
        <PreviewIcon />
      </IconButton>
      <Rating
        name={`rating-${cv}`}
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
        size="medium"
      />
    </li>
  );
};
const BuilderView: FC = () => {
  const cvList = ['CV 1', 'CV 2', 'CV 3', 'CV 4', 'CV 5'];
  const cvItems = cvList.map((cv, index) => <ListItem key={index} cv={cv} />);
  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '1160px',
          textAlign: 'left',
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.87)',
          fontFamily: 'Roboto',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '201px',
            left: '335px',
            borderRadius: '4px',
            backgroundColor: '#fff',
            boxShadow:
              '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
            width: '1072px',
            height: '946px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            textAlign: 'center',
            fontSize: '20px',
          }}
        >
          <div
            style={{
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'row',
              padding: '16px',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              textAlign: 'left',
              fontSize: 'inherit',
              color: 'rgba(0, 0, 0, 0.6)',
              fontFamily: 'inherit',
            }}
          >
            <div
              style={{
                flex: '1',
                position: 'relative',
                letterSpacing: '0.25px',
                lineHeight: '20px',
              }}
            >
              <p style={{ margin: '0' }}>&nbsp;</p>
              <ul style={{ margin: '0', paddingLeft: '19px' }}>{cvItems}</ul>
              <div
                style={{
                  position: 'absolute',
                  top: '250px',
                  left: '150px',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  boxShadow:
                    '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
                  width: '800px',
                  height: '650px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  textAlign: 'center',
                  fontSize: '20px',
                }}
              >
                <p>CV HERE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 147px)',
          left: 'calc(50% - 166px)',
          width: '614px',
          height: '538px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            left: '-450px',
            letterSpacing: '0.1px',
            color: '#6200ee',
            display: 'flex',
            alignItems: 'center',
            width: '251px',
            height: '52px',
          }}
        >
          My Items/ CV App - Reviewer Interface
        </div>
      </div>
    </div>
  );
};

export default BuilderView;
