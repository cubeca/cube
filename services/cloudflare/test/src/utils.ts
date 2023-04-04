import type { AxiosResponse, AxiosError } from 'axios';

export const inspect = (...things: any) =>
  things.forEach((thing: any) =>
    console.dir(thing, { depth: null, color: true })
  );


export const inspectAxiosResponse = (response:AxiosResponse) => {
  let requestBody:any;
  try {
    requestBody = JSON.parse(response.config.data);
  }
  catch {
    requestBody = response.config.data;
  }
  const isTextResponse:boolean = ('string' == typeof response.data);
  const summary:any = {
    request: {
      method: response.config.method,
      url: response.config.url,
      queryParams: response.config.params,
      headers: response.config.headers,
      jsonBody: requestBody,
    },
    response: {
      status: response.status,
      reason: response.statusText,
      headers: response.headers,
      jsonBody: isTextResponse ? '[see printed response text below]' : response.data,
    },
  }

  inspect(summary);
  if (isTextResponse) {
    console.log(response.data);
  }
};

export const inspectAxiosError = (error:AxiosError) => {
  if (error.response) {
    inspectAxiosResponse(error.response);
  }
  else if (error.code) {
    const summary:{
      code?: any;
      port?: any;
      address?: any;
      syscall?: any;
      errno?: any;
      message?: any;
      request?: any;
    } = {
      code: error?.code,
      port: (error as any)?.port!,
      address: (error as any)?.address!,
      syscall: (error as any)?.syscall!,
      errno: (error as any)?.errno!,
      message: error?.message,
    };
    if (error.config) {
      summary.request = {
        timeout: error.config.timeout,
        method: error.config.method,
        url: error.config.url,
        queryParams: error.config.params,
        headers: error.config.headers,
        jsonBody: error.config.data,
      };
    }
    inspect(summary);
  }
  else {
    inspect(error);
  }
};

export const makeUUID = () => {
  const randHex = () => '0123456789abcdef'[Math.floor(Math.random() * 16)];
  const randRest = () => '89ab'[Math.floor(Math.random() * 4)];
  return String('00000000-0000-4000-8000-000000000000').replaceAll('8', randRest).replaceAll('0', randHex);
};
