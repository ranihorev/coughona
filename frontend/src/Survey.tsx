/** @jsx jsx */
import { Global, jsx } from '@emotion/core';
import { Button, LinearProgress } from '@material-ui/core';
import * as typeform from '@typeform/embed';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import { ReactMic } from 'react-mic';

export const Survey: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [submittedForm, setSubmittedForm] = React.useState(false);
  const uid = React.useRef(uuidv4());

  React.useEffect(() => {
    if (!ref.current) return;
    typeform.makeWidget(ref.current, `https://ranihorev.typeform.com/to/kHF0vw?uid=${uid.current}`, {
      onSubmit: () => {
        setSubmittedForm(true);
      },
    });
  }, [ref.current]);

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
      <Global
        styles={{
          'button[data-qa^=submit-button]': {
            display: 'none',
          },
        }}
      />
      {!submittedForm ? <div css={{ height: 500 }} ref={ref}></div> : <AudioRecord uid={uid.current} />}
    </div>
  );
};

type CaptureState = 'Empty' | 'Recording' | 'Finished' | 'Failed';

const AudioRecord: React.FC<{ uid: string }> = ({ uid }) => {
  const [state, setState] = React.useState<CaptureState>('Empty');
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
    navigator.permissions.query({ name: 'microphone' }).then(permissionStatus => {
      console.log(permissionStatus.state);
      if (permissionStatus.state === 'denied') setState('Failed');
    });
  }, [setState]);

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (state === 'Empty' || state === 'Failed') {
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
        {state === 'Failed' ? 'Please enable microphone' : state === 'Empty' ? 'Record Cough' : 'Finish'}
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
