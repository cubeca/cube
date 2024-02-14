import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import TextInput from 'components/form/TextInput';
import TagInput from 'components/form/TagInput';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import CollaboratorInput from 'components/form/CollaboratorInput';
import * as s from './Tags.styled';
import { SearchFiltersCategoryEnum } from '@cubeca/cube-svc-client-oas-axios';
import { Controller } from 'react-hook-form';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Tags = ({ control, handleCaptchaVerification }: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const categories = Object.keys(SearchFiltersCategoryEnum);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';

  const [artists, setArtists] = useState<any[]>([
    { name: 'artist_1', url: 'artist_url_1' }
  ]);
  const [editors, setEditors] = useState<any[]>([
    { name: 'editor_1', role: 'editor' }
  ]);
  const [cameraOperators, setCameraOperators] = useState<any[]>([
    { name: 'camera_operator_1', role: 'camera' }
  ]);
  const [soundTechnicians, setSoundTechnicians] = useState<any[]>([
    { name: 'sound_technician_1', role: 'sound' }
  ]);
  const [otherContributors, setOtherContributors] = useState<any[]>([
    { name: 'other_name_1', role: 'other_role_1' }
  ]);

  const handleAddMore = (type: string, preferredTitle?: string) => {
    if (type === 'artist') {
      setArtists([
        ...artists,
        {
          name: `artist_${artists.length + 1}`,
          url: `artist_url_${artists.length + 1}`,
          preferredTitle:
            preferredTitle !== 'Artist' ? preferredTitle : 'Artist'
        }
      ]);
    } else if (type === 'editor') {
      setEditors([
        ...editors,
        {
          name: `editor_${editors.length + 1}`,
          role: `editor_url_${editors.length + 1}`
        }
      ]);
    } else if (type === 'camera_operator') {
      setCameraOperators([
        ...cameraOperators,
        {
          name: `camera_operator_${cameraOperators.length + 1}`,
          role: `camera_operator_url_${cameraOperators.length + 1}`
        }
      ]);
    } else if (type === 'sound_technician') {
      setSoundTechnicians([
        ...soundTechnicians,
        {
          name: `sound_technician_${soundTechnicians.length + 1}`,
          role: `sound_technician_url_${soundTechnicians.length + 1}`
        }
      ]);
    } else if (type === 'other') {
      setOtherContributors([
        ...otherContributors,
        {
          name: `other_name_${otherContributors.length + 1}`,
          role: `other_role_${otherContributors.length + 1}`
        }
      ]);
    }
  };

  return (
    <Box className={'upload__tags-screen'}>
      <Typography component="h2" variant="h2">
        {t('Tags')}
      </Typography>

      <Box my={theme.spacing(5)}>
        <Controller
          name="categories"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={categories}
              value={field.value}
              onChange={(_, newValue) => field.onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label=""
                  placeholder="Content Tags (required)"
                />
              )}
            />
          )}
        />
        <Typography component="p" variant="body1" mt={theme.spacing(2.5)}>
          <strong>{t('You must separate tags with a comma. ')}</strong>
          {t(
            'Being able to search by file type is extremely useful for people with disabilities and for educators.'
          )}
        </Typography>
        <s.StyledList>
          {t('Note*')}
          <s.StyledListItem component="li">
            <strong>&quot;Activity Books&quot;</strong>{' '}
            <s.StyledListSpan>
              can refer to PDFs created for public programming.
            </s.StyledListSpan>
          </s.StyledListItem>
          <s.StyledListItem component="li">
            <strong>&quot;Digital Publications&quot;</strong>{' '}
            <s.StyledListSpan>distinguishes other PDFs.</s.StyledListSpan>
          </s.StyledListItem>
          <s.StyledListItem component="li">
            <strong>&quot;Collaborations&quot;</strong>{' '}
            <s.StyledListSpan>
              is content traveling between multiple organizations or made with
              other organizations.
            </s.StyledListSpan>
          </s.StyledListItem>
          <s.StyledListItem component="li">
            <strong>&quot;Sign Language&quot;</strong>{' '}
            <s.StyledListSpan>if your content includes this.</s.StyledListSpan>
          </s.StyledListItem>
        </s.StyledList>
        <TagInput
          control={control}
          name="tags"
          fullWidth
          placeholder={t('Connection Tags')}
        />
        <Typography component="p" variant="body1" mt={theme.spacing(2.5)}>
          <strong>{t('You must separate tags with a comma. ')}</strong>
          {t(
            'These tags allow your content to build wider and deeper connections to other cultural and community content. By adding languages and community terms as tags, you make it easier for people to discover. They also express how accessible your content is. And if you want content to be bundled under an exhibition name please create that tag. Some examples to help get you started:'
          )}
        </Typography>
        <Grid container>
          <Grid xs={12} md={4}>
            <Typography component="ul" variant="body2" my={theme.spacing(4)}>
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
            <Typography component="h6" variant="h6" my={theme.spacing(4)}>
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
        <Typography component="h4" variant="h4" my={theme.spacing(2.5)}>
          {t('Credits')}
        </Typography>
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Credit anyone who contributed to your content. Add as many as needed, using “Add more”. Please only one name per field.'
          )}
        </Typography>

        {artists.map((_, index) => (
          <Grid key={index} container columnSpacing={2} rowSpacing={4}>
            {index === 0 ? (
              <Grid xs={12} sm={2}>
                <TextInput
                  variant={'outlined'}
                  control={control}
                  name={`preferredTitle`}
                  fullWidth
                  rules={{ required: index === 0 }}
                  defaultValue="Artist"
                />
              </Grid>
            ) : (
              <Grid xs={2} />
            )}
            <Grid xs={12} sm={4}>
              <TextInput
                variant={'outlined'}
                control={control}
                name={`artistName${index}`}
                fullWidth
                placeholder={t('Name (required)')}
                rules={{ required: index === 0 }}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <TextInput
                control={control}
                name={`artistUrl${index}`}
                fullWidth
                placeholder={t('URL')}
                rules={{
                  required: false,
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: 'URLs must begin with http://, https://, or ftp://'
                  }
                }}
              />
            </Grid>

            {index === artists.length - 1 && (
              <Grid xs={12} sm={2}>
                <s.StyledButton
                  sx={{ marginTop: '14px', height: '58px' }}
                  variant="outlined"
                  onClick={() => handleAddMore('artist', 'preferredTitle')}
                >
                  {t('+ more')}
                </s.StyledButton>
              </Grid>
            )}
          </Grid>
        ))}
        <Typography
          component="p"
          variant="body2"
          my={theme.spacing(2.5)}
          sx={{ paddingBottom: '20px' }}
        >
          {t("Include an artist's URL to hyperlink their name in the credits.")}
        </Typography>

        {editors.map((_, index) => (
          <Grid key={index} container columnSpacing={2} rowSpacing={4}>
            {index === 0 ? (
              <Grid xs={12} sm={2}>
                <Typography component="h6" variant="h6" mt={theme.spacing(3)}>
                  Editor:
                </Typography>
              </Grid>
            ) : (
              <Grid xs={2} />
            )}
            <Grid xs={12} sm={8}>
              <TextInput
                control={control}
                name={`editorName${index}`}
                fullWidth
                placeholder={t('Name')}
                rules={{ required: false }}
              />
            </Grid>
            {index === editors.length - 1 && (
              <Grid xs={12} sm={2}>
                <s.StyledButton
                  variant="outlined"
                  onClick={() => handleAddMore('editor')}
                >
                  {t('+ more')}
                </s.StyledButton>
              </Grid>
            )}
          </Grid>
        ))}

        {cameraOperators.map((_, index) => (
          <Grid key={index} container columnSpacing={2} rowSpacing={4}>
            {index === 0 ? (
              <Grid xs={12} sm={2}>
                <Typography component="h6" variant="h6" mt={theme.spacing(2)}>
                  Camera Operator:
                </Typography>
              </Grid>
            ) : (
              <Grid xs={2} />
            )}
            <Grid xs={12} sm={8}>
              <TextInput
                control={control}
                name={`cameraOperatorName${index}`}
                fullWidth
                placeholder={t('Name')}
                rules={{ required: false }}
              />
            </Grid>
            {index === cameraOperators.length - 1 && (
              <Grid xs={12} sm={2}>
                <s.StyledButton
                  variant="outlined"
                  onClick={() => handleAddMore('camera_operator')}
                >
                  {t('+ more')}
                </s.StyledButton>
              </Grid>
            )}
          </Grid>
        ))}

        {soundTechnicians.map((_, index) => (
          <Grid key={index} container columnSpacing={2} rowSpacing={4}>
            {index === 0 ? (
              <Grid xs={12} sm={2}>
                <Typography component="h6" variant="h6" mt={theme.spacing(2)}>
                  Sound Technician:
                </Typography>
              </Grid>
            ) : (
              <Grid xs={2} />
            )}
            <Grid xs={12} sm={8}>
              <TextInput
                control={control}
                name={`soundTechnicianName${index}`}
                fullWidth
                placeholder={t('Name')}
                rules={{ required: false }}
              />
            </Grid>
            {index === soundTechnicians.length - 1 && (
              <Grid xs={12} sm={2}>
                <s.StyledButton
                  variant="outlined"
                  onClick={() => handleAddMore('sound_technician')}
                >
                  {t('+ more')}
                </s.StyledButton>
              </Grid>
            )}
          </Grid>
        ))}

        {otherContributors.map((_, index) => (
          <Grid key={index} container columnSpacing={2} rowSpacing={4}>
            <Grid xs={12} sm={2}>
              <TextInput
                variant={'outlined'}
                control={control}
                name={`other_role_${index}`}
                fullWidth
                placeholder={t('Role')}
                rules={{ required: false }}
              />
            </Grid>
            <Grid xs={12} sm={8}>
              <TextInput
                control={control}
                name={`other_name_${index}`}
                fullWidth
                placeholder={t('Name')}
                rules={{ required: false }}
              />
            </Grid>
            {index === otherContributors.length - 1 && (
              <Grid xs={12} sm={2}>
                <s.StyledButton
                  sx={{ marginTop: '14px', height: '58px' }}
                  variant="outlined"
                  onClick={() => handleAddMore('other')}
                >
                  {t('+ more')}
                </s.StyledButton>
              </Grid>
            )}
          </Grid>
        ))}
      </Box>

      <Box my={theme.spacing(5)}>
        <CollaboratorInput
          control={control}
          name="collaborators"
          fullWidth
          placeholder={t('Collaborators')}
          rules={{ required: false }}
        />
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Did you work with another organization on CubeCommons? Connect this content to their profile by selecting their name.'
          )}
        </Typography>
      </Box>

      <TagInput
        control={control}
        name="embedContentWhitelist"
        fullWidth
        placeholder={t('Embedded Content Whitelist')}
      />
      <Typography component="p" variant="body1" mt={theme.spacing(2.5)}>
        <strong>{t('You must separate websites with a comma. ')}</strong>
        {t(
          'Would you like to be the only ones who can embed this content on your website. Input your URL here to restrict any other site from embedding it.'
        )}
      </Typography>

      <Box my={theme.spacing(5)}>
        <Typography component="h4" variant="h4" my={theme.spacing(2.5)}>
          {t('Captcha')}
        </Typography>
        <HCaptcha
          theme="dark"
          sitekey={hCaptchaKey}
          onVerify={handleCaptchaVerification}
        />
        <Typography component="p" variant="body2">
          {t('Verify you are a human being.')}
        </Typography>
      </Box>
    </Box>
  );
};

export default Tags;
