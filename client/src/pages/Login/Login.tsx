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
  const signUpForm = search.includes('user') ? (
    <UserSignupForm />
  ) : (
    <CreatorSignupForm />
  );

  return (
    <Stack>
      <Grid container>
        <Grid xs={10} xsOffset={1} md={5}>
          
          <s.FormWrapper>
            {isLogin ? <LoginForm emailVerified={emailVerified} passwordReset={passwordReset} /> : signUpForm}
          </s.FormWrapper>

        </Grid>
        <Grid xs={12} md={6}>
          
          <s.CTAWrapper>
            <s.CTAMessage>
              <Typography component="h2" variant="h2" color="secondary">
                {isLogin ? t('New Here?') : t('Already have an account?')}
              </Typography>

              {isLogin && (
                <Typography
                  component="h4"
                  variant="h4"
                  color="secondary"
                >
                  {t('Sign up and Start Contributing')}
                </Typography>
              )}

              <s.LinkWrapper>
                
                <Button
                  color="secondary"
                  onClick={() =>
                    navigate(isLogin ? '/signup?type=user' : '/login')
                  }
                >
                  {isLogin ? t('User Sign up') : t('Login')}
                </Button>

                {isLogin && (
                  <Button
                    color="secondary"
                    onClick={() =>
                      navigate(isLogin ? '/signup?type=creator' : '/login')
                    }
                  >
                    {isLogin ? t('Creator Sign up') : t('Login')}
                  </Button>
                )}

              </s.LinkWrapper>

            </s.CTAMessage>
          </s.CTAWrapper>

        </Grid>
      </Grid>

      <Footer />
    </Stack>
  );
};

export default Login;
