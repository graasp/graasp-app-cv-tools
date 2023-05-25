import React, { FC, ReactNode, useState } from 'react';

import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';

interface Props {
  children: ReactNode;
  activeStep: number;
  steps: string[];
  page: number;
}
const FormLayout: FC<Props> = ({
  children,
  activeStep,
  steps,
  page,
}: Props) => {
  const x = 5;
  return (
    <div className="Main">
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '820px',
          letterSpacing: '0.1px',
          color: '#6200ee',
          display: 'flex',
          alignItems: 'center',
          width: '270px',
          height: '52px',
        }}
      >
        My Items/ CV App - Student Interface
      </div>
      <div
        style={{
          position: 'absolute',
          top: '90px',
          left: '380px',
          borderRadius: '6px',
          backgroundColor: '#fff',
          boxShadow:
            '0px 15.722670555114746px 23.58px rgba(0, 0, 0, 0.06), 0px 1.9653338193893433px 5.9px rgba(0, 0, 0, 0.04), 0px 0px 0.98px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e4e6ea',
          boxSizing: 'border-box',
          width: '1124px',
          height: '180px',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          alignItems: 'center',
          justifyContent: 'flex-start',
          color: '#6b7280',
          fontFamily: 'Inter',
        }}
      >
        <div
          style={{
            alignSelf: 'stretch',
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 0px 0px',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: '8px',
            textAlign: 'right',
          }}
        >
          <Box
            style={{ alignSelf: 'stretch', flex: '1' }}
            sx={{ width: '100%' }}
          >
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '290px',
          left: '450px',
          width: '1001px',
          height: '463px',
          textAlign: 'center',
          color: 'rgba(0, 0, 0, 0.87)',
        }}
      >
        {/* Modify the below sizes to change the sizes of the white box on the screen */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            borderRadius: '4px',
            backgroundColor: '#fff',
            boxShadow:
              '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
            width: '1001px',
            height: '550px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          {/* <div
            style={{
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              // justifyContent: 'right',
              fontSize: '20px',
            }}
          > */}
          {/* <div
            style={{
              width: '283px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '16px',
            }}
          >
            <div
              style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: '2px',
              }}
            > */}
          <div
            style={{
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'right',
              justifyContent: 'right',
              fontSize: '20px',
            }}
          >
            {activeStep === 0 && (
              <>
                <div
                  style={{
                    alignSelf: 'stretch',
                    position: 'relative',
                    letterSpacing: '0.15px',
                    lineHeight: '24px',
                    fontWeight: '500',
                    paddingTop: '10px',
                  }}
                >
                  Get Started
                </div>
                <div
                  style={{
                    alignSelf: 'stretch',
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '16px',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: 'rgba(0, 0, 0, 0.6)',
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
                    Upload your CV/Resume if you have one, or you can create a
                    new one and upload it directly!
                  </div>
                </div>
              </>
            )}
            {activeStep === 1 && (
              <p
                style={{
                  // chagne textAlign value to align the text to desired location on the screen.
                  textAlign: 'right',
                  alignSelf: 'center',
                  justifyContent: 'cetner',
                }}
              >
                hello, this is personal info
              </p>
            )}
            {activeStep === 2 && (
              <p
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'cetner',
                }}
              >
                hello, this is education
              </p>
            )}
            {activeStep === 3 && (
              <p
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'cetner',
                }}
              >
                hello, this is work experience
              </p>
            )}
            {activeStep === 4 && (
              <p
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'cetner',
                }}
              >
                hello, this is skills
              </p>
            )}
            {activeStep === 5 && (
              <p
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'cetner',
                }}
              >
                hello, this is portfolio
              </p>
            )}
            {activeStep === 6 && (
              <p
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'cetner',
                }}
              >
                hello, this is personal motivation
              </p>
            )}
            {activeStep === 7 && (
              <p
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'cetner',
                }}
              >
                hello, this is reference
              </p>
            )}
            {activeStep === 8 && (
              <p
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'cetner',
                }}
              >
                hello, this is template
              </p>
            )}
            {activeStep === 9 && (
              <p
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'cetner',
                }}
              >
                hello, this is review
              </p>
            )}
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              position: 'relative',
              height: '194px',
              display: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                top: '0%',
                right: '0%',
                bottom: '0%',
                left: '0%',
              }}
            />
          </div>
        </div>
      </div>
      <form>{children}</form>
    </div>
  );
};

export default FormLayout;
