import { ContentQueryKeys } from 'api/enums';
import Select from 'components/form/Select';
import TextInput from 'components/form/TextInput';
import useFilterContent from 'hooks/useFilterContent';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContentCategories, SignLanguage } from 'types/enums';
import * as s from './CategorizedContentFilter.styled';
import * as MenuItem from '../../../../components/form/Select/MenuItem.styled';
import { FC, ReactNode } from 'react';

interface CategorizedContentFilterProps {
  setSearchTerm: any;
}

const CategorizedContentFilter: FC<CategorizedContentFilterProps> = ({
  setSearchTerm
}) => {
  const { control } = useForm();
  const { t } = useTranslation();
  const { setFilter } = useFilterContent();

  const handleChange = async (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <s.Filters>
      <form onChange={(e) => handleChange(e)}>
        <TextInput
          id="searchFilter"
          name="searchFilter"
          control={control}
          variant="standard"
          fullWidth
          placeholder="Search"
          className="searchFilter"
        />

        <Select
          label={t('Filter Results')}
          className="typeFilter"
          onChange={(value: string | number) =>
            setFilter(ContentQueryKeys.Type, value as string)
          }
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

export default CategorizedContentFilter;
