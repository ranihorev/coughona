/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Button, LinearProgress } from '@material-ui/core';
import * as typeform from '@typeform/embed';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import { ReactMic } from 'react-mic';

export const Survey: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [submittedForm, setSubmittedForm] = React.useState(false);
  const uid = React.useRef(uuidv4());

  const form_url = process.env.REACT_APP_FORM_URL;
  React.useEffect(() => {
    if (!ref.current) return;
    typeform.makeWidget(ref.current, `${form_url}?uid=${uid.current}`, {
      onSubmit: () => {
        setSubmittedForm(true);
      },
      hideHeaders: true,
      hideFooter: true,
    });
  }, [ref.current]);

  const isSupportedAgent = !navigator.userAgent.match('CriOS');

  if (!isSupportedAgent) {
    return (
      <div
        css={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 18,
          padding: 30,
          textAlign: 'center',
        }}
      >
        Audio recording is not supported on iOS, except on Safari. <br />
        <div css={{ paddingTop: 8 }}>Please switch to Safari to continue</div>
      </div>
    );
  }

  return (
    <div
      className="hide-submit"
      css={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!submittedForm ? <div css={{ height: 600, width: '100%' }} ref={ref}></div> : <AudioRecord uid={uid.current} />}
    </div>
  );
};

type CaptureState = 'NotReady' | 'Empty' | 'Recording' | 'Finished' | 'Failed';

const AudioRecord: React.FC<{ uid: string }> = ({ uid }) => {
  const [state, setState] = React.useState<CaptureState>('NotReady');
  const dest = `${process.env.REACT_APP_BACKEND_URL}/upload`;
  const uploadFile = async (blob: Blob) => {
    var formData = new FormData();
    formData.append('file', blob);
    formData.append('user', uid);
    try {
      await fetch(dest, {
        // content-type header should not be specified!
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
      setState('Finished');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <React.Fragment>
      <ReactMic
        record={state === 'Recording'}
        className="sound-wave"
        onStop={data => {
          uploadFile(data.blob);
        }}
        strokeColor="#000000"
        backgroundColor="#FFF"
      />
      {state !== 'Finished' ? <CaptureButton {...{ state, setState }} /> : <div>Thank you!</div>}
    </React.Fragment>
  );
};

const stateToButtonTxt: { [state in CaptureState]: string } = {
  NotReady: 'Checking Permissions',
  Empty: 'Record Cough',
  Recording: 'Recording',
  Finished: 'Thank you!',
  Failed: 'No microphone permissions :(',
};

const CaptureButton: React.FC<{
  state: CaptureState;
  setState: React.Dispatch<React.SetStateAction<CaptureState>>;
}> = ({ state, setState }) => {
  const timeSec = 20000;
  const interval = 500;
  const [counter, setCounter] = React.useState(timeSec);
  const isRecording = state === 'Recording';
  React.useEffect(() => {
    if (state !== 'Recording') return () => {};
    if (counter <= 0) {
      setState('Finished');
      return () => {};
    }
    const timer = setInterval(() => setCounter(counter - interval), interval);
    return () => clearInterval(timer);
  }, [setState, counter, state]);

  React.useEffect(() => {
    if (!navigator?.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setState('Failed');
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(
      success => {
        setState('Empty');
      },
      error => {
        setState('Failed');
      },
    );
  }, [state, setState]);

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (state === 'NotReady' || state === 'Failed') {
            navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then(a => {
                setState('Recording');
              })
              .catch(() => {
                setState('Failed');
              });
          }
          if (state === 'Recording') {
            setState('Finished');
          }
        }}
        disabled={state === 'Failed'}
      >
        {stateToButtonTxt[state]}
      </Button>
      <div css={{ width: 200, height: 80, marginTop: 20 }}>
        {isRecording && counter > 0 && (
          <LinearProgress
            variant="determinate"
            value={(100 * (timeSec - counter)) / timeSec}
            css={{ color: 'red !important' }}
          />
        )}
      </div>
    </React.Fragment>
  );
};
