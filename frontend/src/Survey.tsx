/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Dialog, DialogContent, DialogTitle, Link } from '@material-ui/core';
import * as typeform from '@typeform/embed';
import isMobile, { isMobileResult } from 'ismobilejs';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { Recorder } from './Recorder';

const getDeviceModel = (data: isMobileResult, type: 'tablet' | 'phone') => {
  if (data.amazon[type]) {
    return 'Amazon';
  }
  if (data.windows[type]) {
    return 'Windows';
  }
  if (data.apple[type]) {
    return 'Apple';
  }
  if (data.android[type]) {
    return 'Android';
  }
  return 'Other';
};

const getDeviceData = () => {
  const data = isMobile();
  let type = 'Desktop';
  let model = 'Unknown';
  if (data.phone) {
    type = 'Phone';
    model = getDeviceModel(data, 'phone');
  } else if (data.tablet) {
    type = 'Tablet';
    model = getDeviceModel(data, 'tablet');
  }
  return { type, model, userAgent: encodeURI(navigator.userAgent) };
};

export const Survey: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [submittedForm, setSubmittedForm] = React.useState(false);
  const uid = React.useRef(uuidv4());
  const [isSupported, setIsSupported] = React.useState(true);
  const deviceData = isMobile();
  React.useEffect(() => {
    if (!navigator?.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(
      success => {},
      error => {
        setIsSupported(false);
      },
    );
  }, [setIsSupported]);

  React.useEffect(() => {
    const form_url = process.env.REACT_APP_FORM_URL;
    if (!ref.current) return;
    const { model, type, userAgent } = getDeviceData();
    typeform.makeWidget(
      ref.current,
      `${form_url}?uid=${uid.current}&device_type=${type}&device_model=${model}&user_agent=${userAgent}`,
      {
        onSubmit: () => {
          setSubmittedForm(true);
        },
        hideHeaders: true,
        hideFooter: true,
      },
    );
  }, [ref, ref.current]);

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
      <div css={{ position: 'absolute', zIndex: 1000, top: 15, right: 15 }}>
        <Link component={RouterLink} to="/about">
          About
        </Link>
      </div>
      {submittedForm ? <div css={{ height: '100%', width: '100%' }} ref={ref}></div> : <Recorder uid={uid.current} />}
      <ToastContainer />
      <Dialog aria-labelledby="simple-dialog-title" open={!isSupported} css={{ textAlign: 'center' }}>
        <DialogTitle>Device not supported :(</DialogTitle>
        <DialogContent css={{ marginBottom: 10, lineHeight: 1.5 }}>
          {deviceData.apple.phone || deviceData.apple.tablet
            ? 'Looks like you are using iPhone - Please try switching to Safari'
            : 'Please try another browser (Chrome or Firefox)'}
        </DialogContent>
      </Dialog>
    </div>
  );
};
