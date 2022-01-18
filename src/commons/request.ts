import { baseUrl } from './config';

interface HttpOptions {
  url: string;
  method?: 'GET' | 'POST' | 'DELETE';
  data?: Record<string, any>;
}

export const http = async <T>({ url, method = 'GET', data }: HttpOptions) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + url,
      method,
      data,
      success: (res) => {
        resolve(res.data as T);
      },
      fail: reject,
    });
  });
};

http.get = <T>(url: string, data: any) => http<T>({ url: url, data: data });

http.post = <T>(url: string, data: any) => http<T>({ url: url, data: data, method: 'POST' });
