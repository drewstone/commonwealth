import React, { useEffect, useState } from 'react';
import { useCommonNavigate } from 'navigation/helpers';
import { PageLoading } from 'views/pages/loading';
import ErrorPage from 'views/pages/error';
import { handleSocialLoginCallback } from 'controllers/app/login';
import { initAppState } from 'state';
import app from 'state';

const validate = async (setRoute) => {
  const params = new URLSearchParams(window.location.search);
  const chain = params.get('chain');
  const walletSsoSource = params.get('sso');
  let redirectTo = params.get('redirectTo');
  if (redirectTo?.startsWith("/finishsociallogin")) redirectTo = null;

  await handleSocialLoginCallback({ chain, walletSsoSource });
  await initAppState();

  setRoute(redirectTo || (app.activeChainId() ? `/account/${app.activeChainId()}` : '/dashboard'));
};

const FinishSocialLogin = () => {
  const navigate = useCommonNavigate();
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    validate(navigate).catch((error) => {
      // useEffect will be called twice in development because of React strict mode,
      // causing an error to be displayed until validate() finishes
      if (document.location.host === "localhost:8080") {
        return;
      }
      if (typeof error === 'string') {
        setValidationError(error);
      } else if (error && typeof error.message === 'string') {
        setValidationError(error.message);
      } else {
        setValidationError('Error logging in, please try again');
      }
    });
  }, [navigate]);

  if (validationError) {
    return <ErrorPage message={validationError} />;
  } else {
    return <PageLoading />;
  }
};

export default FinishSocialLogin;
