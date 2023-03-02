import { Stack, Typography, Link as MuiLink } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Contributor } from 'types/content';
// import useMediaQuery from '@mui/material';

// const matches = useMediaQuery('(min-width:600px)');
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
              <Typography component="p" variant="h4" sx={{ color: '#D9FFEE' }}>
                {contributor.link ? (
                  <Link
                    to={contributor.link}
                    style={{ color: '#D9FFEE', textDecoration: 'none' }}
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
