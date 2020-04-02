/** @jsx jsx */
import { jsx, keyframes } from '@emotion/core';
import { Button, CircularProgress, LinearProgress, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import * as Sentry from '@sentry/browser';
import Axios from 'axios';
import React from 'react';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spacer } from './Spacer';

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

export type CaptureState = 'Empty' | 'Starting' | 'Recording' | 'Stop' | 'Finished' | 'NoPermissions';
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

const setupRecorder = (setRecordingState: React.Dispatch<React.SetStateAction<CaptureState>>, shouldStart: boolean) => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => {
      recorder = new MediaRecorder(stream);
      setRecordingState(shouldStart ? 'Starting' : 'Empty');
    })
    .catch(e => {
      setRecordingState('NoPermissions');
      toast.error('Please enable microphone permissions');
    });
};

let recorder: MediaRecorder | undefined;

export const Recorder: React.FC<{ uid: string }> = ({ uid }) => {
  const [recordingState, setRecordingState] = React.useState<CaptureState>('Empty');
  const [uploadState, setUploadState] = React.useState<UploadState>('Waiting');
  const [chunks, setChunks] = React.useState<Blob | undefined>();
  const { t } = useTranslation();

  React.useEffect(() => {
    setupRecorder(setRecordingState, false);
  }, []);

  React.useEffect(() => {
    if (recordingState === 'Starting') {
      if (!recorder) {
        ReactGA.event({ category: 'Survey', action: 'RecordingFailed' });
        toast.error('Failed to start recording :(');
        return;
      }
      recorder.addEventListener('dataavailable', e => {
        if (isDataEvent(e)) {
          setChunks(e.data);
        } else {
          throw new Error('Data is missing in recording');
        }
      });
      ReactGA.event({ category: 'Survey', action: 'Recording' });
      setRecordingState('Recording');
      recorder.start();
    } else if (recordingState === 'Stop') {
      if (!recorder) throw Error('Recorder should be initialized');
      recorder.stop();
      setRecordingState('Finished');
      ReactGA.event({ category: 'Survey', action: 'RecordingFinished' });
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
            <Spacer width={10} />
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
            <Spacer width={10} />
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
              {t('restart')} <Spacer width={5} />
              <span css={{ fontSize: 18, lineHeight: 1, marginTop: -2, color: 'red' }}>●</span>
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
        {t('start upload')} <Spacer width={10} />
        <SendIcon fontSize="small" />
      </React.Fragment>
    ),
    Uploading: (
      <React.Fragment>
        {t('uploading')} <Spacer width={10} />
        <CircularProgress size={16} />
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
        ReactGA.event({ category: 'Survey', action: 'Uploading' });
        const reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = async () => {
          const dest = `${process.env.REACT_APP_BACKEND_URL}/upload`;
          var formData = new FormData();
          formData.append('file', reader.result as string);
          formData.append('user', uid);
          try {
            await Axios({ method: 'POST', url: dest, data: formData });
            ReactGA.event({ category: 'Survey', action: 'UploadingFinished' });
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
        {isPlaying ? t('stop') : t('play')} <Spacer width={5} />
        <span css={{ fontSize: 10, color: 'black' }}>▶</span>
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
    NoPermissions: <React.Fragment>{t('start recording')}</React.Fragment>,
    Starting: 'Initialized',
    Recording: (
      <div css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {t('stop recording')}
        <Spacer width={10} />
        <div css={{ animation: `${blinking} 1s ease infinite`, height: 12, width: 12, borderRadius: 999 }}></div>
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
        if (state === 'NoPermissions') {
          setupRecorder(setState, true);
        } else if (state === 'Empty') {
          setState('Starting');
        } else if (state === 'Recording') {
          setState('Stop');
        }
      }}
      disabled={!['Empty', 'Recording', 'NoPermissions'].includes(state)}
    >
      {recordingStateToElement[state]}
    </Button>
  );
};
