/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth-context';

export const useAuth = () => useContext(AuthContext) as any;
