import api from './axios';
import { 
    ApiResponse, 
    AuthPayload, 
    LoginCredentials, 
    RegisterData 
} from '../types';

export const authService = {

  async login(credentials: LoginCredentials): Promise<AuthPayload> {
    // Axios devuelve: response.data = { success, message, data: {token, user} }
  // Nosotros queremos el campo 'data' interno -> response.data.data
  const response = await api.post<ApiResponse<AuthPayload>>('/auth/login', credentials);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;    // { token, user }
},

async register(payload: RegisterData): Promise<AuthPayload> {
  const response = await api.post<ApiResponse<AuthPayload>>('/auth/register', payload);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;    // { token, user }
 },
};