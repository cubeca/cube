import Select from 'components/form/Select';
import TextInput from 'components/form/TextInput';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SearchFiltersCategoryEnum } from '@cubeca/bff-client-oas-axios';
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
  const { t } = useTranslation();

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
          placeholder="Search"
          sx={{ fontSize: '2rem' }}
        />

        <Select
          label={t('Filter by content type')}
          className="typeFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e)}
        >
          <MenuItem.li value={'all'}>{t('All')}</MenuItem.li>
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
        </Select>
      </form>
    </s.Filters>
  );
};

export default UserContentFilter;
