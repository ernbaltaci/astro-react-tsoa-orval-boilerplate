import Axios, { AxiosRequestConfig } from 'axios';

export const customInstance = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  // Get token from Zustand persist storage
  const authData = localStorage.getItem('auth');
  const token = authData ? JSON.parse(authData).state?.token : null;

  const instance = Axios.create({
    baseURL: import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Attach refresh-token logic
  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      return Promise.reject(err);
    }
  );

  const { data } = await instance(config);
  return data;
};

