import { responseSchema as contentFeedResponseSchema } from "./request-types/content-feed";
import {
  bodySchema as loginBodySchema,
  responseSchema as loginResponseSchema,
  defaultRequest as loginDefaultRequest
} from "./request-types/login";
import {
  bodySchema as registerBodySchema,
  responseSchema as registerResponseSchema,
  defaultRequest as registerDefaultRequest
} from "./request-types/register";

import {
  bodySchema as refreshBodySchema,
  responseSchema as refreshResponseSchema,
  defaultRequest as refreshDefaultRequest
} from "./request-types/refresh-token"

const mapper: any = {
  contentFeed: {
    responseSchema: contentFeedResponseSchema,
  },
  login: {
    bodySchema: loginBodySchema,
    responseSchema: loginResponseSchema,
    defaultRequest: loginDefaultRequest
  },
  register: {
    bodySchema: registerBodySchema,
    responseSchema: registerResponseSchema,
    defaultRequest: registerDefaultRequest
  },
  refreshToken: {
    bodySchema: refreshBodySchema,
    responseSchema: refreshResponseSchema,
    defaultRequest: refreshDefaultRequest 
  }
};

export function getBodySchema(requestType: string) {
  return mapper[requestType]?.bodySchema;
}

export function getResponseSchema(requestType: string) {
  return mapper[requestType]?.responseSchema;
}

export function getDefaultRequest(requestType: string) {
  return mapper[requestType]?.defaultRequest;
 
}
