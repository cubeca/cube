import { Grid } from '@mui/material';
import { FC, ReactNode } from 'react';
import CreatorsHero from 'assets/images/creators.jpg';
import * as React from 'react';
import Box from '@mui/material/Box';
import { Parallax } from 'react-scroll-parallax';

// function Movement() {
// const {ref}=useParallax<ThumbnailGrid>({speed: 10});
// return <div ref={ref/>}
// };


        // const TranslateY=()=> (
        //     <Parallax translateY={[-20, 10]}>
        //        <Box sx={{ flexGrow: 1 }}>
       
        // useParallax({
        //     translateY: [-100, 100],
        //   }); 


function ThumbnailGrid() {
  return (
    <Box sx={{flexGrow: 1}}>
    <React.Fragment>
    <Grid container spacing={0}>
    <Grid container item spacing={0} rowSpacing= "0">
      <Grid item xs={6}>
       
      </Grid>
      <Grid item xs={6}>
        <img src={CreatorsHero} alt="" width="100%" height="100%"/>
      </Grid>
      <Grid item xs={6}>
      <img src={CreatorsHero} alt="" width="100%" height="100%"/>
      </Grid>
      <Grid item xs={6}>
      <img src={CreatorsHero} alt="" width="100%" height="100%"/>
      </Grid>
      <Grid item xs={6}>
      <img src={CreatorsHero} alt="" width="100%" height="100%"/>
      </Grid>
      <Grid item xs={6}>
        
      </Grid>
      <Grid item xs={6}>
       
      </Grid>
      <Grid item xs={6}>
      <img src={CreatorsHero} alt="" width="100%" height="100%"/>
      </Grid>
      <Grid item xs={6}>
      <img src={CreatorsHero} alt="" width="100%" height="100%"/>
      </Grid>
      </Grid>
      </Grid>
    </React.Fragment>
    </Box>
  );
}

{/* // export default function NestedGrid() { */}
{/* //   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <Grid container spacing={1}>
//         <Grid container item spacing={3}>
//           <FormRow />
//         </Grid>
//         <Grid container item spacing={3}>
//           <FormRow />
//         </Grid>
//         <Grid container item spacing={3}>
//           <FormRow />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }
{/* // interface AboutPanelProps { */}
{/* //   imageContent?: ReactNode;
//   isReversed?: boolean;
//   className?: string;
// }



//     <Grid className={className} item xs={6} sx={{width: '20%'}}>
//     {imageContent}
//     </Grid>
//     <Grid item xs={6}>
    
//     </Grid>
//   </Grid>
// ); */} 

export default ThumbnailGrid;
