import { app } from './index';
import { Request, Response } from 'express';
import { AxiosHeaders } from 'axios';

import { allowIfAnyOf } from './middleware/auth';
import { identityApi, profileApi, contentApi, cloudflareApi } from './microservices';
import { filterObject, getProfileData, transformContent } from './/utils/utils';

// BEWARE: For content related operations, do not forward `host` or `content-length` headers!
// - `host`: The service you are forwarding to will most likely not have the same `host` available in it's TLS certificate.
//   Axios will set an appropriate `host` header only if we let it. (I.e. we are not setting it ourselves.)
// - `content-length`: Express will have deserialized the request body for us already, and Axios will re-serialize it on forward.
//   This will inadvertendly lead to differences in `content-length`. Again, Axios will set an appropriate `content-length` header
//   only if we let it. (I.e. we are not setting it ourselves.)
const filterHeadersToForward = (req: Request, ...allowList: string[]): AxiosHeaders => {
  return new AxiosHeaders(filterObject(req.headers, ...allowList) as { [key: string]: string });
};

/////////////////// Cloudflare Service ///////////////////

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  // Typically, we receive an empty request body for this endpoint,
  // together with a (correct!) `content-length` header with value `0`.
  //
  // Express defaults to converting that into an empty JS object.
  //
  // When that happens, we can not forward the "content-length: 0" header anymore,
  // because the re-serialization of that is not a string with length 0 anymore.

  const { status, data, headers } = await cloudflareApi.post('upload/video-tus-reservation', '', {
    params: req.query,
    headers: filterHeadersToForward(req, 'upload-length', 'upload-metadata', 'authorization')
  });
  res.status(status).set(headers).send(data);
});

/////////////////// Content Service ///////////////////
app.get('/content', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get('content', {
    params: req.query,
    headers: filterHeadersToForward(req, 'authorization')
  });

  const transformedContent = await transformContent(data.data, filterHeadersToForward(req, 'authorization'));
  res.status(status).json(transformedContent);
});

app.get('/content/:contentId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { status, data } = await contentApi.get('content/' + req.params.contentId, {
    params: req.query,
    headers: filterHeadersToForward(req, 'authorization')
  });

  const transformedContent = await transformContent([data], filterHeadersToForward(req, 'authorization'));
  res.status(status).json(transformedContent[0]);
});

/////////////////// Profile Service ///////////////////

app.get('/profiles/tag/:tag', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const filteredAuthHeader = filterHeadersToForward(req, 'authorization');

  try {
    const { tag } = req.params;
    const tagResponse = await profileApi.get('profiles/tag/' + tag, {
      headers: filteredAuthHeader
    });

    if (tagResponse.status !== 200) {
      return res.status(tagResponse.status).json(tagResponse.data);
    }

    const profileId = tagResponse.data.id;
    const profile = await getProfileData(profileId, filteredAuthHeader);
    res.status(200).json({ data: profile });
  } catch (error) {
    res.status(500).json('Unable to retrieve profile details');
  }
});

app.get('/profiles/:profileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const filteredAuthHeader = filterHeadersToForward(req, 'authorization');

  try {
    const { profileId } = req.params;
    const profile = await getProfileData(profileId, filteredAuthHeader);
    res.status(200).json({ data: profile });
  } catch (error) {
    res.status(500).json('Unable to retrieve profile details');
  }
});

app.get('/collaborators', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { status, data } = await profileApi.get('profiles/', {
    headers: filterHeadersToForward(req, 'authorization')
  });

  const result = Object.values(data).map((item: any) => ({
    id: item.id,
    organization: item.organization,
    tag: item.tag
  }));

  res.status(status).json(result);
});

app.get('/search', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  type ServiceResult = {
    status: number | null;
    data: any | null;
    error: string | null;
    meta: any;
  };

  const scope: string | undefined = req.query.scope as string | undefined;

  const searchContentResult: ServiceResult = { status: null, data: null, error: null, meta: null };
  const searchProfileResult: ServiceResult = { status: null, data: null, error: null, meta: null };

  const filters: any = {};
  Object.keys(req.query).forEach((key) => {
    if (key.startsWith('filters.')) {
      const filterKey = key.substring('filters.'.length);
      filters[filterKey] = req.query[key];
      delete req.query[key];
    }
  });

  req.query.filters = filters;

  if (!scope || scope === 'content') {
    try {
      const contentResponse = await contentApi.get('search/', {
        params: req.query,
        headers: filterHeadersToForward(req, 'authorization')
      });

      const contentToTransform = await Promise.all(
        contentResponse.data.data.map(async (item: any) => {
          Object.assign(item, item.data);
          delete item.data;
          return item;
        })
      );

      searchContentResult.meta = contentResponse.data.meta;
      searchContentResult.status = contentResponse.status;
      searchContentResult.data = await transformContent(contentToTransform, filterHeadersToForward(req, 'authorization'));
    } catch (error: any) {
      searchContentResult.status = error.response?.status || 500;
      searchContentResult.error = error.message;
    }
  }

  if (!scope || scope === 'profile') {
    try {
      const profileResponse = await profileApi.get('search/', {
        params: req.query,
        headers: filterHeadersToForward(req, 'authorization')
      });

      searchProfileResult.meta = profileResponse.data.meta;
      searchProfileResult.status = profileResponse.status;
      searchProfileResult.data = profileResponse.data.data;
    } catch (error: any) {
      searchProfileResult.status = error.response?.status || 500;
      searchProfileResult.error = error.message;
    }
  }

  const responsePayload: any = {};

  if (!scope || scope === 'content') {
    responsePayload.contentResults = {
      meta: searchContentResult.meta,
      data: searchContentResult.data,
      status: searchContentResult.status,
      error: searchContentResult.error
    };
  }

  if (!scope || scope === 'profile') {
    responsePayload.profileResults = {
      meta: searchProfileResult.meta,
      data: searchProfileResult.data,
      status: searchProfileResult.status,
      error: searchProfileResult.error
    };
  }

  res.status(200).json(responsePayload);
});
