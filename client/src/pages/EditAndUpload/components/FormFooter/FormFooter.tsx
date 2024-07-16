/**
 * `FormFooter` is designed to provide navigation and action controls for the multi-screen form interface. It supports conditional
 * rendering of navigation buttons based on the current screen index and the total number of screens, and it allows for disabling
 * the "Next" button based on form state or validation.
 *
 * @param {boolean} isLoading Indicates if an action is currently being processed, showing a loading animation if true.
 * @param {string[]} screens An array of screen identifiers that define the steps in the form process.
 * @param {number} screenIndex The current index in the `screens` array, determining which form step is active.
 * @param {(screen: number) => void} onScreenIndexChange Callback function to change the current screen index.
 * @param {() => void} handleSubmit Callback function to handle form submission.
 * @param {boolean} [isNextDisabled=false] Optional flag to disable the "Next" button, typically used for form validation.
 * @param {boolean} [editMode=false] Optional flag to indicate if the form is in edit mode.
 */

import { Box, Typography, useTheme } from '@mui/material';
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
  editMode?: boolean;
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

  const lastScreen = screens.length - 2;
  const onUploadScreen = screens.length - 1;

  const BackButton =
    screenIndex > 0 ? (
      <Button
        onClick={() => onScreenIndexChange(--screenIndex)}
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
        onClick={() => {
          handleSubmit();
          onScreenIndexChange(++screenIndex);
        }}
        fullWidth={false}
        disabled={isLoading || isNextDisabled}
      >
        {t('Accept Terms')}
      </Button>
    ) : (
      <Button
        onClick={() => onScreenIndexChange(++screenIndex)}
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
  if (screenIndex !== onUploadScreen)
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
          <Box
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {screenIndex !== 0 && (
              <Typography
                component="p"
                variant="body2"
                sx={{ width: '80%', maxWidth: '650px' }}
              >
                {t(
                  "You can click the Back button at any time to return to a previous screen and your data will be retained - however, you'll have to reselect your media and cover image File(s)."
                )}
              </Typography>
            )}
          </Box>
        </Grid>
      </s.FormFooter>
    );
  else return null;
};

export default FormFooter;
