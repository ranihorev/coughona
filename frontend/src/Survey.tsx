/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Menu,
  MenuItem,
  Button,
  DialogActions,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import * as typeform from '@typeform/embed';
import DetectRTC from 'detectrtc';
import isMobile, { isMobileResult } from 'ismobilejs';
import React from 'react';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { langDisplayNames } from './i18n';
import { Recorder } from './Recorder';
import { Spacer } from './Spacer';

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
          {langDisplayNames[i18n.language]} <ArrowDropDownIcon fontSize="small" />
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
        {Object.entries(langDisplayNames).map(([lang, name]) => (
          <MenuItem
            key={lang}
            onClick={() => {
              i18n.changeLanguage(lang);
              setAnchorEl(null);
            }}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

const PopupReferral: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogContent>
        <DialogContentText>
          Hi, to make a bigger impact we decided to collaborate with other groups that work on similar projects and
          consolidate efforts. We recommend filling out the questionnaire on <b>voca.ai</b>,{' '}
          <Link css={{ cursor: 'pointer' }} onClick={() => setIsExpanded(state => !state)}>
            Why?
          </Link>
          {isExpanded && (
            <p css={{ fontSize: 14 }}>
              After we launched Coughona.com, we received hundreds of emails from people asking to volunteer. Thank you
              all! As part of it, we also found other projects trying to achieve the same thing, including:
              <p>
                <Link href="https://voca.ai/corona-virus/">voca.ai</Link>
                <br />
                <Link href="https://www.vocalishealth.com/">VocalisHealth</Link>
                <br />
                <Link href="https://www.breatheforscience.com/">BreatheForScience</Link>
                <br />
              </p>
              We are firm believers that collaboration can lead to greater things and specifically right now will
              increase humanity's chances of fighting this virus.
            </p>
          )}
        </DialogContentText>
        <DialogActions css={{ justifyContent: 'space-between', flexDirection: 'column' }}>
          <Button href="https://voca.ai/corona-virus/" color="primary" variant="contained" autoFocus>
            Go to VOCA.AI
          </Button>
          <Spacer height={10} />
          <Button onClick={() => setIsOpen(false)} color="primary">
            Continue Anyway
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
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
    ReactGA.event({ category: 'Survey', action: 'Start' });
    if (!navigator?.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      return;
    }
    DetectRTC.load(() => {
      if (!DetectRTC.hasMicrophone) {
        setIsSupported(false);
      }
    });
  }, [setIsSupported]);

  React.useEffect(() => {
    if (!isSupported) {
      ReactGA.event({ category: 'Survey', action: 'NotSupported' });
    }
  }, [isSupported]);

  React.useEffect(() => {
    const form_url = process.env.REACT_APP_FORM_BASE_URL;
    if (!ref.current) return;
    const { model, type, userAgent } = getDeviceData();
    if (submittedForm) return;
    typeform.makeWidget(
      ref.current,
      `${form_url}${t('formID')}?uid=${uid.current}&device_type=${type}&device_model=${model}&user_agent=${userAgent}`,
      {
        onSubmit: () => {
          setSubmittedForm(true);
          ReactGA.event({ category: 'Survey', action: 'Submitted' });
        },
        hideHeaders: true,
        hideFooter: true,
      },
    );
  }, [ref, ref.current, i18n.language, submittedForm, t]);

  return (
    <React.Fragment>
      <PopupReferral />
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
        {process.env.REACT_APP_SKIP_FORM || submittedForm ? (
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
        ) : (
          <span>
            <div className="typeform" css={{ height: '100%', width: '100%' }} ref={ref}></div>
          </span>
        )}
        <ToastContainer position="bottom-left" />
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
