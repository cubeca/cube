import { Stack, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { CollaboratorDetails, Contributor } from 'types/content';
import * as s from './Content.styled';
// import useMediaQuery from '@mui/material';

// const matches = useMediaQuery('(min-width:600px)');
// const Contributors: FC<{ contributors: CollaboratorDetails[] }> = ({
const Contributors = ({
  contributors
}: {
  contributors: CollaboratorDetails[];
}) => {
  return (
    <>
      {/* <div>Contributors</div> */}
      {Array.isArray(contributors) &&
        contributors.map((c: any, i: number) => (
          <s.Contributor key={`${c}-${i}`}>
            <Stack direction="row" alignItems="center">
              <s.ContributorThumb>
                {c.logoUrl && <img src={c.logoUrl} alt="" width="40" />}
              </s.ContributorThumb>
              <Stack>
                <s.ContributorName component="p" variant="h5">
                  {c?.socialUrl ? (
                    <Link to={`/profile/${c.tag.toString().toLowerCase()}`}>
                      {c.name}
                    </Link>
                  ) : (
                    // <Link to={`${c.socialUrl.toString()}`}>{c.name}</Link>
                    c.organization
                  )}
                </s.ContributorName>

                {c.tag && (
                  <s.ContributorSocial
                    href={`/profile/${c.tag.toString().toLowerCase()}`}
                  >
                    {c.tag}
                  </s.ContributorSocial>
                )}
              </Stack>
            </Stack>
          </s.Contributor>
        ))}
      {/* old structure */}
      {/* {Array.isArray(contributors) &&
        contributors.map((c: any, i: number) => (
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
        ))} */}
    </>
  );
};

export default Contributors;
