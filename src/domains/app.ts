import ContextStore from '@app/core/context-store';

/** Additional values which may be set in Context (Context extends Locals) */
export interface Locals {
  debug?: boolean;
}

/** Context passed in controller request */
export interface Context extends Locals {
  requestId?: string;
  appContextStore?: ContextStore;
  log?: boolean;
  topic?: string;
}

/** Request data to controllers */
export interface Request<Body = unknown, Params = unknown, Query = unknown> {
  body: Body extends null ? never : Body;
  params: Params extends null ? never : Params;
  query: Query extends null ? never : Query;
  context: Context;
  headers: Record<string, string | string[] | undefined>;
  cookies: Record<string, string>;
}

/** NewRequest creates a new requests with safe defaults */
export function NewRequest(args: {
  body?: unknown;
  params?: unknown;
  query?: unknown;
  context?: Context;
  headers?: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string>;
}): Request {
  const { body, params, query, context, headers, cookies } = args;
  return {
    body: body ?? {},
    params: params ?? {},
    query: query ?? {},
    context: context ?? {},
    headers: headers ?? {},
    cookies: cookies ?? {},
  };
}

/** Response from controllers */
export interface Response<Body> {
  data?: Body | null;
  headers?: { [key: string]: string }[];
}
