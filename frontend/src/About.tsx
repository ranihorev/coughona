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
            Coughona was created with the vision that simple, quick and home-based risk assessments of COVID-19 should
            be available to all. Since right now there aren't enough COVID-19 test kits for the masses, we are exploring
            an alternative way to test for COVID-19.
          </p>
          <p>
            Studies showed that AI, specifically Deep Learning, is very effective at identifying various sort of lung
            related diseases like the flu, bronchiolitis and pneumonia. There is a good chance the same holds true for
            COVID-19.
          </p>
          <p>
            Our vision is to collect the biggest database of COVID-19 coughs together with a related questionnaire, in
            order to build the first AI algorithm that can predict COVID-19 from the comfort of your home.
          </p>
          <p>
            We are a group of entrepreneurs and researchers that specialize in healthcare and technology, and are hoping
            that this tool can make a small difference in addressing this global epidemic.
          </p>
          <p>
            For more questions or comments, feel free to contact us at
            <Link href="mailto:info@coughona.com" target="_blank">
              info@coughona.com
            </Link>
            .
          </p>
          <p>Wishing you all good health, <br />
            Yaron, Ziv, Dvir, Idan, Tyler and Rani
           
          </p>
          <div>
            <Link component={RouterLink} to="/">
              Back to Survey
            </Link>
          </div>
        </div>
      </div>
    );
}