# Go Barber Web

- **BACK-END do projeto desenvolvido em Node: [Go Barber](https://github.com/mrcarromesa/gobarber)**

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
      "~/*": ["*"]
    }
  }
}
```

# Estilização SignIn

- Mais detalhes: [Styled Components](https://github.com/mrcarromesa/react-parte5)
- Mais detalhes: [Estilização na prática 1](https://github.com/mrcarromesa/react-parte7)
- Mais detalhes: [Estilização na prática 2](https://github.com/mrcarromesa/react-parte8)
- Mais detalhes: [Iniciando projeto RocketShoes](https://github.com/mrcarromesa/react-redux-parte1)

- Para adicionarmos uma pseudo class, ou pseudo elemento, a um componente, utilizamos dentro dele e adicionamos na frente o `&:PSEUDO` ex.:

```js
button {
  margin: 5px 0 0;
  height: 44px;
  background: #3b9eff;
  font-weight: bold;
  color: #fff;
  border: 0;
  border-radius: 4px;
  font-size: 16px;

  &:hover {
    background: ${darken(0.03, '#3b9eff')};
  }
}
```

- Algo interessante... olhe esse código dentro de `src/pages/_layouts/auth/styles.js`:

```js
&::placeholder {
  color: rgba(255, 255, 255, 0.7);
}
```

- Com o `styled-components` não precisamos se preocupar em estilizar para cada navegador, pois ele já converte automáticamente para cada um.

---

- Adicione uma lib para trabalhar com cores:

```bash
yarn add polished
```

- E dentro do `styles.js` importamos o `darken`:

```js
import { darken } from 'polished';

//..
&::hover {
  //darken(força em percentual de escurecimento, e a cor que queremos escurecer)
  background: ${darken(0.03, '#3b9eff')};
}
//..
```


---

## Unform - Criado pela rocketseat

- Para não criar um estado para cada component podemos utilizar essa lib.

- Intalação:

```bash
yarn add @rocketseat/unform
```

- Para utilizar a lib é necessário apenas importar a lib, utilizar `Form` ao invés de `form` e `Input` ao invés de `input` e o pulo do gato..., adicionar o name ao `Input`:

```js
import { Form, Input } from '@rocketseat/unform';

// ...
function handleSubmit(data) {
  console.log(data);
}

// ...
<Form onSubmit={handleSubmit}>
  <Input name="email" type="email">
</Form>
// ...
```


---

## Validação

- Instale o `yup`:

```bash
yarn add yup
```

- Para importar:

```js
import * as Yup from 'yup';
```

- Definir o schema de validação, dentro do `shape` inserimos cada campo do `object` que queremos validar:

```js
const schema = Yup.object().shape({
  email: Yup.string().email('Insira um e-mail válido').required('O e-mail é obrigatório'),
  password: Yup.string().required('A senha é obrigatória')
});
```

- Por fim inserimos isso na propriedade `schema`:

```js
<Form schema={schema} ... >
```


---

# Redux

- Mais informações:
  - [React com redux parte 4 - Instalando e Configurando o Redux](https://github.com/mrcarromesa/react-redux-parte4)
  - [React com redux parte 5 - Salvando itens no carrinho (Reducer)](https://github.com/mrcarromesa/react-redux-parte5)
  - [React com redux parte 6 - Ractotron](https://github.com/mrcarromesa/react-redux-parte6)
  - [React com redux parte 7 - Cart](https://github.com/mrcarromesa/react-redux-parte7)

- Adicionar as libs:

```bash
yarn add redux redux-saga react-redux reactotron-redux reactotron-redux-saga immer
```

- Criar a pasta `src/store/`
- Criar a pasta `src/store/modules`
- Criar a pasta `src/store/modules/auth/reducer.js`
- Criar a pasta `src/store/modules/auth/actions.js` <- Ações que serão chamadas pelo `useDispatch` do redux
- Criar a pasta `src/store/modules/auth/sagas.js`
- Criar a pasta `src/store/modules/rootReducer.js` <- unirá todos os reducers do modules
- Criar a pasta `src/store/modules/rootSaga.js` <- unirá todos os sagas do modules
- Criar o arquivo `src/store/index.js`
- Criar o arquivo `src/store/createStore.js` <- Separamos a parte de criação do store para o arquivo `index.js` não ficar muito grande

- Inicialmente no arquivo `src/store/modules/auth/reducer.js` adicionamos o seguinte:

```js
const INITIAL_STATE = {};

