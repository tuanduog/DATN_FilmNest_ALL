import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project-imports
import Loader from 'components/Loader';
import axios from 'utils/axios';
import loginApi from 'api/login';

// types
import { AuthInfo, AuthProps, JWTContextType } from 'types/auth';
import { KeyedObject } from 'types/root';

const chance = new Chance();

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          const decoded: any = jwtDecode(serviceToken);
          const role = decoded.scope || '';

          if (role.toUpperCase() === 'USER') {
            setSession(null);
            dispatch({ type: LOGOUT });
            return;
          }

          setSession(serviceToken);
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: decoded.id || '',
                name: decoded.sub || '',
                role: decoded.scope || ''
              }
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (authInfo: AuthInfo) => {
    const data = await loginApi(authInfo);

    // loginApi catches and returns errors, so handle if it's an error
    if (data instanceof Error || data?.name === 'AxiosError') {
      throw data;
    }

    const token = data?.data?.token || data?.token || data?.serviceToken;

    if (token) {
      const decoded: any = jwtDecode(token);
      const role = decoded.scope || '';

      if (role.toUpperCase() === 'USER') {
        throw new Error('Tài khoản không có quyền truy cập vào hệ thống.');
      }

      setSession(token);
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user: data?.data?.user || data?.user || {
            id: decoded.id || '',
            name: decoded.sub || authInfo.username,
            role: decoded.scope || ''
          }
        }
      });
    } else {
      throw new Error(data?.message || 'Login failed');
    }
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email: string) => {
    console.log('email - ', email);
  };

  const updateProfile = () => { };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext value={{ ...state, login, logout, resetPassword, updateProfile }}>{children}</JWTContext>;
};

export default JWTContext;
