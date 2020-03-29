/** @jsx jsx */
import { jsx, keyframes } from '@emotion/core';
import { Button, CircularProgress, LinearProgress, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import * as Sentry from '@sentry/browser';
import Axios from 'axios';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const blinking = keyframes`
  0% {
    background-color: rgba(255,0,0,1);
  }
  50% {
    background-color: rgba(255,0,0,0.1);
  }
  100% {
    background-color: rgba(255,0,0,1);
  }
`;

export type CaptureState = 'Empty' | 'Starting' | 'Recording' | 'Stop' | 'Finished';
type PreCaptureFinishedState = Exclude<CaptureState, 'Finished'>;
type UploadState = 'Waiting' | 'Uploading' | 'Finished' | 'Failed';
type PreUploadFinishedState = Exclude<UploadState, 'Finished'>;

interface DataEvent extends Event {
  data: Blob;
}
const isDataEvent = (e: Event): e is DataEvent => {
  if (e.hasOwnProperty('data')) {
    return true;
  }
  return false;
};

export const Recorder: React.FC<{ uid: string }> = ({ uid }) => {
  const [recordingState, setRecordingState] = React.useState<CaptureState>('Empty');
  const [uploadState, setUploadState] = React.useState<UploadState>('Waiting');
  const [chunks, setChunks] = React.useState<Blob | undefined>();
  const recorder = React.useRef<MediaRecorder>();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!recorder.current) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        recorder.current = new MediaRecorder(stream);
      });
    }
  }, []);

  React.useEffect(() => {
    if (recordingState === 'Starting') {
      if (!recorder.current) throw Error('Recorder should be initialized');
      recorder.current.addEventListener('dataavailable', e => {
        if (isDataEvent(e)) {
          setChunks(e.data);
        } else {
          throw new Error('Data is missing in recording');
        }
      });
      setRecordingState('Recording');
      recorder.current.start();
    } else if (recordingState === 'Stop') {
      if (!recorder.current) throw Error('Recorder should be initialized');
      recorder.current.stop();
      setRecordingState('Finished');
    }
  }, [recordingState]);

  if (uploadState === 'Finished') {
    return <div css={{ textAlign: 'center', fontSize: 28, fontWeight: 700 }}>Thank you for participating!</div>;
  }

  return (
    <React.Fragment>
      {recordingState !== 'Finished' ? (
        <React.Fragment>
          <CaptureButton {...{ state: recordingState, setState: setRecordingState }} />
          <CaptureProgress {...{ state: recordingState, setState: setRecordingState }} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div css={{ textAlign: 'center', fontSize: 20, fontWeight: 700, paddingBottom: 6 }}>{t('thanks')}</div>
          <Typography css={{ textAlign: 'center' }}>{t('tap to upload')}</Typography>
          <div css={{ height: 20 }} />
          {chunks ? (
            <Uploader uid={uid} data={chunks} state={uploadState} setState={setUploadState} />
          ) : (
            'Failed to store data :('
          )}
          <div css={{ height: 60 }} />
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              '@media (max-width: 767px)': { alignSelf: 'flex-start', justifyContent: 'space-between', width: '100%' },
            }}
          >
            <Typography style={{ fontSize: 14 }}>{t('want to listen')}</Typography>
            <div css={{ width: 10 }} />
            {chunks ? <ReplayRecording data={chunks} /> : 'Failed to load recording'}
          </div>
          <div css={{ height: 20 }} />
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              '@media (max-width: 767px)': { alignSelf: 'flex-start', justifyContent: 'space-between', width: '100%' },
            }}
          >
            <Typography style={{ fontSize: 14 }}>{t('want new recording')}</Typography>
            <div css={{ width: 10 }} />
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => {
                setChunks(undefined);
                setRecordingState('Starting');
              }}
              css={{ whiteSpace: 'nowrap' }}
            >
              {t('restart')}{' '}
              <span css={{ paddingLeft: 5, fontSize: 18, lineHeight: 1, marginTop: -2, color: 'red' }}>●</span>
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const Uploader: React.FC<{
  data: Blob;
  uid: string;
  state: PreUploadFinishedState;
  setState: React.Dispatch<React.SetStateAction<UploadState>>;
}> = ({ data, uid, state, setState }) => {
  const { t } = useTranslation();

  const uploadStateToElement: { [state in PreUploadFinishedState]: React.ReactChild } = {
    Waiting: (
      <React.Fragment>
        {t('start upload')} <SendIcon fontSize="small" css={{ marginLeft: 10 }} />
      </React.Fragment>
    ),
    Uploading: (
      <React.Fragment>
        {t('uploading')} <CircularProgress css={{ marginLeft: 10 }} size={16} />
      </React.Fragment>
    ),
    Failed: <React.Fragment>{t('try again')}</React.Fragment>,
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      disabled={state === 'Uploading'}
      onClick={async () => {
        setState('Uploading');
        const reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = async () => {
          const dest = `${process.env.REACT_APP_BACKEND_URL}/upload`;
          var formData = new FormData();
          formData.append('file', reader.result as string);
          formData.append('user', uid);
          try {
            await Axios({ method: 'POST', url: dest, data: formData });
            setState('Finished');
          } catch (e) {
            setState('Failed');
            toast.error(t('failed to upload'), {
              position: toast.POSITION.BOTTOM_LEFT,
            });
            Sentry.captureException(e);
            console.error(e);
          }
        };
      }}
    >
      {uploadStateToElement[state]}
    </Button>
  );
};