export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    default:
      return state;
  }
}

```

- Inicialmente no arquivo `src/store/modules/auth/sagas.js` adicionamos o seguinte:

```js
import { all } from 'redux-saga/effects';

export default all([]);
```

- Inicialmente no arquivo `src/store/modules/rootReducer.js` adicionamos o seguinte:

```js
import { combineReducers } from 'redux';

import auth from './auth/reducer';

// ** o combineReducers aceita um `object` com varios elementos como parametro
export default combineReducers({ auth });
```

- Nesse arquivo acima passamos todos os reducers para ele.

- Inicialmente no arquivo `src/store/modules/rootSaga.js` adicionamos o seguinte:

```js
import { all } from 'redux-saga/effects';

import auth from './auth/sagas ';

export default function* rootSaga() {
  return yield all([auth]);
}
```

- Nesse arquivo acima passamos todos os sagas para ele.

---

- Inicialmente no arquivo `src/store/index.js` adicionamos o seguinte:

```js
import createSagaMiddleware from 'redux-saga';
import createStore from './createStore';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = createStore(rootReducer, middlewares);

sagaMiddleware.run(rootSaga);

export default store;
```

- Adicionamos conteúdo ao arquivo `src/store/createStore.js`

```js
import { createStore } from 'redux';

export default (reducers, middlewares) => {
  return createStore(reducers, middlewares);
}
```

- A função acima servirá para encapsular as funções do reactotron


- Realizar ajustes no `src/config/ReactotronConfig.js` a configuração do Reactotron está diretamente ligada com o `src/store/createStore.js` nesse momento.

```js

import Reactotron from 'reactotron-react-js';

// Redux
import { reactotronRedux } from 'reactotron-redux';
import reactotronSaga from 'reactotron-redux-saga';
// Redux

if (process.env.NODE_ENV === 'development') {
  const tron = Reactotron.configure()
// Redux
    .use(reactotronRedux())
    .use(reactotronSaga())
// Redux
    .connect();

  tron.clear();

  console.tron = tron;
}

```

- Ajustamos o arquivo `src/store/index.js`:

```js

// ...
const sagaMonitor =
  process.env.NODE_ENV === 'development'
    ? console.tron.createSagaMonitor()
    : [''];

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
// ...

```

- Por fim no arquivo `src/store/createStore.js` ajustar para:

```js
import { createStore, compose, applyMiddleware } from 'redux';

export default (reducers, middlewares) => {
  const enhacer =
    process.env.NODE_ENV === 'development'
      ? compose(console.tron.createEnhancer(), applyMiddleware(...middlewares))
      : applyMiddleware(...middlewares);
  return createStore(reducers, enhacer);
};

```

- Agora no arquivo `src/App.js` precisamos adicionar o provider:

```js
import React from 'react';
import { Provider } from 'react-redux'; // Embrulhar os componentes com o Provider
import { Router } from 'react-router-dom';

import './config/ReactotronConfig';

import Routes from './routes';
import history from './services/history';

import store from './store'; // Precisa vir após o ReactotronConfig para ter acesso do Saga Monitor ou o enhancer

import GlobalStyle from './styles/globals';

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes />
        <GlobalStyle />
      </Router>
    </Provider>
  );
}

