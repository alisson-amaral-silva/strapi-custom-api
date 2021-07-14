/**
 *
 * LeftMenuFooter
 *
 */

import React from 'react';
import { PropTypes } from 'prop-types';

import Wrapper from './Wrapper';

function LeftMenuFooter() {
  // PROJECT_TYPE is an env variable defined in the webpack config
  // eslint-disable-next-line no-undef

  return (
    <Wrapper>
      <div className='poweredBy'>
        <a
          key='website'
          href='https://github.com/alisson-amaral-silva'
          target='_blank'
          rel='noopener noreferrer'
        >
          Created by Alisson Alcântara Amaral
        </a>
        &nbsp;
      </div>
    </Wrapper>
  );
}

export default LeftMenuFooter;
