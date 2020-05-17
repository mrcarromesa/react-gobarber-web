import { combineReducers } from 'redux';

import auth from './auth/reducer';
import user from './user/reducer';

// ** o combineReducers aceita um `object` com varios elementos como parametro
export default combineReducers({ auth, user });
