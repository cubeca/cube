import { Box, TextField, Typography, useTheme } from '@mui/material';
import Select from 'components/form/ControlledSelect';
import TextInput from 'components/form/TextInput';
import UploadInput from 'components/form/UploadInput';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const Details = ({
  control,
  handleVTTFilesUpload,
  expiryValue,
  onExpriryValueChange,
  uploadType,
  editMode,
  content
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isVTTUploadReady, setIsVTTUploadReady] = useState(false);

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
        <Controller
          name="expiry"
          control={control}
          defaultValue={!editMode ? expiryValue : content?.expiry}
          render={({ field: { onChange, value } }) => {
            const dateValue = value
              ? value instanceof Date
                ? value
                : new Date(value)
              : null;
            return (
              <DatePicker
                label={t('Expiry Date')}
                value={dateValue}
                onChange={onChange}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    value={
                      dateValue
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
        <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
          {t(
            'Content will be hidden from public search after it expires. You can update this date at any time.'
          )}
        </Typography>
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
