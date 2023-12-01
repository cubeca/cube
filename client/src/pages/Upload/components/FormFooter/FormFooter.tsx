import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/system/Unstable_Grid';
import Button from 'components/Button';
import * as s from './FormFooter.styled';
import Lottie from 'lottie-react';
import LoadingAnimation from 'assets/animations/loading-circle.json';

interface FormFooterProps {
  isLoading: boolean;
  screens: string[];
  screenIndex: number;
  onScreenIndexChange: (screen: number) => void;
  handleSubmit: () => void;
  isNextDisabled?: boolean;
}

const FormFooter = ({
  isLoading,
  screens,
  screenIndex,
  onScreenIndexChange,
  handleSubmit,
  isNextDisabled
}: FormFooterProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const lastScreen = screens.length - 1;

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
    screenIndex == lastScreen ? (
      <Button
        onClick={handleSubmit}
        fullWidth={false}
        disabled={isLoading || isNextDisabled}
      >
        {t('Accept Terms')}
      </Button>
    ) : (
      <Button
        onClick={(e) => onScreenIndexChange(++screenIndex)}
        fullWidth={false}
        disabled={isNextDisabled || isLoading}
      >
        {t('Next Step: ' + screens[screenIndex + 1])}
      </Button>
    );

  const WaitMessage =
    screenIndex == lastScreen ? (
      <s.WaitMessage component="p" variant="body2">
        <Lottie
          className="icon-loading"
          animationData={LoadingAnimation}
          loop={true}
        />
        {t('Please wait for your media to finish uploading.')}
      </s.WaitMessage>
    ) : (
      <s.WaitMessage component="p" variant="body2">
        <Lottie
          className="icon-loading"
          animationData={LoadingAnimation}
          loop={true}
        />
        {t(
          'Proceed to the next step while your media finishes uploading in the background.'
        )}
      </s.WaitMessage>
    );

  const SuccessMessage =
    screenIndex == lastScreen ? (
      <s.SuccessMessage component="p" variant="body2">
        {t('Your upload is ready to submit!')}
      </s.SuccessMessage>
    ) : (
      false
    );

  const Message = isLoading ? WaitMessage : SuccessMessage;

  return (
    <s.FormFooter className={'upload__footer'} my={theme.spacing(5)}>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={6} mdOffset={3}>
          <s.Messages>{Message}</s.Messages>
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
