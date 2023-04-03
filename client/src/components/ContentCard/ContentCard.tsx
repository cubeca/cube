import { Box, Card, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as PlayButton } from 'assets/icons/play.svg';
import * as s from './ContentCard.styled';
import useContentFile from 'hooks/useContentFile';
import { FilesDetailsResponsePlayerInfoOneOf1 } from '@cubeca/bff-client-oas-axios';

export interface Props {
  coverImageFileId: string;
  creator?: string;
  title: string;
  icon?: string;
  contentId: string;
}

const ContentCard = ({
  creator,
  title,
  coverImageFileId,
  contentId
}: Props) => {
  const { data: image, isLoading, isError } = useContentFile(coverImageFileId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  const { playerInfo: imageInfo } = image!;

  return (
    <s.ContentCard>
      <Link to={`/content/${contentId}`}>
        <s.Thumbnail
          sx={{
            backgroundImage: `url('${
              (imageInfo as FilesDetailsResponsePlayerInfoOneOf1).publicUrl
            }')`
          }}
        >
          {/* {icon && <img src={icon} alt="" />} */}
        </s.Thumbnail>

        <s.Data direction="row" alignItems="space-between">
          <Typography component="span" className="title">
            {title}
          </Typography>
          {creator && (
            <Typography component="span" className="creator">
              {creator}
            </Typography>
          )}
        </s.Data>
      </Link>
    </s.ContentCard>
  );
};

export default ContentCard;