const ReplayRecording: React.FC<{ data: Blob }> = ({ data }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const { t } = useTranslation();
  const howler = React.useRef(
    new Howl({
      src: [URL.createObjectURL(data)],
      format: 'wav',
    }),
  );
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        size="small"
        color="primary"
        onClick={() => {
          if (!isPlaying) {
            howler.current.play();
            setIsPlaying(true);
          } else {
            howler.current.stop();
            setIsPlaying(false);
          }
        }}
      >
        {isPlaying ? t('stop') : t('play')} <span css={{ paddingLeft: 5, fontSize: 10, color: 'black' }}>▶</span>
      </Button>
    </React.Fragment>
  );
};

const CaptureProgress: React.FC<{
  state: PreCaptureFinishedState;
  setState: React.Dispatch<React.SetStateAction<CaptureState>>;
}> = ({ state, setState }) => {
  const timeSec = 10000;
  const interval = 500;
  const [counter, setCounter] = React.useState(timeSec);
  const isRecording = state === 'Recording';
  React.useEffect(() => {
    if (state !== 'Recording') return () => {};
    if (counter <= 0) {
      setState('Stop');
      return () => {};
    }
    const timer = setInterval(() => setCounter(counter - interval), interval);
    return () => clearInterval(timer);
  }, [setState, counter, state]);

  return (
    <div css={{ width: 200, height: 80, marginTop: 20 }}>
      {isRecording && counter > 0 && (
        <LinearProgress
          variant="determinate"
          value={(100 * (timeSec - counter)) / timeSec}
          css={{ color: 'red !important' }}
        />
      )}
    </div>
  );
};

const CaptureButton: React.FC<{
  state: PreCaptureFinishedState;
  setState: React.Dispatch<React.SetStateAction<CaptureState>>;
}> = ({ state, setState }) => {
  const { t } = useTranslation();
  const recordingStateToElement: { [state in PreCaptureFinishedState]: React.ReactChild } = {
    Empty: <React.Fragment>{t('start recording')}</React.Fragment>,
    Starting: 'Initialized',
    Recording: (
      <div css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {t('stop recording')}
        <div
          css={{ animation: `${blinking} 1s ease infinite`, marginLeft: 10, height: 12, width: 12, borderRadius: 999 }}
        ></div>
      </div>
    ),
    Stop: 'Stopping',
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={() => {
        if (state === 'Empty') {
          setState('Starting');
        }
        if (state === 'Recording') {
          setState('Stop');
        }
      }}
      disabled={state !== 'Empty' && state !== 'Recording'}
    >
      {recordingStateToElement[state]}
    </Button>
  );
};
