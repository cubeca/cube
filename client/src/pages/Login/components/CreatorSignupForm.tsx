import { Box, Grid, Stack, Typography } from '@mui/material';
import EmailInput from 'components/form/EmailInput';
import ErrorMessage from 'components/form/ErrorMessage';
import PasswordInput from 'components/form/PasswordInput';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { creatorSignup } from 'api/auth';
import { useState } from 'react';
import Button from 'components/Button';
import TextInput from 'components/form/TextInput';
import CheckboxInput from 'components/form/CheckboxInput';
import LegalModalSignup from 'components/Legal/LegalModalSignup';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import ReactPlayer from 'react-player';
import { ReactComponent as PlaySymbol } from 'assets/icons/play-symbol.svg';
import CtaImage1 from 'assets/images/EN-Cover.jpg';
import CtaImage2 from 'assets/images/FR-Cover.jpg';
import * as s from '../Login.styled';

export const CreatorSignupForm = () => {
  const { t } = useTranslation('common');
  const { control, handleSubmit } = useForm();
  const [displayLegal, setDisplayLegal] = useState(false);
  const [submittableData, setSubmittableData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    promotions: false,
    terms: false,
    organization: '',
    website: '',
    tag: '',
    isOver18: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const handleSignup = async () => {
    const {
      firstName,
      lastName,
      email,
      password,
      promotions,
      terms,
      organization,
      website,
      tag,
      isOver18
    } = submittableData;
    setDisplayLegal(false);
    try {
      setErrorMessage('');
      await creatorSignup(
        `${firstName} ${lastName}`,
        organization,
        website,
        tag.startsWith('@') ? tag.substring(1) : tag,
        email,
        password,
        !!promotions,
        terms,
        isOver18
      );

      setIsFormSubmitted(true);
    } catch (e: any) {
      setErrorMessage(e.response?.data || t('An Error occured during sign up'));
    }
  };

  const onSubmit = async (data: FieldValues) => {
    setSubmittableData({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      promotions: data.promotions,
      terms: data.terms,
      organization: data.organization,
      website: data.website,
      tag: data.tag,
      isOver18: data.ageConfirmation
    });
    setDisplayLegal(true);
  };

  if (isFormSubmitted) {
    return (
      <>
        <Typography variant="h2" component="h2" color="#D9FFEE" pb={4}>
          {t('Verify Email Header')}
        </Typography>
        <Typography variant="h4" component="h4" pb={4}>
          {t('Verify Email Body')}
        </Typography>
        <Typography variant="h4" component="h4" color="#D9FFEE" pb={4}>
          {t('Verify Email HeaderFR')}
        </Typography>
        <Typography variant="h4" component="h4" pb={4}>
          {t('Verify Email BodyFR')}
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h3" component="h3" pb={4}>
        {t('Apply for a Creator Account')}
      </Typography>
      <Typography variant="h5" component="h5" pb={4}>
        {t('Demander un Compte `Creator`')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={2} pb={2}>
          <TextInput
            control={control}
            name="firstName"
            label={t('First name | Prénom')}
            fullWidth
            helperText={t('First name required')}
            variant="outlined"
            placeholder="First"
          />
          <TextInput
            control={control}
            name="lastName"
            label={t('Last name | Nom de famille')}
            fullWidth
            helperText={t('Last name required')}
            variant="outlined"
            placeholder="Last"
          />
        </Stack>
        <Stack spacing={2}>
          <TextInput
            control={control}
            name="organization"
            label={t('Organization name | Nom de l`organisation')}
            fullWidth
            helperText={t('Organization name required')}
            variant="outlined"
            placeholder="Organization"
          />
          <TextInput
            control={control}
            name="website"
            label={t('Website')}
            fullWidth
            helperText={t('Website required')}
            variant="outlined"
            placeholder="https://www.example.com"
          />
          <TextInput
            control={control}
            name="tag"
            label={t('Organization Tag | Hashtag de l`organisation')}
            fullWidth
            helperText={t('Tag required')}
            variant="outlined"
            placeholder="OrgName"
          />
          <EmailInput
            control={control}
            name="email"
            label={t('E-mail')}
            fullWidth
            helperText={t('E-mail address required')}
            variant="outlined"
            placeholder="name@example.com"
          />
          <PasswordInput
            control={control}
            name="password"
            label={t('Password | Mot de passe')}
            fullWidth
            helperText={t('Password required')}
            variant="outlined"
          />
          <Stack>
            <Typography component="p" variant="h6" pb={4}>
              {t('Account FeesP1')}
            </Typography>
            <Grid container>
              <Grid xs={8} sm={6} md={6}>
                <s.InfoWrapper>
                  <ReactPlayer
                    url="https://customer-ayah89x7bps0l5b8.cloudflarestream.com/c36a9be6e1918ea065849cbc38357b07/manifest/video.m3u8"
                    width="100%"
                    height="40vh"
                    overflow="hidden"
                    playing
                    controls
                    config={{
                      file: {
                        attributes: {
                          controls: true,
                          crossOrigin: 'true',
                          playing: 'false',
                          autoPlay: 'false'
                        },
                        forceVideo: true,
                        tracks: [
                          {
                            src: '',
                            kind: 'subtitles',
                            srcLang: 'en',
                            default: true,
                            label: 'English'
                          }
                        ]
                      }
                    }}
                    playIcon={
                      <Box className="play-button">
                        <a href="#play-how-to-video">
                          <PlaySymbol />
                        </a>
                      </Box>
                    }
                    light={CtaImage1}
                  />
                </s.InfoWrapper>
              </Grid>
              <Grid xs={8} sm={6} md={6}>
                <s.InfoWrapper>
                  <ReactPlayer
                    url="https://customer-ayah89x7bps0l5b8.cloudflarestream.com/e28c788ff6c973977e3127a2e81632a9/manifest/video.m3u8"
                    width="100%"
                    height="40vh"
                    overflow="hidden"
                    playing
                    controls
                    config={{
                      file: {
                        attributes: {
                          controls: true,
                          crossOrigin: 'true',
                          playing: 'false',
                          autoPlay: 'false'
                        },
                        forceVideo: true,
                        tracks: [
                          {
                            src: '',
                            kind: 'subtitles',
                            srcLang: 'en',
                            default: true,
                            label: 'English'
                          }
                        ]
                      }
                    }}
                    playIcon={
                      <Box className="play-button">
                        <a href="#play-how-to-video">
                          <PlaySymbol />
                        </a>
                      </Box>
                    }
                    light={CtaImage2}
                  />
                </s.InfoWrapper>
              </Grid>
            </Grid>

            <Typography component="h4" variant="h3" color="#95F5CB" pb={4}>
              {t('Account Fees CTA')}
            </Typography>
            <Typography component="p" color="#D9FFEE" variant="h4" pb={4}>
              {t('Who Creator Accounts Are For')}
            </Typography>
            <s.FrenchDescription>
              {t('Account Fees Creator CTA FR')}
            </s.FrenchDescription>
            <s.FrenchDescription>
              {t('Who Creator Accounts Are For FR')}
            </s.FrenchDescription>
          </Stack>

          <CheckboxInput
            control={control}
            name="ageConfirmation"
            label={t('Over 18')}
            rules={{
              required:
                'Unfortunately you cannot create a profile on CubeCommons unless you are 18+ years old. |FR| Malheureusement, vous ne pouvez pas créer de profil sur CubeCommons à moins d`avoir 18 ans et plus.'
            }}
            fullWidth
          />
          <CheckboxInput
            control={control}
            name="promotions"
            label={t('Newsletter')}
            rules={{
              required: false
            }}
            fullWidth
          />

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Box pt="1rem">
            <HCaptcha
              theme="dark"
              sitekey={hCaptchaKey}
              onVerify={onCaptchaSuccess}
            />
            <Button
              type="submit"
              disabled={!captchaVerified}
              onClick={handleSubmit(onSubmit)}
              fullWidth
            >
              {t('Review Terms | Consultez les Conditions')}
            </Button>
          </Box>
        </Stack>
      </form>
      <LegalModalSignup
        callback={handleSignup}
        display={displayLegal}
        setDisplay={setDisplayLegal}
      />
    </>
  );
};
