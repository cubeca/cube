import { ContentQueryKeys } from 'api/enums';
import Select from 'components/form/Select';
import TextInput from 'components/form/TextInput';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContentCategories } from 'types/enums';
import * as s from './UserContentFilter.styled';
import * as MenuItem from '../../../components/form/Select/MenuItem.styled';
import { FC } from 'react';

interface UserContentFilterProps {
  setSearchTerm: any;
  searchFilterType: any;
  setSearchFilterType: any;
}

const UserContentFilter: FC<UserContentFilterProps> = ({
  setSearchTerm,
  searchFilterType,
  setSearchFilterType
}) => {
  const { control, handleSubmit } = useForm();
  const { t } = useTranslation();

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
          className="searchFilter"
          control={control}
          variant="standard"
          placeholder="Search"
          sx={{ fontSize: '2rem' }}
        />

        <Select
          label={t('Filter by content type')}
          className="typeFilter"
          value={searchFilterType}
          onChange={(e) => setSearchFilterType(e)}
        >
          <MenuItem.li value={ContentCategories.All}>{t('All')}</MenuItem.li>
          <MenuItem.li value={ContentCategories.Video}>
            {t('Video')}
          </MenuItem.li>
          <MenuItem.li value={ContentCategories.Audio}>
            {t('Audio')}
          </MenuItem.li>
          <MenuItem.li value={ContentCategories.ActivityBook}>
            {t('Activity Book')}
          </MenuItem.li>
          <MenuItem.li value={ContentCategories.DigitalPublication}>
            {t('Digital Publication')}
          </MenuItem.li>
          <MenuItem.li value={ContentCategories.Collaboration}>
            {t('Collaboration')}
          </MenuItem.li>
          <MenuItem.li value={'artist 1'}>{t('By Artist')}</MenuItem.li>
          <MenuItem.li value={'organization 1'}>
            {t('By Organization')}
          </MenuItem.li>
          <MenuItem.li value={ContentQueryKeys.SignLanguage}>
            {t('Has Sign Language')}
          </MenuItem.li>
        </Select>
      </form>
    </s.Filters>
  );
};

export default UserContentFilter;
