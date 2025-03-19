import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Footer from 'components/layout/Footer';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { CreatorSignupForm } from './components/CreatorSignupForm';
import { UserSignupForm } from './components/UserSignupForm';
import ReactPlayer from 'react-player';
import { ReactComponent as PlaySymbol } from 'assets/icons/play-symbol.svg';
import CtaImage from 'assets/images/home-video-cover.jpeg';
import HeroCTA from 'components/heroCTA/HeroCTA';
import * as s from './Login.styled';
import { useDocumentTitle } from 'hooks/useDocumentTitle';

const Login = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useLocation();

  const emailVerified = search.includes('verified');
  const passwordReset = search.includes('password-reset');

  const isLogin = location.pathname.toLowerCase() === '/login';
  const isUserSignup = search.includes('user');
  const isCreatorSignup = !isUserSignup && !isLogin;
  const isInvalidToken = search.includes('invalidToken');

  const signUpForm = isUserSignup ? <UserSignupForm /> : <CreatorSignupForm />;

  useDocumentTitle(isLogin ? 'Login' : 'Sign Up');

  return (
    <Stack>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={5}>
          <s.FormWrapper>
            {isLogin ? (
              <LoginForm
                emailVerified={emailVerified}
                passwordReset={passwordReset}
                invalidToken={isInvalidToken}
                aria-label={LoginForm}
              />
            ) : (
              signUpForm
            )}
          </s.FormWrapper>
        </Grid>
        <Grid xs={12} md={6}>
          <s.CTAWrapper>
            {isLogin && (
              <s.CTAMessage>
                <Typography component="h3" variant="h3" color="secondary">
                  {t('User Guide Login Page Title')}
                </Typography>
                <Typography component="h5" variant="h5" color="secondary">
                  {t('User Guide Login Page TitleFR')}
                </Typography>

                <s.InfoWrapper htmlFor="VideoGuide">
                  <ReactPlayer
                    url="https://customer-ayah89x7bps0l5b8.cloudflarestream.com/08aa6b389f1e0f93b380f321226b64b3/manifest/video.m3u8"
                    width="100%"
                    height="20vh"
                    overflow="hidden"
                    playing
                    controls
                    config={{
                      file: {
                        attributes: {
                          controls: true,
                          crossOrigin: 'true',
                          playing: 'false'
                        },
                        forceVideo: true,
                        tracks: [
                          {
                            src: 'https://files.cubecommons.ca/Login%20Page%20Subtitles_Aug%2012%202024.vtt',
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
                    light={CtaImage}
                  />
                </s.InfoWrapper>

                <Typography component="p" variant="body1" color="secondary">
                  {t('User Guide Login Page')}
                  <span>{t('User Guide Login PageFR')}</span>
                </Typography>

                <Button
                  color="secondary"
                  onClick={() => navigate('/signup?type=user')}
                  aria-label="Button to Go to User SignUp form"
                >
                  {t('User Sign-Up | S`inscrire')}
                </Button>

                <Typography component="p" variant="body1" color="secondary">
                  {t('User Guide Login Account Description')}
                  <span>{t('User Guide Login Account DescriptionFR')}</span>
                </Typography>

                <Button color="secondary" onClick={() => navigate('/signup?')} aria-label="Button to Go to Creator SignUp form">
                  {t('Creator Sign-Up | S`inscrire')}
                </Button>
              </s.CTAMessage>
            )}

            {isUserSignup && (
              <s.CTAMessage>
                <Typography component="h3" variant="h3" color="secondary">
                  {t('Creator SingUp')}
                </Typography>
                <Typography component="h5" variant="h5" color="secondary">
                  {t('Creator SingUpFR')}
                </Typography>

                <Typography component="p" variant="body2" color="secondary">
                  {t('Creator Benefits')}
                  <span>{t('Creator BenefitsFR')}</span>
                </Typography>

                <Button color="secondary" onClick={() => navigate('/signup')}>
                  {t('Creator Sign-Up | S`inscrire')}
                </Button>

                <Typography component="h3" variant="h3" color="secondary">
                  {t('Account')}
                </Typography>
                <Typography component="h5" variant="h5" color="secondary">
                  {t('AccountFR')}
                </Typography>

                <Button color="secondary" onClick={() => navigate('/login')} aria-label="Button to Go to Login form">
                  {t('Login | Connexion')}
                </Button>
              </s.CTAMessage>
            )}

            {isCreatorSignup && (
              <s.CTAMessage>
                <Typography component="h3" variant="h3" color="secondary">
                  {t('User SignUp')}
                </Typography>
                <Typography component="h5" variant="h5" color="secondary">
                  {t('User SignUpFR')}
                </Typography>

                <Typography component="p" variant="body2" color="secondary">
                  {t('UserBenefits')}
                  <span>{t('UserBenefitsFR')}</span>
                </Typography>

                <Button
                  color="secondary"
                  onClick={() => navigate('/signup?type=user')}
                  aria-label="Button to Go to User SignUp form">
                  {t('User Sign-Up | S`inscrire')}
                </Button>

                <Typography component="h3" variant="h3" color="secondary">
                  {t('Account')}
                </Typography>
                <Typography component="h5" variant="h5" color="secondary">
                  {t('AccountFR')}
                </Typography>
                <Button color="secondary" onClick={() => navigate('/login')}
                aria-label="Button to Go to Login form">
                  {t('Login | Connexion')}
                </Button>
              </s.CTAMessage>
            )}
          </s.CTAWrapper>
        </Grid>
      </Grid>

      <Footer />
    </Stack>
  );
};

export default Login;
