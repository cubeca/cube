import { SearchFiltersCategoryEnum } from '@cubeca/cube-svc-client-oas-axios';
import Select from 'components/form/Select';
import TextInput from 'components/form/TextInput';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as s from './CategorizedContentFilter.styled';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';
import { FC } from 'react';
import { Menu } from '@mui/material';

interface CategorizedContentFilterProps {
  setSearchTerm: any;
  categoryFilter: any;
  setCategoryFilter: any;
}

const CategorizedContentFilter: FC<CategorizedContentFilterProps> = ({
  setSearchTerm,
  categoryFilter,
  setCategoryFilter
}) => {
  const { control } = useForm();
  const { t } = useTranslation();

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

  return (
    <s.Filters>
      <form onChange={(e) => handleSearchTermChange(e)}>
        <TextInput
          id="searchFilter"
          name="searchFilter"
          control={control}
          variant="standard"
          placeholder="Search/Rechercher"
          className="searchFilter"
        />

        <Select
          label={t('Filter/Filtre')}
          className="typeFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e)}
        >
          <MenuItem.li value={'all'}>{t('All/Toute')}</MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.Video}>
            {t('Video')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.Audio}>
            {t('Audio')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.ActivityBook}>
            {t('Activity Book')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.DigitalPublications}>
            {t('Digital Publication')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.Collaborations}>
            {t('Collaboration')}
          </MenuItem.li>
          <MenuItem.li value={SearchFiltersCategoryEnum.SignLanguage}>
            {t('Has Sign Language')}
          </MenuItem.li>
          <MenuItem.li value={'playlist'}>{t('Playlist')}</MenuItem.li>
        </Select>
      </form>
    </s.Filters>
  );
};

export default CategorizedContentFilter;
