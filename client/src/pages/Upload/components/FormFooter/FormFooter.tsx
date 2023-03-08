import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/system/Unstable_Grid';
import Button from 'components/Button';
import * as s from './FormFooter.styled';
import Lottie from 'lottie-react';
import LoadingAnimation from 'assets/animations/loading-circle.json';

const FormFooter = ({
  isLoading,
  screenIndex,
  lastScreen,
  onScreenIndexChange,
  handleSubmit,
  onSubmit
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const BackButton =
    screenIndex > 0 ? (
      <Button
        onClick={(e) => onScreenIndexChange(--screenIndex)}
        variant="outlined"
        fullWidth={false}
      >
        {t('Back')}
      </Button>
    ) : (
      false
    );

  const nextButton =
    screenIndex < lastScreen ? (
      <Button
        onClick={(e) => onScreenIndexChange(++screenIndex)}
        variant="outlined"
        fullWidth={false}
      >
        {t('Next')}
      </Button>
    ) : (
      <Button
        onClick={handleSubmit(onSubmit)}
        fullWidth={false}
        disabled={isLoading}
      >
        {t('Submit')}
      </Button>
    );

  return (
    <s.FormFooter className={'upload__footer'} my={theme.spacing(5)}>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
          <s.Messages>
            {isLoading ? (
              <s.WaitMessage component="p" variant="body2">
                <Lottie
                  className="icon-loading"
                  animationData={LoadingAnimation}
                  loop={true}
                />
                {t('"Please wait for your media to finish uploading.')}
              </s.WaitMessage>
            ) : (
              <s.SuccessMessage component="p" variant="body2">
                {t('Your upload is ready to submit!')}
              </s.SuccessMessage>
            )}
          </s.Messages>

          <s.Actions>
            {BackButton}
            {nextButton}
          </s.Actions>
        </Grid>
      </Grid>
    </s.FormFooter>
  );
};

export default FormFooter;
