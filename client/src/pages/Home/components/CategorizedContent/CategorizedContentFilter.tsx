import { ContentQueryKeys } from 'api/enums';
import Select from 'components/form/Select';
import TextInput from 'components/form/TextInput';
import useFilterContent from 'hooks/useFilterContent';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContentCategories, SignLanguage } from 'types/enums';
import * as s from './CategorizedContentFilter.styled';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';

const CategorizedContentFilter = () => {
  const { control, handleSubmit } = useForm();
  const { t } = useTranslation();
  const { setFilter } = useFilterContent();
  return (
    <s.Filters>

      <TextInput
        id="searchFilter"
        name="searchFilter"
        control={control}
        variant="standard"
        fullWidth
        placeholder='Search'
        className='searchFilter'
      />

      {
        /* 
        This list may map to database categories but it isn't consistant with content types defined in Figma designs. 
        Figma designs have the following content types:
        - Video
        - Audio
        - Activity Booklets
        - Digital Publications
        - Collaborations
        - External Link
        */
      }

      <Select
        label={t('Select Type')}
        className='typeFilter'
        onChange={(value: string | number) =>
          setFilter(ContentQueryKeys.Type, value as string)
        }
        
      >
        <MenuItem.li value={ContentCategories.All}>{t('All')}</MenuItem.li>
        <MenuItem.li value={ContentCategories.Video}>{t('Video')}</MenuItem.li>
        <MenuItem.li value={ContentCategories.Audio}>{t('Audio')}</MenuItem.li>
        <MenuItem.li value={ContentCategories.VR}>{t('PDF')}</MenuItem.li>
        <MenuItem.li value={ContentCategories.DigitalPublications}>
          {t('Digital Publications')}
        </MenuItem.li>
        <MenuItem.li value={ContentCategories.Talks}>{t('Talks')}</MenuItem.li>
        <MenuItem.li value={ContentCategories.Performances}>
          {t('Performances')}
        </MenuItem.li>
        <MenuItem.li value={ContentCategories.CulturalTeachings}>
          {t('Cultural Teachings')}
        </MenuItem.li>
        <MenuItem.li value={ContentQueryKeys.SignLanguage}>
          {t('Has Sign Language')}
        </MenuItem.li>
        <MenuItem.li value={SignLanguage.ASL}>{t('ASL Available')}</MenuItem.li>
        <MenuItem.li value={'artist 1'}>{t('By an Artist')}</MenuItem.li>
      </Select>
    </s.Filters>
  );
};

export default CategorizedContentFilter;
