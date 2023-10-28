import { Stack, Typography, Link as MuiLink } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Contributor } from 'types/content';
import * as s from './Content.styled';
// import useMediaQuery from '@mui/material';

// const matches = useMediaQuery('(min-width:600px)');
const Contributors: FC<{ contributors: Contributor[] }> = ({
  contributors
}) => {
  return (
    <>
      {/* <div>Contributors</div> */}
      {Array.isArray(contributors) &&
        contributors.map((c: Contributor, i: number) => (
          <s.Contributor key={`${c}-${i}`}>
            <Stack direction="row" alignItems="center">
              <s.ContributorThumb>
                {c.logoUrl && <img src={c.logoUrl} alt="" width="40" />}
              </s.ContributorThumb>
              <Stack>
                <s.ContributorName component="p" variant="h5">
                  {c?.socialUrl ? (
                    <Link to={`${c.socialUrl.toString()}`}>{c.name}</Link>
                  ) : (
                    c
                  )}
                </s.ContributorName>

                {c.socialUrl && (
                  <s.ContributorSocial href={c.socialUrl}>
                    {c.socialHandle}
                  </s.ContributorSocial>
                )}
              </Stack>
            </Stack>
          </s.Contributor>
        ))}
    </>
  );
};

export default Contributors;
