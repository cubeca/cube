/**
 * `Contributors` is a component that renders a list of contributors or collaborating organizations
 * associated with a piece of content. It displays each contributor's logo (if available) and name. If a contributor has
 * a social profile URL, their name is rendered as a clickable link that navigates to their profile page.
 *
 * @param {CollaboratorDetails[]} contributors An array of contributor details, including name, logo URL, and social profile URL.
 */

import { Stack, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { CollaboratorDetails, Contributor } from 'types/content';
import * as s from './Content.styled';

const Contributors = ({
  contributors
}: {
  contributors: CollaboratorDetails[];
}) => {
  return (
    <>
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
    </>
  );
};

export default Contributors;
