import { MenuItem, Stack } from '@mui/material';
import ContentCard from 'components/ContentCard';
import { useTranslation } from 'react-i18next';
import * as s from './CategorizedContent.styled';
import { useState } from 'react';
import { ContentCategories, ContentLists } from 'types/enums';
import useContent from 'hooks/useContent';
import { ContentLoader } from 'components/Loaders';

const CategorizedContent = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(
    ContentCategories.Video
  );
  const { data, isLoading } = useContent(
    ContentLists.Categorized,
    selectedCategory
  );

  const content = data?.content ?? [];

  const categories = [
    {
      text: t('Video'),
      value: ContentCategories.Video
    },
    {
      text: t('VR'),
      value: ContentCategories.VR
    },
    {
      text: t('Digital Publications'),
      value: ContentCategories.DigitalPublications
    },
    {
      text: t('Talks'),
      value: ContentCategories.Talks
    },
    {
      text: t('Performances'),
      value: ContentCategories.Performances
    },
    {
      text: t('Cultural Teachings'),
      value: ContentCategories.CulturalTeachings
    }
  ];

  return (
    <Stack>
      <s.Categories component="ul">
        {categories.map((category) => (
          <MenuItem
            key={category.text}
            onClick={() => {
              setSelectedCategory(category.value);
            }}
            sx={{ padding: '1rem' }}
            selected={selectedCategory === category.value}
          >
            {category.text}
          </MenuItem>
        ))}
      </s.Categories>
      <Stack spacing={2} py="4rem">
        <Stack direction="row" spacing={6}>
          {!isLoading ? (
            content.map((c) => (
              <ContentCard
                key={c.title}
                image={c.thumbnailUrl}
                title={c.title}
                creator={c.creator}
                url={c.url}
                icon={c.iconUrl}
              />
            ))
          ) : (
            <ContentLoader size={6} />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CategorizedContent;
