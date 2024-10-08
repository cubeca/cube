import { SearchFiltersCategoryEnum } from '@cubeca/cube-svc-client-oas-axios';
import Select from 'components/form/Select';
import TextInput from 'components/form/TextInput';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as s from './CategorizedContentFilter.styled';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';
import { FC, useEffect } from 'react';

interface CategorizedContentFilterProps {
  setSearchTerm: any;
  categoryFilter: any;
  setCategoryFilter: any;
  tagSearchTerm?: string;
}

const CategorizedContentFilter: FC<CategorizedContentFilterProps> = ({
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  tagSearchTerm
}) => {
  const { control } = useForm();
  const { t } = useTranslation('common');

  categoryFilter = categoryFilter ? categoryFilter : 'all';

  const handleSearchTermChange = async (e: any) => {
    const rawValue = e.target.value;
    const sanitizedValue = rawValue
      .split(',')
      .map((part: any) => part.trim())
      .filter((part: any) => part !== '') // Remove empty parts
      .join('&');

    setSearchTerm(sanitizedValue);
  };

  useEffect(() => {
    if (tagSearchTerm) {
      setSearchTerm(tagSearchTerm);
    }
  }, [tagSearchTerm]);

  return (
    <s.Filters>
      <form onChange={(e) => handleSearchTermChange(e)}>
        <TextInput
          id="searchFilter"
          name="searchFilter"
          control={control}
          variant="standard"
          placeholder={t('Search Input Text')}
          className="searchFilter"
          defaultValue={tagSearchTerm ? tagSearchTerm : ''}
        />

        <Select
          label={t('Filter Menu Title')}
          className="typeFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e)}
        >
          <MenuItem.li value={'all'}>{t('Filter Menu Button')}</MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.Video}>
            {t('Video')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.Audio}>
            {t('Audio')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.ActivityBook}>
            {t('Activities')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.DigitalPublications}>
            {t('Publications')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.Collaborations}>
            {t('Collaboration')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.SignLanguage}>
            {t('Has Sign Language')}
          </MenuItem.li>
          <MenuItem.li value={'playlist'}>{t('Playlists')}</MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.SignLanguage}>
            {t('A la langue des signes')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.Video}>
            {t('Vidéo')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.Audio}>
            {t('L`Audio')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.ActivityBook}>
            {t('Activités')}
          </MenuItem.li>
        </Select>
      </form>
    </s.Filters>
  );
};

export default CategorizedContentFilter;
