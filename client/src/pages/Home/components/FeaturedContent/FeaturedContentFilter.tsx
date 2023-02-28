import { MenuItem, Typography } from '@mui/material';
import { ContentQueryKeys } from 'api/enums';
import Select from 'components/form/Select';
import TextInput from 'components/form/TextInput';
import useFilterContent from 'hooks/useFilterContent';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContentCategories, SignLanguage } from 'types/enums';

import * as s from './FeaturedContent.styled';

const FeaturedContent = () => {
  const { control, handleSubmit } = useForm();
  const { t } = useTranslation();
  const { setFilter } = useFilterContent();
  return (
    <s.Filters direction="row" spacing={2} alignItems="center" width="100vw">
      <Typography component="span">{t('Select')}</Typography>
      <Select
        label={t('Media Type')}
        onChange={(value: string | number) =>
          setFilter(ContentQueryKeys.Type, value as string)
        }
      >
        <MenuItem value={ContentCategories.All}>{t('All')}</MenuItem>
        <MenuItem value={ContentCategories.Video}>{t('Video')}</MenuItem>
        <MenuItem value={ContentCategories.Audio}>{t('Audio')}</MenuItem>
        <MenuItem value={ContentCategories.VR}>{t('PDF')}</MenuItem>
      </Select>
      <Select
        label={t('Content Type')}
        onChange={(value: string | number) =>
          setFilter(ContentQueryKeys.Type, value as string)
        }
      >
        <MenuItem value={ContentCategories.DigitalPublications}>
          {t('Digital Publications')}
        </MenuItem>
        <MenuItem value={ContentCategories.Talks}>{t('Talks')}</MenuItem>
        <MenuItem value={ContentCategories.Performances}>
          {t('Performances')}
        </MenuItem>
        <MenuItem value={ContentCategories.CulturalTeachings}>
          {t('Cultural Teachings')}
        </MenuItem>
      </Select>
      {/* <Typography component="span">{t('content type')}</Typography> */}
      <Select
        label={t('Sign Language')}
        onChange={(value: string | number) =>
          setFilter(ContentQueryKeys.SignLanguage, value as string)
        }
        value={SignLanguage.ASL}
      >
        <MenuItem value={SignLanguage.ASL}>{t('Available In')} ASL</MenuItem>
      </Select>
      <Typography component="span">{t('Search')}</Typography>
      <TextInput
        id="profileName"
        name="profileName"
        control={control}
        variant="outlined"
        fullWidth
        sx={{ fontSize: '2rem' }}
      />
      {/* <Select
        label={t('By Any Content Creator')}
        onChange={(value: string | number) =>
          setFilter(ContentQueryKeys.Creator, value as string)
        }
      >
        <MenuItem value={'artist 1'}>Artist 1</MenuItem>
        <MenuItem value={'artist 2'}>Artist 2</MenuItem>
        <MenuItem value={'artist 3'}>Artist 3</MenuItem>
        <MenuItem value={'artist 4'}>Artist 4</MenuItem>
      </Select>
      <Select
        label={t('Items per Page')}
        onChange={(value: string | number) => {
          console.log(value);
        }}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={15}>15</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </Select> */}
    </s.Filters>
  );
};

export default FeaturedContent;