export default App;
```

- No Reactotron podemos testar se está funcionando, em State clicamos em Mais e adicionamos `auth`

---

### Actions para o redux auth

- Adicionar as actions ao arquivo `src/store/modules/auth/actions.js`:

```js
export function signInRequest(email, password) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { email, password },
  };
}

export function signInSuccess(token, user) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, user },
  };
}

export function signFailure() {
  return {
    type: '@auth/SIGN_FAILURE',
  };
}

```

- Instalar o axios:

```bash
yarn add axios
```

- Criar o arquivo `src/services/api.js`

- Ajustar o arquivo `src/store/modules/sagas.js`

```js
// Adicionamos o `takeLatest`, `call`, `put`
import { takeLatest, call, put, all } from 'redux-saga/effects';

import history from '~/services/history';
import api from '~/services/api';

import { signInSuccess } from './actions';

// Ele recebe os parametros enviado pela action em `./actions.js`
export function* signIn({ payload }) {
  const { email, password } = payload;

  // como o metodo retornar uma promise chamamos utilizando o call, o qual é diferente para chamar a function com seus parametros
  // Nesse caso estamos passando para o call o seguintes parametros:
  // - o metodo ou function que queremos chamar
  // - o Primeiro parametro da function que estamos usando, nesse caso url
  // - o segundo parametro da function que estamos usando, nesse caso os parametros
  const response = yield call(api.post, 'sessions', {
    email,
    password,
  });

  const { token, user } = response.data;

  if (!user.provider) {
    console.tron.error('Usuário não é prestador');
    return;
  }

  // chama uma action, que nesse caso está em `./actions.js`
  yield put(signInSuccess(token, user));

  // Realizar navegação do usuário utilizando o `history` o qual instalamos anteriormente
  history.push('/dashboard');
}


// takeLastest  que ovirá determinada action e dispara uma function
export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);

```


- No arquivo `src/pages/SignIn/index.js`, adicionar o dispach do redux

```js
// Utilizamos para disparar uma action
import { useDispatch } from 'react-redux';

// Importamos a action que queremos utilizar
import { signInRequest } from '~/store/modules/auth/actions';

// ...

// inserimos o useDispatch na function por atribuir a uma variavel:

const dispatch = useDispatch();

// ...

// Disparamos a action necessária:

dispatch(signInRequest(email, password));

// ...


```

- Precisamos ajustar o `src/store/modules/auth/reducer.js` para tomar alguma ação após realizar o dispach da action de autenticação, para isso:

- Ajustamos o `INITIAL_STATE`

```js
const INITIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};

```

- Importamos o `produce` que utilizamos para manipular o state de forma mais simple:

```js
import produce from 'immer';
```

- Adicionamos o case no caso que direção tomar quando determinada action de nome tal, for chamada:

```js
// ...
// os parametro `action` possuí as informações que estão sendo enviadas ao ser disparada...
/*
  SignIn: `dispatch(signInRequest(email, password));`
  ---
  auth/actions:
    export function signInRequest(email, password) {
      return {
        type: '@auth/SIGN_IN_REQUEST',
        payload: { email, password },
      };
    }
  ---
  auth/sagas:
    yield put(signInSuccess(token, user));
  ---
  auth/actions:
    export function signInSuccess(token, user) {
      return {
        type: '@auth/SIGN_IN_SUCCESS',
        payload: { token, user },
      };
    }
  ---
  No caso o SignIn disparou a action para autenticação que por sua vez fez a requisição pelo sagas o qual ao obter as informações da api disparou a action signInSuccess que envia o `token` e o `user` para o reducer.
*/
export default function auth(state = INITIAL_STATE, action) {
// ...

case '@auth/SIGN_IN_SUCCESS':
  return produce(state, (draft) => {
    // a parti daqui posso manipular o state da forma que desejar, só utilizar o `draft.` na frente.
    draft.token = action.payload.token;
    draft.signed = true;
  });
// ...
}

