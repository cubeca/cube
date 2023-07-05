import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';
import TagInput from 'components/form/TagInput';
import { useTranslation } from 'react-i18next';

const Tags = ({ control }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box className={'upload__tags-screen'}>
      <Typography component="h2" variant="h2">
        {t('Tags')}
      </Typography>

      <Box my={theme.spacing(5)}>
        <TagInput
          control={control}
          name="tags"
          fullWidth
          placeholder={t('Content Tags')}
        />

        <Typography component="p" variant="body2" mt={theme.spacing(2.5)}>
          {t(
            'Separate tags by comma. Tags are our way of expanding the terms by which users can search content. They also contribute to your govenance token holdings by expressing how inclusive and accessible your content is. If you want content to be bundled under an exhibition name please create that tag:'
          )}
        </Typography>

        <Grid container>
          <Grid xs={12} md={4}>
            <Typography component="ul" variant="body2" my={theme.spacing(2)}>
              <li>Live Performance</li>
              <li>Workshop</li>
              <li>Kids workshop</li>
              <li>Artist Talk</li>
              <li>Language Teaching</li>
              <li>Cultural Teaching</li>
              <li>Studio Visit</li>
              <li>Gathering</li>
              <li>Book Reading</li>
              <li>Subtitled</li>
              <li>Sign language</li>
              <li>Multilingual Subtitles</li>
              <li>How-To</li>
            </Typography>
          </Grid>
          <Grid xs={12} md={4}>
            <Typography component="h6" variant="h6" my={theme.spacing(2)}>
              Language Tags
            </Typography>
            <Typography component="ul" variant="body2" my={theme.spacing(2)}>
              <li>hən̓q̓əmin̓əm̓</li>
              <li>Kwak̓wala</li>
              <li>Sḵwx̱wú7mesh</li>
              <li>Anishinaabemowin Ojibwe</li>
              <li>普通话 Mandarin</li>
              <li>ਗੁਰਮੁਖੀ Punjabi</li>
              <li>જોડણી Gujarati</li>
              <li>French</li>
              <li>English</li>
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box my={theme.spacing(5)}>
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Credit any individuals who contribute to this content, including artists, editors etc. Add as many contributors as needed, using “Add more”. Only one name per field.'
          )}
        </Typography>

        <Grid container columnSpacing={2} alignItems="center">
          <Grid xs={3}>
            <Typography component="h6" variant="h6" mt={theme.spacing(1)}>
              Artist:
            </Typography>
          </Grid>
          <Grid xs={9}>
            <TextInput
              control={control}
              name="artist"
              fullWidth
              placeholder={t('Add only one contributor name here')}
            />
          </Grid>
          <Grid xs={3}>
            <Typography component="h6" variant="h6" mt={theme.spacing(1)}>
              Editor:
            </Typography>
          </Grid>
          <Grid xs={9}>
            <TextInput
              control={control}
              name="editor"
              fullWidth
              placeholder={t('Add only one contributor name here')}
            />
          </Grid>
          <Grid xs={3}>
            <Typography component="h6" variant="h6" mt={theme.spacing(1)}>
              Camera Operator:
            </Typography>
          </Grid>
          <Grid xs={9}>
            <TextInput
              control={control}
              name="camera"
              fullWidth
              placeholder={t('Add only one contributor name here')}
            />
          </Grid>
          <Grid xs={3}>
            <Typography component="h6" variant="h6" mt={theme.spacing(1)}>
              Sound Technician:
            </Typography>
          </Grid>
          <Grid xs={9}>
            <TextInput
              control={control}
              name="sound"
              fullWidth
              placeholder={t('Add only one contributor name here')}
            />
          </Grid>
          <Grid xs={3}>
            <TextInput
              control={control}
              name=""
              fullWidth
              placeholder={t('Role')}
            />
          </Grid>
          <Grid xs={9}>
            <TextInput
              control={control}
              name="sound"
              fullWidth
              placeholder={t('Add only one contributor name here')}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="outlined">{t('+ add more')}</Button>
        </Box>
      </Box>

      <Box my={theme.spacing(5)}>
        <TagInput
          control={control}
          name="collaborators"
          fullWidth
          placeholder={t('Collaborators')}
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Did you work with another organization? Include them in the credits. Separate collaborators by comma.'
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default Tags;
