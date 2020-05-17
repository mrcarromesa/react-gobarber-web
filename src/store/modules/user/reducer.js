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
