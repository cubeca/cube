import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

const Details = ({
  control,
  handleVTTFilesUpload,
  uploadType,
  editMode,
  content,
  setValue,
  watch
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isVTTUploadReady, setIsVTTUploadReady] = useState(false);
  const [checkedState, setCheckedState] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [liveDate, setLiveDate] = useState<Date | null>(null);

  const watchedLiveDate = watch('live');
  const watchedExpiryDate = watch('expiry');

  const handleVTTOnDrop = (files: File[]) => {
    handleVTTFilesUpload(files);
    setIsVTTUploadReady(true);
  };

  const showField = (field: string) => {
    const reqMap = {
      video: ['description', 'vtt', 'kidsContent', 'expiry'],
      audio: ['description', 'vtt', 'expiry', 'kidsContent'],
      pdf: ['description', 'expiry', 'kidsContent'],
      document: ['description', 'expiry', 'kidsContent'],
      link: ['description', 'expiry', 'kidsContent']
    };
    if (!uploadType) return false;
    // @ts-ignore
    const map = reqMap[uploadType];
    return map.includes(field);
  };

  return (
    <Box className={'upload__details-screen'}>
      <Typography component="h2" variant="h2">
        {t('Details')}
      </Typography>
      {showField('description') || editMode ? (
        <Box my={theme.spacing(5)}>
          <TextInput
            control={control}
            name="description"
            placeholder={t('Description (required)')}
            defaultValue={editMode ? content?.description : ''}
            multiline
            rows={8}
            fullWidth
            required
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              `This text will be accessible to screen reading tools, as well as our search tool; it's important to remember that different accessibilities are assisted by different kinds of description. Add paragraph breaks to make your text easier to consume.`
            )}
          </Typography>
        </Box>
      ) : null}
      {showField('vtt') ? (
        <Box my={theme.spacing(5)}>
          <Typography component="h4" variant="h4" my={theme.spacing(2.5)}>
            {t('Subtitles')}
          </Typography>
          <UploadInput
            text={t('Subtitle File')}
            onDrop={handleVTTOnDrop}
            maxFiles={1}
            // isUploadReady={isVTTUploadReady}
            isUploadReady={!editMode ? isVTTUploadReady : true}
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t('Upload your VTT Subtitle file here. (optional)')}{' '}
            {/* leaving this here to be re-added once vtt is up and running */}
            {/* <strong>{t("If you don't have one, don't worry!")}</strong>{' '}
            {t(
              'At the end of this process subtitles will be generated that you can edit.'
            )} */}
            {/* <br /> */}
          </Typography>
          {/* <Controller
            name="vttLanguage"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                label={t('Language most prevalent in the content')}
                fullWidth={false}
                control={control}
                {...field}
              >
                {Object.keys(languageSet).map((key) => (
                  <MenuItem.li
                    value={languageSet[key as keyof typeof languageSet]}
                    key={key}
                  >
                    {key}
                  </MenuItem.li>
                ))}
              </Select>
            )}
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t('Select a language.')} <br />
          </Typography> */}
        </Box>
      ) : null}

      {showField('kidsContent') || editMode ? (
        <Box>
          <Controller
            name="audience"
            control={control}
            defaultValue={
              editMode
                ? content?.isSuitableForChildren
                  ? 'yeskids'
                  : 'nokids'
                : ''
            }
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                label={t('Is this content suitable for kids')}
                fullWidth={false}
                control={control}
                {...field}
              >
                <MenuItem.li value="yeskids">
                  {t(
                    'All Ages - This content is suitable for people under the age of 18.'
                  )}
                </MenuItem.li>
                <MenuItem.li value="nokids">
                  {t(
                    'Mature - This content is not suitable for people under the age of 18.'
                  )}
                </MenuItem.li>
              </Select>
            )}
          />

          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              'You’re required to tell us if your content is suitable for kids. You may not upload content that is considered “obscene” or “pornography”. These terms are difficult to define, by law they are judged "on the standard of what an average Canadian would think". If you have any doubt please mark your content "Mature". Thank you.'
            )}
          </Typography>
        </Box>
      ) : null}

      <Box my={theme.spacing(5)}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Checkbox
            checked={checkedState}
            onChange={(event) => {
              setCheckedState(event.target.checked);
              if (event.target.checked) {
                setExpiryDate(new Date());
                setLiveDate(null);
                setValue('live', null);
                setValue('expiry', new Date());
              } else {
                setExpiryDate(null);
                setLiveDate(new Date());
                setValue('live', null);
                setValue('expiry', null);
              }
            }}
            name="checked"
            color="primary"
          />
          <Typography component="p" variant="body2">
            {t(
              'Hide from search - This content will not be visible in search results. You can still share it with others.'
            )}
          </Typography>
        </Box>
        <Grid container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: theme.spacing(0), md: theme.spacing(2.5) },
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Controller
              name="live"
              control={control}
              defaultValue={!editMode ? liveDate : content?.live}
              render={({ field: { onChange, value } }) => {
                const dateValue =
                  watchedLiveDate !== undefined
                    ? watchedLiveDate
                    : value
                      ? value instanceof Date
                        ? value
                        : new Date(value)
                      : null;
                return (
                  <DatePicker
                    label={t('Live Date')}
                    minDate={new Date()}
                    maxDate={
                      watchedExpiryDate !== null
                        ? new Date(watchedExpiryDate)
                        : null
                    }
                    value={value}
                    onChange={(newValue) => {
                      setValue('live', newValue);
                      setLiveDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          width: { xs: '100%', md: '50%' }
                        }}
                        fullWidth
                        value={
                          dateValue && !editMode
                            ? `${
                                dateValue.getMonth() + 1
                              }/${dateValue.getDate()}/${dateValue.getFullYear()}`
                            : ''
                        }
                        {...params}
                        onKeyUp={(e) => {
                          const cursorPosition = (e.target as HTMLInputElement)
                            .selectionStart;
                          const inputElement = e.target as HTMLInputElement;
                          const value = inputElement.value;
                          const dateParts = value.split('/');
                          const month = dateParts[0];
                          const day = dateParts[1];

                          if (
                            e.key !== 'Backspace' &&
                            cursorPosition !== value.length &&
                            ((month && month.length === 2) ||
                              (day && day.length === 2))
                          ) {
                            if (
                              cursorPosition !== null &&
                              inputElement.setSelectionRange
                            ) {
                              inputElement.setSelectionRange(
                                cursorPosition + 1,
                                cursorPosition + 1
                              );
                            }
                          }
                        }}
                      />
                    )}
                  />
                );
              }}
            />
            <Typography
              component="p"
              variant="body2"
              sx={{
                width: { xs: '100%', md: '50%' },
                paddingBottom: { xs: theme.spacing(2.5), md: 0 }
              }}
            >
              Set a live date to make your content visible to the public from
              the date specified. Content will be hidden from public search
              until this date.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: theme.spacing(0), md: theme.spacing(2.5) },
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Controller
              name="expiry"
              control={control}
              defaultValue={!editMode ? expiryDate : content?.expiry}
              render={({ field: { onChange, value } }) => {
                const dateValue =
                  watchedExpiryDate !== null
                    ? watchedExpiryDate
                    : value
                      ? value instanceof Date
                        ? value
                        : new Date(value)
                      : null;
                return (
                  <DatePicker
                    label={t('Expiry Date')}
                    minDate={
                      watchedLiveDate ? new Date(watchedLiveDate) : new Date()
                    }
                    value={value}
                    onChange={(newValue) => {
                      setValue('expiry', newValue);
                      setLiveDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          width: { xs: '100%', md: '50%' }
                        }}
                        fullWidth
                        value={
                          dateValue && !editMode
                            ? `${
                                dateValue.getMonth() + 1
                              }/${dateValue.getDate()}/${dateValue.getFullYear()}`
                            : ''
                        }
                        {...params}
                        onKeyUp={(e) => {
                          const cursorPosition = (e.target as HTMLInputElement)
                            .selectionStart;
                          const inputElement = e.target as HTMLInputElement;
                          const value = inputElement.value;
                          const dateParts = value.split('/');
                          const month = dateParts[0];
                          const day = dateParts[1];

                          if (
                            e.key !== 'Backspace' &&
                            cursorPosition !== value.length &&
                            ((month && month.length === 2) ||
                              (day && day.length === 2))
                          ) {
                            if (
                              cursorPosition !== null &&
                              inputElement.setSelectionRange
                            ) {
                              inputElement.setSelectionRange(
                                cursorPosition + 1,
                                cursorPosition + 1
                              );
                            }
                          }
                        }}
                      />
                    )}
                  />
                );
              }}
            />
            <Typography
              component="p"
              variant="body2"
              sx={{
                width: { xs: '100%', md: '50%' },
                paddingBottom: { xs: theme.spacing(2.5), md: 0 }
              }}
            >
              {t(
                'Set an expiry date to hide your content from public search from the specified date.  Content will still be viewable for those who have the link.'
              )}
            </Typography>
          </Box>
        </Grid>
        {/* <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Content will be hidden from public search after it expires. You can update this date at any time.'
          )}
        </Typography> */}
      </Box>
    </Box>
  );
};

