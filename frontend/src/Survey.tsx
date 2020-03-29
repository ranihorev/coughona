/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Dialog, DialogContent, DialogTitle, Link, Menu, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import * as typeform from '@typeform/embed';
import isMobile, { isMobileResult } from 'ismobilejs';
import React from 'react';
import { useTranslation } from 'react-i18next';
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

const LanguageSelector: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { i18n } = useTranslation();
  return (
    <React.Fragment>
      <span
        onClick={e => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <Link css={{ display: 'flex', flexDirection: 'row', alignItems: 'center', lineHeight: 1, cursor: 'pointer' }}>
          {i18n.language} <ArrowDropDownIcon fontSize="small" />
        </Link>
      </span>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        {i18n.languages.map(lang => (
          <MenuItem
            key={lang}
            onClick={() => {
              i18n.changeLanguage(lang);
              setAnchorEl(null);
            }}
          >
            {lang}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export const Survey: React.FC = () => {
  const { t, i18n } = useTranslation();
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
    const form_url = process.env.REACT_APP_FORM_BASE_URL;
    if (!ref.current) return;
    const { model, type, userAgent } = getDeviceData();
    typeform.makeWidget(
      ref.current,
      `${form_url}${t('formID')}?uid=${uid.current}&device_type=${type}&device_model=${model}&user_agent=${userAgent}`,
      {
        onSubmit: () => {
          setSubmittedForm(true);
        },
        hideHeaders: true,
        hideFooter: true,
      },
    );
  }, [ref, ref.current, i18n.language]);

  return (
    <React.Fragment>
      <div css={{ position: 'absolute', zIndex: 1000, top: 15, left: 15 }}>
        <LanguageSelector />
      </div>
      <div
        className="hide-submit"
        css={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 1,
        }}
      >
        <div css={{ position: 'absolute', zIndex: 1000, top: 15, right: 15 }}>
          <Link component={RouterLink} to="/about">
            About
          </Link>
        </div>
        {!submittedForm ? (
          <div css={{ height: '100%', width: '100%' }} ref={ref}></div>
        ) : (
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: 'calc(100% - 40px)',
              height: '100%',
              padding: `0 20px`,
            }}
          >
            <Recorder uid={uid.current} />
          </div>
        )}
        <ToastContainer />
        <Dialog aria-labelledby="simple-dialog-title" open={!isSupported} css={{ textAlign: 'center' }}>
          <DialogTitle>{t('device not supported')}</DialogTitle>
          <DialogContent css={{ marginBottom: 10, lineHeight: 1.5 }}>
            {deviceData.apple.phone || deviceData.apple.tablet ? t('using iPhone') : t('another browser')}
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
};
