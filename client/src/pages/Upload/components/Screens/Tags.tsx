import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  Accordion,
  useTheme,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import EmbedToggleInput from 'components/form/EmbedToggleInput';

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
          <strong>{t('Separate tags with a comma. ')}</strong>
          {t(
            'Searching by file type is valuable for educators & accessibility.'
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
        <TagInput
          control={control}
          name="languageTags"
          fullWidth
          placeholder={t('Language Tags')}
        />
        <Typography component="p" variant="body1" mt={theme.spacing(2.5)}>
          <strong>{t('Separate tags with a comma. ')}</strong>
          {t(
            'These tags allow your content to build wider and deeper connections. By adding languages and community terms as tags, you make it easier for people to discover. If content for a traveling exhibition is being created by different organisation, you can connect it through a shared tag. Some examples:'
          )}
        </Typography>
        <Grid container>
          <Grid xs={12} md={4}>
            <Typography component="ul" variant="body2" mb={theme.spacing(2)}>
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
                  rules={{ required: false }}
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
                placeholder={t('Name')}
                rules={{ required: false }}
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

      <Box my={theme.spacing(10)}>
        <Typography component="h4" variant="h4" my={theme.spacing(0.5)}>
          {t('Embedding Content')}
        </Typography>

        <Grid container columnSpacing={2} rowSpacing={4}>
          <Grid xs={12} sm={8}>
            <Typography
              component="p"
              mr={theme.spacing(10)}
              mt={theme.spacing(5)}
            >
              Toggle the embed code on or off for public users.
            </Typography>
          </Grid>

          <Grid container justifyContent="flex-end" xs={12} sm={4}>
            <EmbedToggleInput
              defaultValue="true"
              control={control}
              name="embedToggleInput"
            />
          </Grid>
        </Grid>

        <TagInput
          control={control}
          name="embedContentWhitelist"
          fullWidth
          placeholder={t('Embedded Content Whitelist')}
          hideIcon={true}
          rules={{
            required: false,
            pattern: {
              value:
                /^(?!https?:\/\/|www\.|ftp\.)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(,\s*(?!https?:\/\/|www\.|ftp\.)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})*$/,
              message:
                'Include only the domain name (e.g., example.com), not the full URL.'
            }
          }}
        />

        <Box my={theme.spacing(2.5)}>
          <Accordion
            style={{ backgroundColor: theme.palette.background.default }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Grid container>
                <Box>
                  <strong>
                    {t('You must separate websites with a comma. ')}
                  </strong>
                  {t(
                    'For added security prevent users from embedding your URL by creating a Whitelist of websites where your content can be embedded. Tap the arrow for links to code you can use to embed your content on a Whitelisted site.'
                  )}
                </Box>
                <Box mt={1}>
                  {t(
                    '*Note: this will require you to develop a trigger. Learn how to generate a trigger using AI. Video tutorial coming soon.'
                  )}
                </Box>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="p" variant="body2">
                {t('View code for embedding content')}{' '}
                <Link
                  href="https://codesandbox.io/p/sandbox/embed-content-d79nck"
                  sx={{ color: 'inherit' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here.
                </Link>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>

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
