/**
 * `Collaborators` is a component that renders a list of collaborators associated with a piece of content. It displays each
 * collaborator's logo (if available) and name. If a collaborator has a social profile URL, their name is rendered as a clickable
 * link that navigates to their profile page.
 *
 * ***** Note *****
 * While a Collaborator and Contributor are similar, they are not the same. A Collaborator is an organization or entity
 * with a creator profile on Cube Commons that has co-produced a piece of content, while a Contributor is an individual is any individual
 * that's credited with the content.
 * @param {CollaboratorDetails[]} collaborators An array of collaborator details, including name, logo URL, and social profile URL.
 */

import { Stack, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { CollaboratorDetails } from 'types/content';
import * as s from './Content.styled';

const Collaborators = ({
  collaborators
}: {
  collaborators: CollaboratorDetails[];
}) => {
  return (
    <>
      {Array.isArray(collaborators) &&
        collaborators.map((c: any, i: number) => (
          <s.Collaborator key={`${c}-${i}`}>
            <Stack direction="row" alignItems="center" aria-label="Creator of this content">
              <s.CollaboratorThumb>
                {c.logoUrl && <img src={c.logoUrl} alt="" width="40" />}
              </s.CollaboratorThumb>
              <Stack>
                <s.CollaboratorName component="p" variant="h5">
                  {c?.socialUrl ? (
                    <Link to={`/profile/${c.tag.toString().toLowerCase()}`}>
                      {c.name}
                    </Link>
                  ) : (
                    c.organization
                  )}
                </s.CollaboratorName>

                {c.tag && (
                  <s.CollaboratorSocial
                    aria-label="their profile on cube commons"
                    href={`/profile/${c.tag.toString().toLowerCase()}`}
                  >
                    {c.tag}
                  </s.CollaboratorSocial>
                )}
              </Stack>
            </Stack>
          </s.Collaborator>
        ))}
    </>
  );
};

export default Collaborators;
