/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../api/auth-api';
import type { User } from '../types/user.type';

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextValue extends State {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => Promise<void>;
  reAuth: (token?: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

enum ActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  REAUTH = 'REAUTH',
}

type LoginAction = {
  type: ActionType.LOGIN;
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: ActionType.LOGOUT;
};

type RegisterAction = {
  type: ActionType.REGISTER;
  payload: {
    isAuthenticated: boolean;
    user: User;
  };
};

type ReAuthAction = {
  type: ActionType.REAUTH;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type Action = LoginAction | LogoutAction | RegisterAction | ReAuthAction;

type Handler = (state: State, action: any) => State;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: {
    firstName: '',
    lastName: '',
  },
};

const handlers: Record<ActionType, Handler> = {
  REAUTH: (state: State, action: ReAuthAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },

  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },

  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),

  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: false,
      user,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  reAuth: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    reAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const user = await authApi.login({ email, password });
    dispatch({
      type: ActionType.LOGIN,
      payload: {
        user,
      },
    });
  };

  const reAuth = async (): Promise<void> => {
    try {
      const { success, user } = await authApi.reAuth();
      if (success) {
        dispatch({
          type: ActionType.REAUTH,
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: ActionType.REAUTH,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.REAUTH,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  const logout = async (): Promise<void> => {
    await authApi.logout();
    dispatch({
      type: ActionType.LOGOUT,
    });
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> => {
    const user = await authApi.register({
      email,
      password,
      firstName,
      lastName,
    });

    dispatch({
      type: ActionType.REGISTER,
      payload: {
        user,
        isAuthenticated: false,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        reAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
