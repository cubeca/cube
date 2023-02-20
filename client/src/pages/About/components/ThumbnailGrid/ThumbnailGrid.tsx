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
    <Box sx={{ flexGrow: 1 }}>
      <React.Fragment>
        <Grid container spacing={0}>
          <Grid container item spacing={0} rowSpacing="0">
            <Grid item xs={6}>

            </Grid>
            <Grid item xs={6}>
              <img src={CreatorsHero} alt="" width="100%" height="100%" />
            </Grid>
            <Grid item xs={6}>
              <img src={CreatorsHero} alt="" width="100%" height="100%" />
            </Grid>
            <Grid item xs={6}>
              <img src={CreatorsHero} alt="" width="100%" height="100%" />
            </Grid>
            <Grid item xs={6}>
              <img src={CreatorsHero} alt="" width="100%" height="100%" />
            </Grid>
            <Grid container item spacing={0} rowSpacing="0" display={{ xs: 'none', md: 'visible' }}>
              <Grid item xs={6}>
                <img src={CreatorsHero} alt="" width="100%" height="100%" />
              </Grid>
            </Grid>

          </Grid>

        </Grid>
      </React.Fragment>
    </Box>
  );
}

export default ThumbnailGrid;
