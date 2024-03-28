import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { getAuthToken } from '../../../../utils/auth';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import { TextField } from '@mui/material';
import { CUBE_SVC_URL } from '../../../../api/settings';
import { getProfile } from '../../../../utils/auth';
import { useNavigate } from 'react-router-dom';
import * as s from './Editor.styled';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Editor = (props: { contentId: any; postUpload: any }) => {
  const { contentId, postUpload } = props;
  const [vtt, setVTT] = useState<any>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    if (!loaded) {
      try {
        let i = 0;
        const interval = setInterval(async () => {
          i++;
          if (i > 60) {
            //~5 minutes
            clearInterval(interval);
            setLoadError(true);
            return;
          }
          const authToken = getAuthToken();
          axios
            .get(`${CUBE_SVC_URL}/vtt/${contentId}`, {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            })
            .then((res) => {
              if (res.status === 200 && res.data !== null) {
                const vttArray = [];
                for (const key in res.data.transcript) {
                  vttArray.push({ itemKey: key, ...res.data.transcript[key] });
                }
                vttArray.sort((a, b) => a.start - b.start);
                setVTT(vttArray);
                clearInterval(interval);
                setLoaded(true);
              }
            });
        }, 7500);
        return () => clearInterval(interval);
      } catch (error) {
        console.error({ error });
      }
    }
  }, [loaded, contentId]);

  const handleSave = async () => {
    setSaveLoading(true);
    const authToken = getAuthToken();
    const vttObject: any = {};
    vtt.forEach((row: any) => {
      vttObject[row.start] = {
        start: row.start,
        end: row.end,
        text: row.text
      };
    });
    await axios.put(
      `${CUBE_SVC_URL}/vtt/${contentId}`,
      {
        transcript: vttObject
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );
    setSaveLoading(false);
    const profile = getProfile();
    navigate(`/profile/${profile.tag}`);
  };

  const timeToSeconds = (time: string) => {
    try {
      const timeArray = time.split(':');
      if (timeArray.length === 2) {
        const minutes = parseInt(timeArray[0]);
        const seconds = parseFloat(timeArray[1]);
        return minutes * 60 + seconds;
      } else if (timeArray.length === 3) {
        const hours = parseInt(timeArray[0]);
        const minutes = parseInt(timeArray[1]);
        const seconds = parseFloat(timeArray[2]);
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
      secondsString = `0${seconds.toFixed(3)}`;
    } else {
      secondsString = `${seconds.toFixed(3)}`;
    }

    if (hours > 0) {
      return `${hoursString}:${minutesString}:${secondsString}`;
    }
    return `${minutesString}:${secondsString}`;
  };

  const handleVTTChange = (
    index: number,
    start: string,
    end: string,
    text: string,
    editActive: boolean
  ) => {
    const newVTT = [...vtt];
    let startSeconds;
    let endSeconds;
    try {
      startSeconds = timeToSeconds(start);
      endSeconds = timeToSeconds(end);
    } catch (error) {
      console.log(error);
      return;
    }
    //delete changed index
    console.log({ index });
    newVTT.splice(index, 1);
    newVTT.push({
      start: startSeconds,
      end: endSeconds,
      text,
      editActive
    });
    newVTT.sort((a, b) => a.start - b.start);

    const errors: any = {};
    newVTT.forEach((row: any, rowIndex: number) => {
      const start = parseFloat(row.start);
      const end = parseFloat(row.end);
      if (start > end) {
        errors[rowIndex] = {
          message: 'Start time must be before end time',
          type: 'time'
        };
      }
      if (row.text === '') {
        errors[rowIndex] = {
          message: 'Text cannot be empty',
          type: 'text'
        };
      }
      //Validate that there is no overlap
      if (rowIndex > 0) {
        const previousRow = newVTT[rowIndex - 1];
        const previousEnd = parseFloat(previousRow.end);
        if (start < previousEnd) {
          errors[rowIndex] = {
            message: 'Start time cannot overlap previous end time',
            type: 'time'
          };
        }
      }
    });
    console.log({ errors });
    setValidationErrors(errors);
    setVTT(newVTT);
  };

  const errorBool = (index: number, type: string) => {
    if (validationErrors[index] && validationErrors[index].type === type) {
      return true;
    }
    return false;
  };
  const errorMessage = (index: number) => {
    if (validationErrors[index]) {
      return validationErrors[index].message;
    }
    return null;
  };

  const VTTRow = (props: any) => {
    const {
      start: startInput,
      end: endInput,
      text: textInput,
      index,
      editActive
    } = props;
    const [start, setStart] = useState<string>(secondsToTime(startInput));
    const [end, setEnd] = useState<string>(secondsToTime(endInput));
    const [text, setText] = useState<string>(textInput);

    return (
      <Grid container columnSpacing={1} key={index} alignItems="center">
        {errorMessage(index) ? (
          <Grid xs={12}>
            <Typography color="error">{errorMessage(index)}</Typography>
          </Grid>
        ) : null}
        <Grid xs={2}>
          {editActive ? (
            <TextField
              label="Start"
              defaultValue={start}
              fullWidth
              error={errorBool(index, 'time')}
              onChange={(e) => setStart(e.target.value)}
            />
          ) : (
            <s.StyledText variant="outlined">{start}</s.StyledText>
          )}
        </Grid>

        <Grid xs={2}>
          {editActive ? (
            <TextField
              label="End"
              defaultValue={end}
              fullWidth
              error={errorBool(index, 'time')}
              onChange={(e) => setEnd(e.target.value)}
            />
          ) : (
            <s.StyledText variant="outlined">{end}</s.StyledText>
          )}
        </Grid>

        <Grid xs={7}>
          {editActive ? (
            <TextField
              label="Content"
              defaultValue={text}
              error={errorBool(index, 'text')}
              fullWidth
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <s.StyledText variant="outlined">{text}</s.StyledText>
          )}
        </Grid>
        {editActive ? (
          <Grid xs={1}>
            <s.StyledButtonEdit
              variant="outlined"
              t="Save"
              onClick={() => handleVTTChange(index, start, end, text, false)}
            >
              Save
            </s.StyledButtonEdit>
          </Grid>
        ) : (
          <Grid xs={1}>
            <s.StyledButtonDisplay
              variant="outlined"
              t="Edit"
              onClick={() => handleVTTChange(index, start, end, text, true)}
            >
              Edit
            </s.StyledButtonDisplay>
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <Grid container>
      <Grid xs={12} xsOffset={0} md={8} mdOffset={2}>
        <Typography variant="h2">{t('Subtitle Editor')}</Typography>
        {/* //Error loading */}
        {loadError ? (
          <Typography color="error">
            {t(
              'There was an error loading your subtitles. Please try again later.'
            )}
          </Typography>
        ) : null}
        {/* //Normal loading //Normal loading */}
        {loaded === false && loadError === false ? (
          <>
            <s.WaitWrapper>
              <s.StyledLoadingText variant={'h4'}>
                {postUpload
                  ? t(
                      'We are loading your file and then generating your subtitles; this may take a few minutes.'
                    )
                  : t('Loading subtitles')}
              </s.StyledLoadingText>
              <s.LogoWrapper>
                <Lottie
                  className="loading-cubes"
                  animationData={LoadingCubes}
                  loop={true}
                  style={{ height: '400px' }}
                />
              </s.LogoWrapper>
            </s.WaitWrapper>
          </>
        ) : null}
        {/* //Loaded and no errors */}
        {loaded && loadError === false ? (
          <>
            {vtt.map((item: any, index: number) => (
              <VTTRow
                start={item.start}
                end={item.end}
                text={item.text}
                index={index}
                key={index}
                editActive={item.editActive}
              />
            ))}
            <s.StyledButtonEdit
              variant="outlined"
              t="Save"
              disabled={
                saveLoading || Object.values(validationErrors).length > 0
              }
              onClick={handleSave}
            >
              Save
            </s.StyledButtonEdit>
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default Editor;
