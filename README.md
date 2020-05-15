# Go Barber Web

- Sobre como iniciar o projeto configuração pode acompanhar em:
  - [Projeto com ReactJS Parte 1 (Inicio)](https://github.com/mrcarromesa/react-parte2)
  - [Configurando o ESLint, Prettier, Editor Config](https://github.com/mrcarromesa/react-parte3)

- O `.eslintrc.js` utilizado nesse projeto foi:

```js
module.exports = {
  env: {
    es6: true,
    jest: true,
    browser: true
  },
  extends: ["airbnb", "prettier", "prettier/react"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    __DEV__: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "jsx-a11y", "import", "react-hooks", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "react/jsx-filename-extension": ["error", { extensions: [".js", ".jsx"] }],
    "import/prefer-default-export": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "react/jsx-one-expression-per-line": "off",
    "global-require": "off",
    "react-native/no-raw-text": "off",
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    camelcase: "off",
    "no-console": ["error", { allow: ["tron"] }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  settings: {
    "import/resolver": {
      "babel-plugin-root-import": {
        rootPathSuffix: "src"
      },
    },
  },
};

```

## Configurando rotas

- Inicialmente instale a dependência:

- Mais detalhes: [Router](https://github.com/mrcarromesa/react-parte4)

```bash
yarn add react-router-dom
```

- Criar a pasta `src/pages`

- Criar a pasta `src/routes`

- Criar o arquivo `src/routes/index.js`

- Criar a pasta `src/services` e o arquivo `src/services/history.js`
O `history` permitirá navegação do usuário de todos os lugares mesmo utilizando o redux, Para isso instale a dependência:

```bash
yarn add history
```

- Conteúdo desse arquivo

```js
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export default history;

```

- Mais detalhes sobre o `history` em [React com redux parte 13 - Route com Redux](https://github.com/mrcarromesa/react-redux-parte13)

- Utilizando:

```js
import history from './services/history';

<Router history={history} />
```

- Dessa forma ele começa a ouvir todas as partes de navegação que realizarmos dentro do history.
Então em qualquer lugar da aplicação darmos um `.push()` para fazer a navegação do usuário, ele irá ouvir a navegação e irá realiza-la

---

# Criar páginas

- Criar a página `src/pages/Dashboard/index.js`
- Criar a página `src/pages/Profile/index.js`
- Criar a página `src/pages/SignIn/index.js`
- Criar a página `src/pages/SignUp/index.js`

---

# Criar as rotas

- No arquivo `src/routes/index.js` vamos criar as rotas

- No arquivo `src/App.js` vamos importar as rotas:

```js
import React from 'react';
import { Router } from 'react-router-dom';

import Routes from './routes';

import history from './services/history';

function App() {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
}

export default App;


```

## Reactotron

- Mais detalhes [React com redux parte 6 - Ractotron](https://github.com/mrcarromesa/react-redux-parte6)

- Primeiramente instale a dependência:

```bash
yarn add reactotron-react-js
```

- Criar o arquivo `src/config/ReactotronConfig.js`

```js
import Reactotron from 'reactotron-react-js';

if (process.env.NODE_ENV === 'development') {
  const tron = Reactotron.configure().connect();

  tron.clear();

  console.tron = tron;
}

```

- Importar em `src/App.js`:

```js
import `./config/ReactotronConfig`;
```

---

## PropTypes

- Como boa prática para enviar alguns props para os componentes é importante determinarmos o tipo de prop esperado pelo component, para tal instalamos a dependência:

```bash
yarn add prop-types
```

- Importamos no arquivos:

```js
import PropTypes from 'prop-types';

//...

Component.propTypes = {
  prop1: PropType.TYPE,
  coponent: PropType.oneOfType([PropTypes.func, PropTypes.object, PropTypes.element, PropTypes.any ]).isRequired,
};


Component.defaultProps = {
  prop1: 'DEFAULT'
}

```

## Rotas privadas

- Para controlar as rotas separando as rotas privadas das rotas que exigem autenticação vamos criar um arquivo `src/routes/Route.js`

```js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

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

  // Chegou aqui então OK
  // Retornamos a Rota passando todas as props restantes e o component informado.
  return <Route {...rest} component={Component} />;
}

RouteWrapper.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
    .isRequired,
  isPrivate: PropTypes.bool,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};

```

- Mais detalhes estão comentados no código acima.

- Alteramos o arquivo `src/routes/index.js` ao invés de obtermos o `Route` de `react-router-dom` obtemos de `src/routes/Route.js`:

```js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// utilizamos o `component: Component` pois não podemos utilizar essa forma `<component />`
// então precisamos fazer assim
// o `isPrivate` é a propriedade que estamos criando para definirmos se a rota será privada ou não
// o `...rest`, são todas as demais propriedades ou atributos passadas pelo component
export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  const signed = true;

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

  // Chegou aqui então OK
  // Retornamos a Rota passando todas as props restantes e o component informado.
  return <Route {...rest} component={Component} />;
}

RouteWrapper.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
    .isRequired,
  isPrivate: PropTypes.bool,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};

```

## Criação dos layouts

- Instalar o `styled-components`:

```bash
yarn add styled-components
```

- Mais detalhes: [Styled Components](https://github.com/mrcarromesa/react-parte5)

- Criar a pasta `src/pages/_layouts/` o `_` é para fazer com que fique sempre no topo da pasta.
Usaremos para criar os layouts/estilos

- Uma das coisas que podemos destacar é a utilização da props `children`:

```js
import React from 'react';
import PropTypes from 'prop-types';
import { Wrapper } from './styles';

export default function DefaultLayout({ children }) {
  return <Wrapper>{children}</Wrapper>;
}

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

```

- No caso o `children` pode ser outro component que está sendo enviado, por exemplo:

```js
<DefaultLayout>
  <Children>
    <h1>Título</h1>
  </Children>
</DefaultLayout>
```

- Então tudo que estiver entre as tags `<DefaultLayout>` e `</DefaultLayout>` nesse caso é o children.

---

## Estilização global

- Mais detalhes: [Global Styles](https://github.com/mrcarromesa/react-parte6)

- Crie o arquivo `src/styles/global.js`

---

## Root Import ReactJS

Para importar arquivos muitas vezes é necessário atravesar várias e várias pastas como no caso de `../../../pasta/subpasta` para evitar isso podemos utilizar a dependencia do babel root import.

- Para isso precisamos instalar o seguinte:

```bash
yarn add customize-cra react-app-rewired -D
```

- Instalar também o seguinte:

```bash
yarn add babel-plugin-root-import -D
```

- Criar o arquivo na raiz do projeto chamado `config-overrides.js`:

```js
const { addBabelPlugin, override } = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import', // Plugin
    // Abaixo configurações do plugin
    {
      rootPathSuffix: 'src', // Pasta onde está a maioria do meu código
    },
  ])
);
```

- Esse arquivo é carregado automáticamente pelo `react-app-rewired`

- Ajustar no `package.json` dentro do bloco `scripts`:

```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
},
```

- Nos arquivos podemos utilizar o seguinte na importação `~/pasta_dentro_do_src/`

- Reiniciar a aplicação utilizando:

```bash
yarn start
```

- Até agora tudo certo o React consegue compreender quando utilizamos essa sintaxe, porém o `eslint` se perdeu, para resolver isso instalamos a seguinte dependência:

```bash
yarn add eslint-import-resolver-babel-plugin-root-import -D
```

- No arquivo `.eslintrc.js` adicionamos o seguinte no final do arquivo:

```js
settings: {
  "import/resolver": {
    "babel-plugin-root-import": {
      rootPathSuffix: "src"
    },
  },
},
```

- Agora o `eslint` ok, porém precisamos informar ao vscode do novo padrão, crie o arquivo `jsconfig.json`


```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "~/*": ["*"],
    }
  }
}

```
