declare module 'react-mic' {
  import React from 'react';

  export class ReactMic extends React.PureComponent<ReactMicProps> {}

  /**
   * The object sent when the recording stops
   */
  export interface ReactMicStopEvent {
    blob: Blob;
    startTime: number;
    stopTime: number;
    option: {
      audioBitsPerSecond: number;
      mimeType: string;
    };
    blobURL: string;
  }

  export interface ReactMicProps {
    /** Set to true to begin recording */
    record?: boolean;

    /** Available in React-Mic-Plus upgrade only */
    pause?: boolean;

    visualSetting?: 'sinewave' | 'frequencyBars';

    className?: string;

    /** Callback that is executed when audio stops recording */
    onStop?: (recordedData: ReactMicStopEvent) => void;

    /** Callback that is executed when chunk of audio is available */
    onData?: (recordedData: Blob) => void;

    /** Sound wave color */
    strokeColor?: string;

    /** Background color */
    backgroundColor?: string;
    channelCount?: number;

    mimeType?: string;
  }
}
