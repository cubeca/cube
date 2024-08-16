/**
 * `UserContentFilter` provides filtering functionality for user content. The component allows users to filter content based on a
 * search term and a category filter. The `SearchFiltersCategoryEnum` from `@cubeca/cube-svc-client-oas-axios` is used to define the
 * available categories for filtering. The `setSearchTerm` and `setCategoryFilter` functions are used to update the parent component's state
 * based on user input.
 *
 * @param {Function} setSearchTerm Function to update the search term in the parent component's state.
 * @param {string} categoryFilter The current category filter value.
 * @param {Function} setCategoryFilter Function to update the category filter in the parent component's state.
 */

import Select from 'components/form/Select';
import TextInput from 'components/form/TextInput';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SearchFiltersCategoryEnum } from '@cubeca/cube-svc-client-oas-axios';
import * as s from './UserContentFilter.styled';
import * as MenuItem from '../../../components/form/Select/MenuItem.styled';
import { FC } from 'react';

interface UserContentFilterProps {
  setSearchTerm: any;
  categoryFilter: any;
  setCategoryFilter: any;
}

const UserContentFilter: FC<UserContentFilterProps> = ({
  setSearchTerm,
  categoryFilter,
  setCategoryFilter
}) => {
  const { control } = useForm();
  const { t } = useTranslation('common');

  categoryFilter = categoryFilter ? categoryFilter : 'all';

  const handleSearchTermChange = async (e: any) => {
    const rawValue = e.target.value;
    const sanitizedValue = rawValue
      .split(',')
      .map((part: any) => part.trim())
      .filter((part: any) => part !== '')
      .join('&');

    setSearchTerm(sanitizedValue);
  };

  return (
    <s.Filters>
      <form onChange={(e) => handleSearchTermChange(e)}>
        <TextInput
          id="searchFilter"
          name="searchFilter"
          className="searchFilter"
          control={control}
          variant="standard"
          placeholder={t('Search Input Text')}
          sx={{ fontSize: '2rem' }}
          aria-label="search"
          aria-placeholder="type your search term here"
        />

        <Select
          label={t('Filter Menu Title')}
          className="typeFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e)}
          aria-label="filter by type"
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

export default UserContentFilter;
