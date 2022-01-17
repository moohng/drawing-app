interface HttpOoptions {
  url: string;
  method?: 'GET' | 'POST' | 'DELETE';
  data?: Record<string, any>;
}

export const http = async ({ url, method = 'GET', data }: HttpOoptions) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com' + url,
      method,
      data,
      success: (res: any) => {
        resolve(res.data);
      },
      fail: reject,
    });
  });
}

http.get = (url: string, data: any) => http({ url: url, data: data })

http.post = (url: string, data: any) => http({ url: url, data: data, method: 'POST' })
