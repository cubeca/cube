import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { getAuthToken } from '../../../../utils/auth';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import { TextField } from '@mui/material';
import { BFF_URL } from '../../../../api/settings';
import { getProfile } from '../../../../utils/auth';
import * as s from './Editor.styled';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Editor = (props: { contentId: any; postUpload: any }) => {
  const { contentId, postUpload } = props;
  const [vtt, setVTT] = useState<any>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<any>({});

  const { t } = useTranslation();

  useEffect(() => {
    if (!loaded) {
      try {
        const interval = setInterval(async () => {
          const authToken = await getAuthToken();
          axios
            .get(`${BFF_URL}/vtt/${contentId}`, {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            })
            .then((res) => {
              if (res.status === 200 && res.data !== null) {
                setVTT(res.data.transcript);
                clearInterval(interval);
                setLoaded(true);
              }
            });
        }, 2000);
        return () => clearInterval(interval);
      } catch (error) {
        console.error({ error });
      }
    }
  }, [loaded, contentId]);

  const handleSave = async () => {
    setSaveLoading(true);
    const authToken = await getAuthToken();
    const response = await axios.put(
      `${BFF_URL}/vtt/${contentId}`,
      {
        transcript: vtt
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );
    console.log({ response });
    setSaveLoading(false);
    if (postUpload) {
      const profile = getProfile();
      window.location.href = `/profile/${profile.tag}`;
    }
  };

  const timeToSeconds = (time: string) => {
    try {
      const timeArray = time.split(':');
      if (timeArray.length === 2) {
        const minutes = parseInt(timeArray[0]);
        const seconds = parseInt(timeArray[1]);
        return minutes * 60 + seconds;
      } else if (timeArray.length === 3) {
        const hours = parseInt(timeArray[0]);
        const minutes = parseInt(timeArray[1]);
        const seconds = parseInt(timeArray[2]);
        return hours * 3600 + minutes * 60 + seconds;
      }
    } catch (e) {
      return parseInt(time);
    }
  };
  const secondsToTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs - hours * 3600) / 60);
    const seconds = secs - hours * 3600 - minutes * 60;
    let hoursString;
    let minutesString;
    let secondsString;

    //handle leading zeros
    if (hours < 10 && hours > 0) {
      hoursString = `0${hours}`;
    } else {
      hoursString = `${hours}`;
    }
    if (minutes < 10) {
      minutesString = `0${minutes}`;
    } else {
      minutesString = `${minutes}`;
    }
    if (seconds < 10) {
      secondsString = `0${seconds}`;
    } else {
      secondsString = `${seconds}`;
    }

    if (hours > 0) {
      return `${hoursString}:${minutesString}:${secondsString}`;
    }
    return `${minutesString}:${secondsString}`;
  };

  const handleVTTChange = (
    key: string,
    start: string,
    end: string,
    text: string
  ) => {
    console.log({ key, start, end, text });
    const newVTT = { ...vtt };
    delete newVTT[key];
    let startSeconds;
    let endSeconds;
    try {
      startSeconds = timeToSeconds(start);
      endSeconds = timeToSeconds(end);
    } catch (error) {
      console.log(error);
      return;
    }
    console.log({ start: startSeconds, end: endSeconds, text });
    newVTT[key] = { start: startSeconds, end: endSeconds, text };

    //validate
    const errors: any = {};
    for (const key in newVTT) {
      //check if start is before end
      const row = newVTT[key];
      if (row.start > row.end) {
        errors[key] = {
          message: 'Start time must be before end time',
          type: 'time'
        };
        continue;
      }
      //overlapping times
      const messsage = 'Start times and end times must not overlap';
      for (const key2 in newVTT) {
        const item2 = newVTT[key2];
        if (row.start < item2.end && row.end > item2.start) {
          if (key !== key2) {
            errors[key] = { messsage, type: 'time' };
            errors[key2] = { messsage, type: 'time' };
          }
        }
      }
    }
    console.log({ errors });
    setValidationErrors(errors);
    setVTT(newVTT);
  };

  const errorBool = (key: string, type: string) => {
    if (validationErrors[key] && validationErrors[key].type === type) {
      return true;
    }
    return false;
  };
  const errorMessage = (key: string) => {
    if (validationErrors[key]) {
      return validationErrors[key].message;
    }
    return null;
  };

  const vttDisplay = (vtt: any) => {
    const vttArray = [];
    for (const key in vtt) {
      vttArray.push({ key, ...vtt[key] });
    }
    vttArray.sort((a, b) => a.start - b.start);
    const response = vttArray.map((item) => {
      const key = item.key;
      return (
        <Grid container columnSpacing={1} key={key}>
          {errorMessage(key) ? (
            <Grid xs={12}>
              <Typography color="error">{errorMessage(key)}</Typography>
            </Grid>
          ) : null}
          <Grid xs={1.25}>
            <TextField
              label="Start"
              defaultValue={secondsToTime(item.start)}
              fullWidth
              error={errorBool(key, 'time')}
              onBlur={(e) =>
                handleVTTChange(key, e.target.value, item.end, item.text)
              }
            />
          </Grid>
          <Grid xs={1.25}>
            <TextField
              label="End"
              defaultValue={secondsToTime(item.end)}
              fullWidth
              error={errorBool(key, 'time')}
              onBlur={(e) =>
                handleVTTChange(key, item.start, e.target.value, item.text)
              }
            />
          </Grid>
          <Grid xs={9.5}>
            <TextField
              label="Content"
              defaultValue={item.text}
              error={errorBool(key, 'text')}
              fullWidth
              onBlur={(e) =>
                handleVTTChange(key, item.start, item.end, e.target.value)
              }
            />
          </Grid>
        </Grid>
      );
    });
    return <>{response}</>;
  };

  return (
    <Grid container>
      <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
        <Typography variant="h2">{t('Subtitle Editor')}</Typography>
        {loaded ? (
          <>
            {vttDisplay(vtt)}
            <s.StyledButton
              variant="outlined"
              t="Save"
              disabled={
                saveLoading ||
                Object.keys(vtt).length === 0 ||
                Object.values(validationErrors).length > 0
              }
              onClick={handleSave}
            >
              Save
            </s.StyledButton>
          </>
        ) : (
          <>
            <s.WaitWrapper>
              <s.LogoWrapper>
                <Lottie
                  className="loading-cubes"
                  animationData={LoadingCubes}
                  loop={true}
                />
              </s.LogoWrapper>
              <s.StyledLoadingText variant={'h4'}>
                {postUpload
                  ? t('This may take a few minutes, generating subtitles')
                  : t('Loading subtitles')}
              </s.StyledLoadingText>
            </s.WaitWrapper>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Editor;