```

- Por fim precisamos autualizar a informação dentro de `src/routes/Route.js` para receber as informações atualizadas e disparadas pela action do redux:

```js
// ...
// store do redux
import store from '~/store';
// ...
// o store.getState() retornará todo o State dentro de `store`, nesse caso queremos o state auth e a propriedade `signed`, se lembramos no arquivo `src/store/auth/reducer.js` temos o seguinte:
/*

Aqui dentro temos o signed:
const INITIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};

// aqui é o nome do nosso state no caso auth
export default function auth(state = INITIAL_STATE, action) {
  //...
}
*/
const { signed } = store.getState().auth;
// ...

```

---

## Token e dados do usuário

- Para armazenar o token e os dados do usuário vamos criar outro modulo:

- Criar a pasta `src/store/modules/user`
- Criar o arquivo `src/store/modules/user/actions.js`
- Criar o arquivo `src/store/modules/user/reducer.js`
- Criar o arquivo `src/store/modules/user/sagas.js`

- Por padrão no arquivo `sagas.js` adicionamos apenas:


```js
import { all } from 'redux-saga/effects';

export default all([]);
```

- E depois implementamos o restantes conforme necessário

- O `reducer.js` nesse caso podemos utilizar quase a mesma estrutura do `reducer` de autenticação, pois diferentes reducers podem `ouvir` mesma actions que estão em módulos distintos:

```js
import produce from 'immer';

const INITIAL_STATE = {
  profile: null,
};

// ** IMPORTANTE ** colocar o nome da function em geral com o mesmo nome do modulo

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case '@auth/SIGN_IN_SUCCESS':
      return produce(state, (draft) => {
        draft.profile = action.payload.user;
      });
    default:
      return state;
  }
}

```

- **Não esqueça de inserir o novo módulo no rootReducer e no rootSagas**:

---

- No Reactotron adicionamos em State um subscribe para o `user`.

---

## Persistir dados do redux

- Para persistir dados no redux para quando o usuário der um refresh na página por exemplo, não perder os dados armazanados no redux.

- Para começar instalamos a dependencia:

```bash
yarn add redux-persist
```

- O `redux-persist` consegue utilizar vários storage, no caso da web consegue utilizar o localstorage, e no native o AsyncStorage,

- Crie o arquivo `src/store/persistReducers.js`:

```js
// o storage obtem a estratégia padrão para armazenamento,
// No caso para web o localstorage, e para o native seria o asyncstorage
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default (reducers) => {
  const persisttedReducer = persistReducer(
    {
      key: 'gobarber',
      storage,
      whitelist: ['auth', 'user'],
    },
    reducers
  );

  return persisttedReducer;
};

```

- Entendendo melhor a function acima:

```js
// o storage obtem a estratégia padrão para armazenamento,
// No caso para web o localstorage, e para o native seria o asyncstorage
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default (reducers) => {
  const persisttedReducer = persistReducer(
    {
      key: 'NOME_DA_APLICACAO', // Utilizado um nome único para caso estejamos utilizando outras aplicações na mesma base url não compartilhar storage entre elas
      storage, // A estratégia que importamos ali nos imports
      whitelist: ['auth', 'user'], // Quais reducers queremos armazenar, no caso se houver um reducer que não queremos armazenar no storage é só não informar no `whitelist`
    },
    reducers
  );

  return persisttedReducer;
};

```

---

Ajustar o arquivo `src/store/index.js`:

```js
// Adicionar esse import
import { persistStore } from 'redux-persist';

import createSagaMiddleware from 'redux-saga';

import createStore from './createStore';

// Adicionar esse import
import persistReducers from './persistReducers';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMonitor =
  process.env.NODE_ENV === 'development'
    ? console.tron.createSagaMonitor()
    : [''];

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const middlewares = [sagaMiddleware];

// Adicionar o persistReducers que encapsula o `rootReducer`
const store = createStore(persistReducers(rootReducer), middlewares);
// Criar essa nova const
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

// exportar o store e o persistor
export { store, persistor };

