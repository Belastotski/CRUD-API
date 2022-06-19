import http from 'http';

type TOptions = {
  hostname: string;
  port: number | string;
  path?: string;
  method?: string;
  headers: {
    'Content-Type'?: string;
    'Content-Length'?: number;
  };
};

export class CRUDTester {
  public options: TOptions;
  constructor(hostname = 'localhost', port: string | number = 5000) {
    this.options = { hostname, port, headers: { 'Content-Type': 'application/json' } };
  }

  test(
    method: string,
    path: string,
    data: string | null,
    equalCode?: number,
    equalData?: string,
  ): Promise<{ pass: boolean; code: number; body: string; message: string }> {
    const option: TOptions = { method, path, ...this.options };
    if (data) option.headers['Content-Length'] = data.length;
    return new Promise(function (resolve, reject) {
      const req = http.request(option, (res) => {
        const code = res.statusCode as number;
        let body = '';
        res.on('data', (d) => {
          body += d;
        });
        res.on('end', () => {
          let message = '';
          let pass = true;
          if (equalCode) pass = equalCode == code;
          if (equalData && pass) pass = equalData == body;
          if (equalCode || equalData) {
            message = `
Expected ${equalCode ? `code: ${equalCode} ` : ''}${equalData ? `data: ${equalData}` : ''}
received ${equalCode ? `code: ${code} ` : ''}${equalData ? `data: ${body}` : ''}`;
          }
          resolve({ pass, code, body, message });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });
      if (data) req.write(data);
      req.end();
    });
  }
}
