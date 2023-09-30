import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Footer from 'components/layout/Footer';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { CreatorSignupForm } from './components/CreatorSignupForm';
import { UserSignupForm } from './components/UserSignupForm';
import * as s from './Login.styled';

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

  const signUpForm = isUserSignup ? (
    <UserSignupForm />
  ) : (
    <CreatorSignupForm />
  );

  return (
    <Stack>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={5}>
          
          <s.FormWrapper>
            {isLogin ? <LoginForm emailVerified={emailVerified} passwordReset={passwordReset} invalidToken={isInvalidToken} /> : signUpForm}
          </s.FormWrapper>

        </Grid>
        <Grid xs={12} md={6}>
          <s.CTAWrapper>
            
            {isLogin && (
              <s.CTAMessage>
                <Typography component="h3" variant="h3" color="secondary">
                  {t('New Here?')}
                </Typography>

                <Typography
                  component="p" 
                  variant="body1"
                  color="secondary"
                >
                  {t('User accounts can create playlists and lorem ipsum dolor sit amet.')}
                </Typography>
                
                <Button
                  color="secondary"
                  onClick={() =>
                    navigate('/signup?type=user')
                  }
                >
                  {t('Sign up for a User Account')}
                </Button>

                <Typography
                  component="p" 
                  variant="body1"
                  color="secondary"
                >
                  {t('Creator accounts can upload content and lorem ipsum dolor sit amet.')}
                </Typography>
                
                <Button
                  color="secondary"
                  onClick={() =>
                    navigate('/signup?')
                  }
                >
                  {t('Apply for a Creator Account')}
                </Button>

              </s.CTAMessage>
            )}
            
            {isUserSignup && (
              <s.CTAMessage>
                <Typography component="h3" variant="h3" color="secondary">
                  {t('Or, become a Creator')}
                </Typography>

                <Typography
                  component="p" 
                  variant="body1"
                  color="secondary"
                >
                  {t('Creator accounts can upload content and lorem ipsum dolor sit amet.')}
                </Typography>

                <Button
                  color="secondary"
                  onClick={() =>
                    navigate('/signup')
                  }
                >
                  {t('Apply for a Creator Account')}
                </Button>

                <Typography component="h3" variant="h3" color="secondary">
                  {t('Already have an account?')}
                </Typography>

                <Button
                  color="secondary"
                  onClick={() =>
                    navigate('/login')
                  }
                >
                  {t('Login')}
                </Button>

              </s.CTAMessage>
            )}
            
            {isCreatorSignup && (
              <s.CTAMessage>
                <Typography component="h3" variant="h3" color="secondary">
                  {t('Or, become a User')}
                </Typography>

                <Typography
                  component="p" 
                  variant="body1"
                  color="secondary"
                >
                  {t('User accounts can create playlists and lorem ipsum dolor sit amet.')}
                </Typography>

                <Button
                  color="secondary"
                  onClick={() =>
                    navigate('/signup?type=user')
                  }
                >
                  {t('Sign up for a User Account')}
                </Button>

                <Typography component="h3" variant="h3" color="secondary">
                  {t('Already have an account?')}
                </Typography>

                <Button
                  color="secondary"
                  onClick={() =>
                    navigate('/login')
                  }
                >
                  {t('Login')}
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
