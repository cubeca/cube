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
import { useEffect, useState } from 'react';
import CollaboratorInput from 'components/form/CollaboratorInput';
import * as s from './Tags.styled';
import { SearchFiltersCategoryEnum } from '@cubeca/cube-svc-client-oas-axios';
import { Controller } from 'react-hook-form';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import EmbedToggleInput from 'components/form/EmbedToggleInput';

const Tags = ({
  control,
  handleCaptchaVerification,
  editMode,
  content,
  setFinalCollaborators,
  selectedCategories,
  setSelectedCategories,
  setUserClearedFields
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const categories = Object.keys(SearchFiltersCategoryEnum);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';

  const [localCategories, setLocalCategories] = useState(
    editMode && content?.category ? content?.category : []
  );

  useEffect(() => {
    if (content?.category) {
      setSelectedCategories(content?.category);
    }
  }, [content?.category]);

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

  // Helper function to get custom fields
  const getCustomFields = (contributors: any) => {
    const keysToExclude = ['artist', 'camera_operator', 'editor', 'sound'];
    return Object.keys(contributors)
      .filter((key) => !keysToExclude.includes(key))
      .map((key) => {
        if (contributors[key] && contributors[key].length > 0) {
          return { role: key, name: contributors[key][0]?.name };
        } else {
          return { role: key, name: '' };
        }
      });
  };

  const getDefaultRole = (contributors: any) => {
    if (contributors?.artist) {
      return 'Artist';
    } else if (contributors?.preferredTitle) {
      return contributors.preferredTitle;
    } else {
      return '';
    }
  };

  useEffect(() => {
    if (localCategories.length === 0) {
      const savedCategories = localStorage.getItem('selectedCategories');
      if (savedCategories) {
        setSelectedCategories(JSON.parse(savedCategories));
        setLocalCategories(JSON.parse(savedCategories));
      }
    }
  }, []);

  useEffect(() => {
    // Save selected categories to local storage whenever they change so that they can be restored if a user navigates back to this screen
    localStorage.setItem(
      'selectedCategories',
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

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
              // value={selectedCategories}
              value={localCategories}
              onChange={(_, newValue) => {
                field.onChange(newValue);
                setLocalCategories(newValue);
                setSelectedCategories(newValue);

                // manual validation to ensure a user can't leave this field empty
                if (newValue.length === 0) {
                  setUserClearedFields(true);
                } else {
                  setUserClearedFields(false);
                }
              }}
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
            'These tags help educators & users with different access needs to filter content. For example, if your video has audio you should select both tags.'
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
              refers to content traveling between multiple organizations or made
              in collaboration.
            </s.StyledListSpan>
          </s.StyledListItem>
          <s.StyledListItem component="li">
            <strong>&quot;Sign Language&quot;</strong>{' '}
            <s.StyledListSpan>
              refers to content that already includes this.
            </s.StyledListSpan>
          </s.StyledListItem>
        </s.StyledList>
        <TagInput
          control={control}
          name="tags"
          fullWidth
          placeholder={t('Connection Tags (required)')}
          defaultValue={
            editMode && content?.tags.length > 1
              ? content?.tags.join(', ')
              : content?.tags[0] || ''
          }
        />
        <TagInput
          control={control}
          name="languageTags"
          fullWidth
          placeholder={t('Language Tags (required)')}
          defaultValue={
            editMode &&
            content?.languageTags &&
            content?.languageTags.length > 1
              ? content?.languageTags.join(', ')
              : (content?.languageTags && content?.languageTags[0]) || ''
          }
        />
        <Typography component="p" variant="body1" mt={theme.spacing(2.5)}>
          <strong>{t('Separate tags with a comma. ')}</strong>
          {t(
            'These tags allow your content to build wider and deeper connections. By adding languages and community terms as tags, you make it easier for people to discover. If content for a traveling exhibition is being created by different organizations, you can connect it through a shared tag. Some examples:'
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
            'Credit anyone who contributed to your content. Add as many as needed, using “Add more”. Please add only one name per field.'
          )}
        </Typography>

        {artists &&
          artists.map((_, index) => (
            <Grid key={index} container columnSpacing={2} rowSpacing={4}>
              {index === 0 ? (
                <Grid xs={12} sm={2}>
                  <TextInput
                    variant={'outlined'}
                    control={control}
                    name={`preferredTitle`}
                    fullWidth
                    rules={{ required: false }}
                    defaultValue={
                      (editMode && getDefaultRole(content?.contributors)) ||
                      'Artist'
                    }
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
                  defaultValue={
                    (editMode &&
                      content?.contributors.artist &&
                      content?.contributors.artist[index] &&
                      content?.contributors.artist[index]?.name) ||
                    ''
                  }
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <TextInput
                  control={control}
                  name={`artistUrl${index}`}
                  defaultValue={
                    (editMode &&
                      content?.contributors.artist &&
                      content?.contributors.artist[index] &&
                      content?.contributors.artist[index]?.url) ||
                    ''
                  }
                  fullWidth
                  placeholder={t('URL')}
                  rules={{
                    required: false,
                    pattern: {
                      value: /^(ftp|http|https):\/\/[^ "]+$/,
                      message:
                        'URLs must begin with http://, https://, or ftp://'
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

        {editors &&
          editors.map((_, index) => (
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
                  defaultValue={
                    editMode && content?.contributors.editor
                      ? content?.contributors.editor[index].name
                      : ''
                  }
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

        {cameraOperators &&
          cameraOperators.map((_, index) => (
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
                  defaultValue={
                    editMode && content?.contributors.camera_operator
                      ? content?.contributors.camera_operator[index].name
                      : ''
                  }
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

        {soundTechnicians &&
          soundTechnicians.map((_, index) => (
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
                  defaultValue={
                    editMode && content?.contributors.sound_technician
                      ? content?.contributors.sound_technician[index].name
                      : ''
                  }
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

        {otherContributors &&
          otherContributors.map((_, index) => (
            <Grid key={index} container columnSpacing={2} rowSpacing={4}>
              <Grid xs={12} sm={2}>
                <TextInput
                  variant={'outlined'}
                  control={control}
                  name={`other_role_${index}`}
                  fullWidth
                  placeholder={t('Role')}
                  rules={{ required: false }}
                  defaultValue={
                    (editMode &&
                      getCustomFields(content?.contributors)[index]?.role) ||
                    ''
                  }
                />
              </Grid>
              <Grid xs={12} sm={8}>
                <TextInput
                  control={control}
                  name={`other_name_${index}`}
                  fullWidth
                  placeholder={t('Name')}
                  rules={{ required: false }}
                  defaultValue={
                    (editMode &&
                      getCustomFields(content?.contributors)[index]?.name) ||
                    ''
                  }
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
          editMode={editMode}
          setFinalCollaborators={setFinalCollaborators}
          value={
            editMode && content?.collaboratorDetails
              ? content?.collaboratorDetails
              : []
          }
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
              defaultValue={editMode ? content?.embedToggleEnabled : 'true'}
              control={control}
              name="embedToggleInput"
              colormode="light"
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
                    'For added security, create a Whitelist of the only websites where your content URL can be embedded. Tap the arrow for links to code you can use to embed your content on a Whitelisted site.'
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

      {!editMode && (
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
      )}
    </Box>
  );
};

export default Tags;