export default Details;

const languageSet = {
  Afrikaans: 'af',
  Arabic: 'ar',
  Armenian: 'hy',
  Azerbaijani: 'az',
  Belarusian: 'be',
  Bosnian: 'bs',
  'Catalan, Valencian': 'ca',
  Chinese: 'zh',
  Croatian: 'hr',
  Czech: 'cs',
  Danish: 'da',
  English: 'en',
  Estonian: 'et',
  Finnish: 'fi',
  French: 'fr',
  Galician: 'gl',
  German: 'de',
  Greek: 'el',
  Hebrew: 'he',
  Hindi: 'hi',
  Hungarian: 'hu',
  Icelandic: 'is',
  Indonesian: 'id',
  Italian: 'it',
  Japanese: 'ja',
  Kannada: 'kn',
  Korean: 'ko',
  Latvian: 'lv',
  Lithuanian: 'lt',
  Macedonian: 'mk',
  Malay: 'ms',
  Maori: 'mi',
  Nepali: 'ne',
  Norwegian: 'no',
  Persian: 'fa',
  Polish: 'pl',
  Portuguese: 'pt',
  'Romanian, Moldavian, Moldovan': 'ro',
  Russian: 'ru',
  Serbian: 'sr',
  Slovak: 'sk',
  Slovenian: 'sl',
  'Spanish, Castilian': 'es',
  Swahili: 'sw',
  Swedish: 'sv',
  Tagalog: 'tl',
  Tamil: 'ta',
  Thai: 'th',
  Turkish: 'tr',
  Ukrainian: 'uk',
  Urdu: 'ur',
  Vietnamese: 'vi',
  Welsh: 'cy'
};
