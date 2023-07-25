import { MenuItem, Typography } from '@mui/material';
import { ContentQueryKeys } from 'api/enums';
import Select from 'components/form/Select';
import TextInput from 'components/form/TextInput';
import useFilterContent from 'hooks/useFilterContent';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContentCategories, SignLanguage } from 'types/enums';
import * as s from './CategorizedContentFilter.styled';

const CategorizedContentFilter = () => {
  const { control, handleSubmit } = useForm();
  const { t } = useTranslation();
  const { setFilter } = useFilterContent();
  return (
    <s.Filters direction="row" spacing={2} alignItems="center">
      <Typography component="span">{t('Search')}</Typography>
      <TextInput
        id="profileName"
        name="profileName"
        control={control}
        variant="standard"
        fullWidth
        sx={{ fontSize: '2rem' }}
      />
      <Select
        label={t('Select Type')}
        onChange={(value: string | number) =>
          setFilter(ContentQueryKeys.Type, value as string)
        }
      >
        <MenuItem value={ContentCategories.All}>{t('All')}</MenuItem>
        <MenuItem value={ContentCategories.Video}>{t('Video')}</MenuItem>
        <MenuItem value={ContentCategories.Audio}>{t('Audio')}</MenuItem>
        <MenuItem value={ContentCategories.VR}>{t('PDF')}</MenuItem>
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
        <MenuItem value={ContentQueryKeys.SignLanguage}>
          {t('Has Sign Language')}
        </MenuItem>
        <MenuItem value={SignLanguage.ASL}>{t('ASL Available')}</MenuItem>
        <MenuItem value={'artist 1'}>{t('By an Artist')}</MenuItem>
      </Select>
    </s.Filters>
  );
};

export default CategorizedContentFilter;
