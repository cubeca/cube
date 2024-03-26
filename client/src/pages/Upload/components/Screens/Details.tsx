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
  uploadType
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
      {showField('description') ? (
        <Box my={theme.spacing(5)}>
          <TextInput
            control={control}
            name="description"
            placeholder={t('Description (required)')}
            multiline
            rows={8}
            fullWidth
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t(
              `This text will be accessible by screen reading tools as well as our search tool; it's important to remember that different accessibilities are assisted by different kinds of description. Add paragraph breaks to make it easier to consume.`
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
            isUploadReady={isVTTUploadReady}
          />
          <Typography component="p" variant="body2" my={theme.spacing(2.5)}>
            {t('Upload your VTT Subtitle file here.')}{' '}
            <strong>{t("If you don't have one, don't worry!")}</strong>{' '}
            {t(
              'At the end of this process subtitles will be generated that you can edit.'
            )}
            <br />
          </Typography>
          <Controller
            name="language"
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
          </Typography>
        </Box>
      ) : null}
      <Typography
        component="h4"
        variant="h4"
        mb={theme.spacing(2.5)}
        mt={theme.spacing(5)}
      >
        {t('Additional Details')}
      </Typography>
      {showField('kidsContent') ? (
        <Box>
          <Controller
            name="audience"
            control={control}
            defaultValue=""
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
          defaultValue={expiryValue}
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
            'Content with a defined expiry will be hidden from public search. You can update this date later.'
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default Details;

const languageSet = {
  Abkhazian: 'ab',
  Afar: 'aa',
  Afrikaans: 'af',
  Akan: 'ak',
  Albanian: 'sq',
  Amharic: 'am',
  Arabic: 'ar',
  Aragonese: 'an',
  Armenian: 'hy',
  Assamese: 'as',
  Avaric: 'av',
  Avestan: 'ae',
  Aymara: 'ay',
  Azerbaijani: 'az',
  Bambara: 'bm',
  Bashkir: 'ba',
  Basque: 'eu',
  Belarusian: 'be',
  Bengali: 'bn',
  Bislama: 'bi',
  Bosnian: 'bs',
  Breton: 'br',
  Bulgarian: 'bg',
  Burmese: 'my',
  'Catalan, Valencian': 'ca',
  Chamorro: 'ch',
  Chechen: 'ce',
  'Chichewa, Chewa, Nyanja': 'ny',
  Chinese: 'zh',
  'Church Slavonic, Old Slavonic, Old Church Slavonic': 'cu',
  Chuvash: 'cv',
  Cornish: 'kw',
  Corsican: 'co',
  Cree: 'cr',
  Croatian: 'hr',
  Czech: 'cs',
  Danish: 'da',
  'Divehi, Dhivehi, Maldivian': 'dv',
  'Dutch, Flemish': 'nl',
  Dzongkha: 'dz',
  English: 'en',
  Esperanto: 'eo',
  Estonian: 'et',
  Ewe: 'ee',
  Faroese: 'fo',
  Fijian: 'fj',
  Finnish: 'fi',
  French: 'fr',
  'Western Frisian': 'fy',
  Fulah: 'ff',
  'Gaelic, Scottish Gaelic': 'gd',
  Galician: 'gl',
  Ganda: 'lg',
  Georgian: 'ka',
  German: 'de',
  'Greek, Modern (1453–)': 'el',
  'Kalaallisut, Greenlandic': 'kl',
  Guarani: 'gn',
  Gujarati: 'gu',
  'Haitian, Haitian Creole': 'ht',
  Hausa: 'ha',
  Hebrew: 'he',
  Herero: 'hz',
  Hindi: 'hi',
  'Hiri Motu': 'ho',
  Hungarian: 'hu',
  Icelandic: 'is',
  Ido: 'io',
  Igbo: 'ig',
  Indonesian: 'id',
  'Interlingua (International Auxiliary Language Association)': 'ia',
  'Interlingue, Occidental': 'ie',
  Inuktitut: 'iu',
  Inupiaq: 'ik',
  Irish: 'ga',
  Italian: 'it',
  Japanese: 'ja',
  Javanese: 'jv',
  Kannada: 'kn',
  Kanuri: 'kr',
  Kashmiri: 'ks',
  Kazakh: 'kk',
  'Central Khmer': 'km',
  'Kikuyu, Gikuyu': 'ki',
  Kinyarwanda: 'rw',
  'Kirghiz, Kyrgyz': 'ky',
  Komi: 'kv',
  Kongo: 'kg',
  Korean: 'ko',
  'Kuanyama, Kwanyama': 'kj',
  Kurdish: 'ku',
  Lao: 'lo',
  Latin: 'la',
  Latvian: 'lv',
  'Limburgan, Limburger, Limburgish': 'li',
  Lingala: 'ln',
  Lithuanian: 'lt',
  'Luba-Katanga': 'lu',
  'Luxembourgish, Letzeburgesch': 'lb',
  Macedonian: 'mk',
  Malagasy: 'mg',
  Malay: 'ms',
  Malayalam: 'ml',
  Maltese: 'mt',
  Manx: 'gv',
  Maori: 'mi',
  Marathi: 'mr',
  Marshallese: 'mh',
  Mongolian: 'mn',
  Nauru: 'na',
  'Navajo, Navaho': 'nv',
  'North Ndebele': 'nd',
  'South Ndebele': 'nr',
  Ndonga: 'ng',
  Nepali: 'ne',
  Norwegian: 'no',
  'Norwegian Bokmål': 'nb',
  'Norwegian Nynorsk': 'nn',
  'Sichuan Yi, Nuosu': 'ii',
  Occitan: 'oc',
  Ojibwa: 'oj',
  Oriya: 'or',
  Oromo: 'om',
  'Ossetian, Ossetic': 'os',
  Pali: 'pi',
  'Pashto, Pushto': 'ps',
  Persian: 'fa',
  Polish: 'pl',
  Portuguese: 'pt',
  'Punjabi, Panjabi': 'pa',
  Quechua: 'qu',
  'Romanian, Moldavian, Moldovan': 'ro',
  Romansh: 'rm',
  Rundi: 'rn',
  Russian: 'ru',
  'Northern Sami': 'se',
  Samoan: 'sm',
  Sango: 'sg',
  Sanskrit: 'sa',
  Sardinian: 'sc',
  Serbian: 'sr',
  Shona: 'sn',
  Sindhi: 'sd',
  'Sinhala, Sinhalese': 'si',
  Slovak: 'sk',
  Slovenian: 'sl',
  Somali: 'so',
  'Southern Sotho': 'st',
  'Spanish, Castilian': 'es',
  Sundanese: 'su',
  Swahili: 'sw',
  Swati: 'ss',
  Swedish: 'sv',
  Tagalog: 'tl',
  Tahitian: 'ty',
  Tajik: 'tg',
  Tamil: 'ta',
  Tatar: 'tt',
  Telugu: 'te',
  Thai: 'th',
  Tibetan: 'bo',
  Tigrinya: 'ti',
  'Tonga (Tonga Islands)': 'to',
  Tsonga: 'ts',
  Tswana: 'tn',
  Turkish: 'tr',
  Turkmen: 'tk',
  Twi: 'tw',
  'Uighur, Uyghur': 'ug',
  Ukrainian: 'uk',
  Urdu: 'ur',
  Uzbek: 'uz',
  Venda: 've',
  Vietnamese: 'vi',
  Volapük: 'vo',
  Walloon: 'wa',
  Welsh: 'cy',
  Wolof: 'wo',
  Xhosa: 'xh',
  Yiddish: 'yi',
  Yoruba: 'yo',
  'Zhuang, Chuang': 'za',
  Zulu: 'zu'
};
