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
      baseURL: response.config.baseURL,
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
      code: any;
      request?: any;
    } = {
      code: error.code
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