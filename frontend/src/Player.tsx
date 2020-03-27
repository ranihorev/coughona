/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Howl } from 'howler';

export const Player: React.FC = () => {
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
      <input
        type="file"
        name="files[]"
        onChange={e => {
          const { files } = e.target;
          if (files?.[0]) {
            const reader = new FileReader();
            reader.onload = () => {
              const sound = new Howl({
                src: [reader.result as string],
              });
              sound.play();
            };
            reader.readAsText(files[0]);
          }
        }}
        style={{ marginBottom: 10 }}
      />
    </div>
  );
};