```

- Nesse momento dará alguns erros na aplicação, para resolver faça o seguinte:

- No arquivo `src/App.js`:

```js
import { store } from './store'; // Precisa vir após o ReactotronConfig para ter acesso do Saga Monitor ou o enhancer
```

- No arquivo `src/routes/Route.js`:

```js
// store do redux
import { store } from '~/store';
```


- Ok nesse momento a aplicação voltou a funcionar, mas ainda os dados não estão sendo persistidos, para isso precisamos ajustar mais um pouco no arquivo `src/App.js`:

- Importar o seguinte:

```js
import { PersistGate } from 'redux-persist/integration/react';

//...
import { store, persistor } from './store'; // Precisa vir após o ReactotronConfig para ter acesso do Saga Monitor ou o enhancer
// ...
```

- Adicionar o componente `PersistGate` dentro do componente `Provider` ainda no arquivo `App.js`, e como parametro passar a const `persistor` importada acima:

```js
<Provider store={store}>
  <PersistGate persistor={persistor}>
    <Router history={history}>
      <Routes />
      <GlobalStyle />
    </Router>
  </PersistGate>
</Provider>
```

- Esse `PersistGate` irá reenderizar o conteúdo dentro dele somente depois de consultar os dados dentro do storage da aplicação.

- No Reactotron na `Timeline` aparecerá mais duas `ACTION` que no caso refere-se ao persist, e dentro dela conterá as informações salvas, no caso do `persist/REHYDRATE`

---

## Loading da aplicação

Mostrar o icone de carregando quando realizar requisição na API.

- No arquivo `src/store/modules/auth/reducer.js` adicionar a `escuta` para algumas actions:

```js
import produce from 'immer';

const INITIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@auth/SIGN_IN_REQUEST': {
        draft.loading = true; // <- Adicionado para controlar o state do loading
        break;
      }
      case '@auth/SIGN_IN_SUCCESS': {
        draft.token = action.payload.token;
        draft.signed = true;
        draft.loading = false; // <- Adicionado para controlar o state do loading
        break;
      }
      case '@auth/SIGN_FAILURE': {
        draft.loading = false; // <- Adicionado para controlar o state do loading
        break;
      }
      default:
    }
  });
}
```

- No arquivo `src/pages/SignIn/index.js` ajustar o seguinte:

```js
import { useDispatch, useSelector } from 'react-redux';

// ...
// No useSelector obtemos o `state` e podemos acessar quaisquer reducers através dele.
const loading = useSelector((state) => state.auth.loading);
// ...
<button type="submit">{loading ? 'Carregando...' : 'Acessar'}</button>
// ...
```

- Precisamos realizar um ajuste no `src/store/modules/auth/sagas.js`:

```js
// ...

export function* signIn({ payload }) {
  // ...
  try {
    // ...
  } catch (err) {
    yield put(signFailure());
  }
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);

```

---
## Exibir Toasts

Adicionando uma mensagem ao ocorrer um erro:

- Instale a seguinte lib:

```bash
yarn add react-toastify
```

- Realizamos ajustes no `src/App.js`:

```js
// ...
import { ToastContainer } from 'react-toastify';
// ...
<Provider store={store}>
  <PersistGate persistor={persistor}>
    <Router history={history}>
      <Routes />
      <GlobalStyle />
      <ToastContainer autoClose={3000} /> {/* <- Adicionamos ele aqui, com fechamento de 3s */}
    </Router>
  </PersistGate>
</Provider>
// ...
```

- No arquivo `src/styles/globals.js` adicione o css o toastify:

```js

// ...
import 'react-toastify/dist/ReactToastify.css';

// ...

export default createGlobalStyle`
  // ...
`
```



- No arquivo `src/store/modules/auth/sagas.js` adicionamos o seguinte:

```js
import { toast } from 'react-toastify';

