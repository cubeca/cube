import { MenuItem, Typography } from '@mui/material';
import { VideosQueryKeys } from 'api/enums';
import Select from 'components/form/Select';
import useFilterVideos from 'hooks/useFilterVideos';
import { useTranslation } from 'react-i18next';
import { Country, MediaCategories } from 'types/enums';

import * as s from './FeaturedVideos.styled';

const FeaturedVideos = () => {
  const { t } = useTranslation();
  const { setFilter } = useFilterVideos();
  return (
    <s.Filters direction="row" spacing={2} alignItems="center" width="100vw">
      <Typography component="span">{t('Show me')}</Typography>
      <Select
        label={t('All Media Types')}
        onChange={(value: string | number) =>
          setFilter(VideosQueryKeys.Type, value as string)
        }
      >
        <MenuItem value={MediaCategories.All}>{t('All')}</MenuItem>
        <MenuItem value={MediaCategories.Video}>{t('Video')}</MenuItem>
        <MenuItem value={MediaCategories.Audio}>{t('Audio')}</MenuItem>
        <MenuItem value={MediaCategories.VR}>{t('VR')}</MenuItem>
        <MenuItem value={MediaCategories.DigitalPublications}>
          {t('Digital Publications')}
        </MenuItem>
        <MenuItem value={MediaCategories.Talks}>{t('Talks')}</MenuItem>
        <MenuItem value={MediaCategories.Performances}>
          {t('Performances')}
        </MenuItem>
        <MenuItem value={MediaCategories.CulturalTeachings}>
          {t('Cultural Teachings')}
        </MenuItem>
      </Select>
      <Typography component="span">{t('of content')}</Typography>
      <Select
        label={t('In Country')}
        onChange={(value: string | number) =>
          setFilter(VideosQueryKeys.Country, value as string)
        }
        value={Country.Canada}
      >
        <MenuItem value={Country.Canada}>{t('In')} Canada</MenuItem>
      </Select>
      <Select
        label={t('By Any Content Creator')}
        onChange={(value: string | number) =>
          setFilter(VideosQueryKeys.Creator, value as string)
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
      </Select>
    </s.Filters>
  );
};

export default FeaturedVideos;
