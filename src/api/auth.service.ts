import api from './axios';
import type { AuthPayload, LoginCredentials, RegisterData } from '../types';

export const authService = {

  async login(credentials: LoginCredentials): Promise<AuthPayload> {

    const response = await api.post<AuthPayload>(
      '/auth/login',
      credentials
    );

    console.log("RESPONSE COMPLETA:", response);
    console.log("RESPONSE.DATA:", response.data);

    return response.data;
  },


  async register(payload: RegisterData): Promise<AuthPayload> {

    const response = await api.post<AuthPayload>(
      '/auth/register',
      payload
    );

    console.log("RESPONSE COMPLETA:", response);
    console.log("RESPONSE.DATA:", response.data);

    return response.data;
  }

};