// ...
if (!user.provider) {
  toast.error('Usuário não é prestador');
  return;
}
// ...
catch (err) {
  toast.error('Falha na autenticação, verifique seus dados');
  yield put(signFailure());
}
// ...
```

- Para o signUp, criamos uma nova action em `src/store/modules/auth/actions.js`:


```js
export function singUpRequest(name, email, password) {
  return {
    type: '@auth/SING_UP_REQUEST',
    payload: { name, email, password },
  };
}
```

- Criamos uma nova takeLatest em `src/store/modules/auth/sagas.js`:

```js
//...

export function* signUp({ payload }) {
  const { name, email, password } = payload;

  try {
    yield call(api.post, 'users', {
      name,
      email,
      password,
      provider: true,
    });

    history.push('/');
  } catch (error) {
    toast.error('Falha no cadastro, verifique seus dados!');
    yield put(signFailure());
  }
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SING_UP_REQUEST', signUp),
]);
```

- Realizamos a chamada no arquivo `src/pages/SignUp`:

```js
import { useDispatch } from 'react-redux';
import { singUpRequest } from '~/store/modules/auth/actions';
// ...
const dispatch = useDispatch();

function handleSubmit({ name, email, password }) {
  dispatch(singUpRequest(name, email, password));
}
// ...

```

---

## Adicionar o token de autenticação na Api axios

- No arquivo do sagas que realizamos a autenticação do usuário `src/store/modules/auth/sagas.js` adicionamos o headers para api:

```js
// ...
api.defaults.headers.Authorization = `Bearer ${token}`;
yield put(signInSuccess(token, user));
// ...
```

- O problema é quando damos refresh na página precisamos obter o token novmante, para isso ajustamos o `src/store/modules/auth/sagas.js`

```js
// ...
export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SING_UP_REQUEST', signUp),
  takeLatest('persist/REHYDRATE', setToken), // <- Adicionado isso percebemos utilizando Timeline do Reactotron
]);
```

---

## Página de Dashboard

- Criar a parte do `header` que será compartilhado por outras páginas, para tal criamos como component.

- Criar a pasta `src/components`
- Criar o arquivo `src/components/Header/index.js`

**Uma dica para gerar avatar: [Adorable Avatars](http://avatars.adorable.io)**

- Em `src/pages/_layouts/default/index.js` adicionar o component Header.

---

- Criar a parte de notificações

- Criar o arquivo `src/components/Notificacoes/index.js`
- Criar o arquivo `src/components/Notificacoes/styles.js`

- Importa-lo para o arquivo `src/components/Header/index.js`

- Adicionar a dependencias de icons:

```bash
yarn add react-icons
```

- Mais detalhes em [Estilização na prática 1](https://github.com/mrcarromesa/react-parte7)

## Scroll bar com react

Para utilizar algo parecido com `overflow: auto` para exibir um scroll para quando a quantidade de elementos atingir alem do tamanho definido.

- Primeiramente instale a dependencia:

```bash
yarn add react-perfect-scrollbar
```

- Para utilizar é necessário importar no `src/styles/globals.js` precisamos importar o seguinte css:

```js
import 'react-perfect-scrollbar/dist/css/styles.css';
```

- Mais detalhes: [React-Perfect-Scrollbar](https://github.com/goldenyz/react-perfect-scrollbar)


---

## Obtendo as notificações da api

- Realizar ajustes no arquivo `src/components/Notifications/index.js`:

- Para trabalahar com data podemos utilizar a lib `data-fns@next` o `@next` é para obter sempre a última versão:

```bash
yarn add date-fns@next
```

- Vamos utilizar para determinar o intervalod de data de há quanto tempo uma notificação foi criada...,

- Para isso importamos:

```js
// o parseISO utilizamos para transformar uma string em um obejct Date do javascript
// o formatDistance utilizamos para obter formatação de distancia, ex.: essa data foi a tanto tempo atrás
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
```

- E utilizamos da seguinte forma:

```js
timeDistance: formatDistance(
  parseISO(notification.createdAt), // <- Calcular de, converte string para Object Data do JS
  new Date(), // <- Calcular até a data atual
  {
    addSuffix: true, // <- Adicionar a palavra `há` na frente da distancia da data.
    locale: pt  // <- Utilizar no idioma pt-BR, conforme definido no import
  }
),

