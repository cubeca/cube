import { Stack, Typography, Link as MuiLink } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Contributor } from 'types/content';
import * as s from './Content.styled';
// import useMediaQuery from '@mui/material';

// const matches = useMediaQuery('(min-width:600px)');
const Contributors: FC<{ contributors: string[] }> = ({ contributors }) => {
  return (
    <>
      {contributors.map((contributor, i) => (
        <div key={i}>Contributors</div>
        // <s.Contributor key={`${contributor.name}-${i}`}>
        //   <Stack direction="row" alignItems="center">

        //     <s.ContributorThumb>
        //       {contributor.logoUrl && (
        //         <img
        //         src={contributor.logoUrl}
        //         alt=""
        //         width="40"
        //         />
        //       )}
        //     </s.ContributorThumb>
        //     <Stack>
        //       <s.ContributorName component="p" variant="h5">
        //         {contributor.link ? (
        //           <Link to={contributor.link} >
        //             {contributor.name}
        //           </Link>
        //         ) : (
        //           contributor.name
        //         )}
        //       </s.ContributorName>

        //       {contributor.socialUrl && (
        //         <s.ContributorSocial href={contributor.socialUrl}>
        //           {contributor.socialHandle}
        //         </s.ContributorSocial>
        //       )}
        //     </Stack>
        //   </Stack>
        // </s.Contributor>
      ))}
    </>
  );
};

export default Contributors;
