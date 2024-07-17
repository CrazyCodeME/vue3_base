import remote from '@/services/remote';
import type { IPayload, IResponse } from '@/types';
export const login = (payload?: IPayload) => remote.post('/login.do', { payload }) as Promise<IResponse>;
export const register = (payload?: IPayload) => remote.post('/register.do', { payload }) as Promise<IResponse>;
