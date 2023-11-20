import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import theme from 'theme';
import { getVTT, updateVTT } from '../../../../api/content';
import { getAuthToken } from '../../../../utils/auth';
import Lottie from 'lottie-react';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import { TextField } from '@mui/material';
import * as s from './VTT.styled';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

const VTTEditor = (props: { content: any }) => {
  const { content } = props;
  const [vtt, setVTT] = useState<any>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  //poll for vtt
  useEffect(() => {
    if (!loaded) {
      try {
        const interval = setInterval(async () => {
          const authToken = await getAuthToken();

          axios
            .get(`http://localhost:8085/vtt/${content.id}`, {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            })
            .then((res) => {
              if (res.status === 200 && res.data !== null) {
                console.log(res.data);
                setVTT(res.data.transcript);
                clearInterval(interval);
                setLoaded(true);
              }
            });
        }, 1000);
        return () => clearInterval(interval);
      } catch (error) {
        console.log(error);
      }
    }
  }, [loaded, content]);

  const { t } = useTranslation();
  console.log({ vtt });

  const handleVTTChange = (
    key: string,
    start: string,
    end: string,
    text: string
  ) => {
    console.log({ key, start, end, text });
    const newVTT = { ...vtt };
    delete newVTT[key];
    newVTT[key] = { start: parseInt(start), end: parseInt(end), text };
    setVTT(newVTT);
    console.log({ newVTT });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    const authToken = await getAuthToken();
    const response = await axios.put(
      `http://localhost:8085/vtt/${content.id}`,
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
  };

  const vttDisplay = (vtt: any) => {
    try {
      const response = [];
      const vttKeys = Object.keys(vtt);
      for (const key of vttKeys) {
        const item = vtt[key];
        response.push(
          <>
            <Grid sm={4}>
              <TextField
                placeholder={t('Start')}
                value={item.start}
                onChange={(e) =>
                  handleVTTChange(key, e.target.value, item.end, item.text)
                }
              />
            </Grid>
            <Grid sm={4}>
              <TextField
                placeholder={t('End')}
                value={item.end}
                onChange={(e) =>
                  handleVTTChange(key, item.start, e.target.value, item.text)
                }
              />
            </Grid>
            <Grid sm={4}>
              <TextField
                placeholder={t('Text')}
                value={item.text}
                onChange={(e) =>
                  handleVTTChange(key, item.start, item.end, e.target.value)
                }
              />
            </Grid>
          </>
        );
      }
      return (
        <>
          <Grid container columnSpacing={2} rowSpacing={4}>
            {response}
          </Grid>
          <s.StyledButton
            variant="outlined"
            t="Save"
            disabled={saveLoading}
            onClick={handleSave}
          >
            Save
          </s.StyledButton>
        </>
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <>
      <Typography variant="h2">{t('Subtitle Editor')}</Typography>
      {loaded ? (
        vttDisplay(vtt)
      ) : (
        <Lottie
          className="loading-cubes"
          animationData={LoadingCubes}
          loop={true}
        />
      )}
    </>
  );
};

export default VTTEditor;
