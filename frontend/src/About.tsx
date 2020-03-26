/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';

export const About: React.FC = () => {
  return (
    <div
      css={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <div css={{ maxWidth: 800, padding: 30, overflow: 'auto', fontSize: 16, textAlign: 'left', lineHeight: 1.5 }}>
        <p>
          Coughona was created with the vision that simple, quick, and at-home risk assessments of COVID-19 should be
          available to all. Since right now there aren't enough COVID-19 test kits for the masses, we are exploring an
          alternative way to assess risk for COVID-19.
        </p>
        <p>
          Recent{' '}
          <Link href="https://www.scihive.org/collection/5e7be8b6debc5169f3bceb2e/" target="_blank">
            studies
          </Link>{' '}
          have shown that deep learning can identify lung diseases including flu, bronchiolitis and pneumonia. We
          believe the same may hold true for COVID-19.
        </p>
        <p>
          Our vision is to collect the biggest database of COVID-19 coughs and symptoms, allowing us to build an AI
          algorithm to predict COVID-19 risk from the comfort of your home.
        </p>
        <p>
          We are a group of entrepreneurs and researchers that specialize in healthcare and technology, and are hoping
          that this tool can make a small difference in addressing this global epidemic.
        </p>
        <p>
          For more questions or comments, feel free to contact us at{' '}
          <Link href="mailto:info@coughona.com" target="_blank">
            info@coughona.com
          </Link>
          .
        </p>
        <p>
          Wishing you all good health, <br />
          <Link href="https://www.linkedin.com/in/yaronhadad/" target="_blank">
            Yaron
          </Link>
          ,{' '}
          <Link href="https://www.linkedin.com/in/lautman/" target="_blank">
            Ziv
          </Link>
          , Dvir, Idan, Tyler and{' '}
          <Link href="https://www.linkedin.com/in/rani-horev/" target="_blank">
            Rani
          </Link>
        </p>
        <div>
          <Link component={RouterLink} to="/">
            Back to Survey
          </Link>
        </div>
      </div>
    </div>
  );
};
