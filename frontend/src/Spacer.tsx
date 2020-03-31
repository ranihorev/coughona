/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';

export const Spacer: React.FC<{ height?: number; width?: number }> = ({ width, height }) => {
  return <div css={{ width, height }} />;
};
