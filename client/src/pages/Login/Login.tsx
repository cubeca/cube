import { Box, Grid, Stack, Typography } from '@mui/material';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginBackground from 'assets/images/login-signup-background.jpg';
import { LoginForm } from './components/LoginForm';
import { CreatorSignupForm } from './components/CreatorSignupForm';
import { UserSignupForm } from './components/UserSignupForm';

const Login = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useLocation();

  const isLogin = location.pathname.toLowerCase() === '/login';
  const signUpForm = search.includes('user') ? (
    <UserSignupForm />
  ) : (
    <CreatorSignupForm />
  );

  return (
    <Stack>
      <Grid
        container
        spacing={0}
        columnGap="none"
        direction="row"
        xs={12}
        md={12}
        flex-direction={{ xs: 'column', sm: 'column', md: 'row' }}
        order={{ xs: 'reverse' }}
      >
        <Grid item xs={12} md={6} justifyContent={{ xs: 'center' }}>
          <Box padding={12}>{isLogin ? <LoginForm /> : signUpForm}</Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            p={0}
            component="div"
            sx={{
              backgroundImage: `
              linear-gradient(to right, rgba(149, 245, 203, 0.82), rgba(149, 245, 203, 0.32)),
              url('${LoginBackground}')`,
              backgroundSize: 'cover'
            }}
            height="100%"
            width="100%"
            display="flex"
            alignItems="center"
          >
            <Box pl={12}>
              <Typography component="h2" variant="h2" color="secondary">
                {isLogin ? t('New Here?') : t('Already have an account?')}
              </Typography>
              {isLogin && (
                <Typography
                  component="h4"
                  variant="h4"
                  color="secondary"
                  pb={4}
                >
                  {t('Sign up and Start Contributing')}
                </Typography>
              )}
              <Box display="flex" gap="10px">
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
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Login;
