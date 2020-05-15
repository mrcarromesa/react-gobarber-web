import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthLayout from '~/pages/_layouts/auth';
import DefaultLayout from '~/pages/_layouts/default';

// utilizamos o `component: Component` pois não podemos utilizar essa forma `<component />`
// então precisamos fazer assim
// o `isPrivate` é a propriedade que estamos criando para definirmos se a rota será privada ou não
// o `...rest`, são todas as demais propriedades ou atributos passadas pelo component
export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  const signed = false;

  // Usuario não está logado e tentando acessar uma rota privada
  // Não deixa redireciona para o login
  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }

  // Usuario logado e acessando uma rota não privada, como tela de login
  // Não deixa o usuário não precisa efetuar o login novamente se ele já está logado.
  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />;
  }

  const Layout = signed ? DefaultLayout : AuthLayout;
  // Chegou aqui então OK
  // Retornamos a Rota passando todas as props restantes e o component informado.
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

RouteWrapper.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
    .isRequired,
  isPrivate: PropTypes.bool,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};
