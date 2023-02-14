import { Stack, Typography, Link as MuiLink } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Contributor } from 'types/content';

const Contributors: FC<{ contributors: Contributor[] }> = ({
  contributors
}) => {
  return (
    <>
      {contributors.map((contributor, i) => (
        <Stack key={`${contributor.name}-${i}`} pb="1rem">
          <Stack direction="row" alignItems="flex-start">
            <img
              src={contributor.logoUrl}
              alt=""
              style={{ paddingRight: '10px' }}
              width="50"
            />
            <Stack pt="5px">
              
            {contributor.Artist && (
                <Typography>
                  Artist
                </Typography>
              )}
              <Typography component="p" sx={{ fontWeight: 'bold' }}>
                {contributor.link ? (
                  <Link
                    to={contributor.link}
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    {contributor.name}
                  </Link>
                ) : (
                  contributor.name
                )}
              </Typography>
              {contributor.socialUrl && (
                <MuiLink href={contributor.socialUrl}>
                  {contributor.socialHandle}
                </MuiLink>
              )}
            </Stack>
          </Stack>
        </Stack>
      ))}
    </>
  );
};

export default Contributors;