// Exemplo do resultado: `há 9 dias`
```

- Como atualizar uma notificação de Não lida para lida:

```js
async function handleMarkAsRead(id) {
  await api.put(`notifications/${id}`);

  // Alterado o state: const [notifications, setNotifications] = useState([]);
  setNotifications(
    // Pecorre todas as notificacoes
    notifications.map((notification) =>
    // ao encontrar a notificacao no qual o id for igual ao id passado na function alteramos o valor do read, dessa forma:
    // { ...notification, PROP_QUE_SERA_ADD_OU_ALTERADA: NOVO_VALOR_DO_PROP }
    // caso contrário retorna o proprio object
      notification._id === id ? { ...notification, read: true } : notification
    )
  );
}
```

---

- Atualizando o `state` de forma performatica do badge do notifications utilizando o `useMemo`:

```js
const hasUnread = useMemo(
  () => !!notifications.find((notification) => !notification.read),
  [notifications]
);
```

- O `!!` utilizado é devido o `find` retornar um array, mas precisamos retornar um `boolean`, então utilizamos esse recurso do `!!` que também é a mesma coisa de utilizarmos o `Boolean(...)`

- Utilizamos Esse hook pois ele será chamado apenas quando o valor do notication mudar, pois do contrário qualquer `state` que mudasse, como no caso do `visble` ele iria recaulcular esse valor toda vez, mesmo não sendo necessário, por isso esse é um bom motivo para utilizarmos o `useMemo` por uma questão de desempenho.

- Mais detalhes: [Hooks](https://github.com/mrcarromesa/react-hooks-parte2)


---

- Trabalhando na página `Profile`

- Adicionado actions em `src/store/modules/user/actions.js`
- Adicionado takeLast em `src/store/modules/user/sagas.js`

- **Não esquecer de adicionar mais um case no reducer para atualizar o state do profile**

- No arquivo `src/store/modules/user/reducer.js`

```js
case '@user/UPDATE_PROFILE_SUCCESS': {
  draft.profile = action.payload.profile;
  break;
}
```

- Algo interessante é essa forma de desestruturação:

```js
  const { name, email, ...rest } = payload.data; // O object tem mais informações estamos obtendo apenas o name e email e todo o resto fica dentro do ...rest
  const profile = { name, email, ...(rest.oldPassword ? rest : {}) }; // Está utilizando o Object.assign()
  // O mesmo que:

  // const profile = Object.assign({name, email}, rest.oldPassword ? rest : {});
```


---

## Component Input File com preview

- Criar o arquivo `src/pages/Profile/AvatarInput/index.js`
- Criar o arquivo `src/pages/Profile/AvatarInput/styles.js`


---

## Sair da aplicação

- Criar uma nova action em `src/store/modules/auth/actions.js`:

```js
export function signOut() {
  return {
    type: '@auth/SIGN_OUT',
  };
}
```

- Cria um novo case em `src/store/modules/auth/reducer.js`:

```js
case '@auth/SIGN_OUT': {
  draft.token = null;
  draft.signed = false;
  break;
}
```

- Também no reducer de usuário em `src/store/modules/user/reducer.js` adicione:

```js
case '@auth/SIGN_OUT': {
  draft.profile = null; // <- Vamos voltar ao state inicial o usuário
  break;
}
```

- No arquivo `src/store/modules/auth/sagas.js` adicionar:

```js
// ...
export function signOut() {
  history.push('/'); // <- Voltamos o usuário para tela inicial
}

export default all([
  // ...
  takeLatest('@auth/SIGN_OUT', signOut),
]);
```

- Por fim chamar o dispatch para a action em `src/pages/Profile/index.js`
