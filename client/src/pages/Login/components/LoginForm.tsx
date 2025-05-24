import { Box, Stack, Typography } from '@mui/material';
import EmailInput from 'components/form/EmailInput';
import ErrorMessage from 'components/form/ErrorMessage';
import PasswordInput from 'components/form/PasswordInput';
import Link from 'components/Link';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'components/Button';
import useAuth from 'hooks/useAuth';
import { getProfile } from 'api/profile';
import { resendEmailVerification } from 'api/auth';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { set } from 'date-fns';
import { getUser } from 'utils/auth';

interface LoginFormProps {
  emailVerified?: boolean;
  passwordReset?: boolean;
  invalidToken?: boolean;
}

export const LoginForm = ({
  emailVerified,
  passwordReset,
  invalidToken
}: LoginFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isUnverifiedLogin, setIsUnverifiedLogin] = useState(false);
  const [isLinkResent, setIsLinkResent] = useState(false);
  const { login } = useAuth();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const hCaptchaKey = process.env.REACT_APP_HCAPTCHA_KEY || '';

  const onCaptchaSuccess = () => {
    setCaptchaVerified(true);
  };

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    try {
      setErrorMessage('');

      await login(email, password);
      const isEmailVerified = getUser().has_verified_email;
      if (isEmailVerified) {
        if (getUser().profile_id) {
          const { data } = await getProfile(getUser().profile_id);
          localStorage.setItem('PROFILE', JSON.stringify(data));
          console.log(data, 'data');
          // @ts-ignore
          if (data.status === 'inactive') {
            navigate('/reactivate-profile');
            return;
          }
          navigate(`/profile/${(data as any).tag}`);
        } else {
          navigate('/');
        }
      } else {
        setIsUnverifiedLogin(true);
      }
    } catch (e: any) {
      setErrorMessage(e.response?.data || t('An Error occured during login | Une erreur s`est produite lors de la connexion'));
    }
  };

  const handleResendVerification = async () => {
    await resendEmailVerification(getUser().email);
    setIsLinkResent(true);
  };

  if (isUnverifiedLogin) {
    return (
      <Box display="flex" flexDirection="column">
        <Box pt={4}>
          {isLinkResent ? (
            <Typography>
              <p>
              {t('An <b>Email verification link</b> has been resent to the provided email address.'
              )}
              </p>
              <p lang="fr">
              {t('Un <b>lien de vérification par e-mail</b> a été renvoyé à l`adresse e-mail fournie.'
              )}
              </p>
            </Typography>
          ) : (
            <ErrorMessage>
              <p>
              {t('Email is unverified. <b>Check your email</b> for a verification link, or resend to provided email address.'
              )}
              </p>
              <p lang="fr">
              {t('L e-mail n`est pas vérifié. <b>Vérifiez votre e-mail</b> pour obtenir un lien de vérification ou renvoyez-le à l`adresse e-mail fournie.'
              )}
              </p>
            </ErrorMessage>
          )}
        </Box>
        {!isLinkResent ? (
          <Button type="submit" onClick={handleResendVerification} fullWidth>
            {t('Resend Email Verification Link |FR| Renvoyer le lien de vérification par e-mail')}
          </Button>
        ) : null}
      </Box>
    );
  }

  return (
    <>
      {emailVerified && (
        <Typography variant="h4" component="h2" pb={4}>
          <p>
          {t('Email Verified. Please login.')}
          </p>
          <p lang="fr">
          {t('E-mail vérifié. Veuillez vous connecter.')}
          </p>
        </Typography>
      )}
      {passwordReset && (
        <Typography variant="h4" component="h2" pb={4}>
          <p>
          {t('Password reset successful. Please login with your new password.')}
          </p>
          <p lang="fr"> 
          {t('Réinitialisation du mot de passe réussie. Veuillez vous connecter avec votre nouveau mot de passe.')}
          </p>
        </Typography>
      )}
      {invalidToken && (
        <Typography variant="h4" component="h2" pb={4}>
          <p>
          {t('Session has expired. Please login again.')}
          </p>
          <p lang="fr">
          {t('Votre session a expiré. Veuillez vous reconnecter.')}
          </p>
        </Typography>
      )}
      <Typography variant="h3" component="h3" pb={4}>
        {t('Login | Connexion')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <EmailInput
            control={control}
            name="email"
            label={t('Email')}
            fullWidth
            helperText={t('Email address required |FR| Email Requis')}
            variant="outlined"
          />
          <PasswordInput
            control={control}
            name="password"
            label={t('Password | Mot de passe')}
            fullWidth
            helperText={t('Password required |FR| Requis')}
            variant="outlined"
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Box>
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
              {t('Login |FR| Connexion')}
            </Button>
            <Box pt={4}>
              <Link to="/forgot-password">{t('Forgot Password ? |FR| Oublié Votre Mot de Passe ?')}</Link>
            </Box>
          </Box>
        </Stack>
      </form>
    </>
  );
};
