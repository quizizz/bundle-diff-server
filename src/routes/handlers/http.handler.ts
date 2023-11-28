import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import BaseController from '@app/controllers/base.controller';
import { ErrorHandler } from '@app/errors/error-handler';
import ValidationError from '@app/errors/validation.error';
import type ContextStore from '@app/core/context-store';
import { Locals, NewRequest } from '@app/domains/app';
import { ErrorMessageGenerator } from '@app/routes/handlers/helpers';
import BaseError from '@app/errors/base.error';
import { logging } from '@app/utils';
import { HttpCommunication } from '@quizizz/service-communication';
import AsyncStorageService from '@app/services/async-storage.service';
import { performance } from 'perf_hooks';
import { logger } from '@app/core/logger';

export default class HttpRequestHandler {
  constructor(
    private controller: BaseController<any>,
    private appContextStore: ContextStore,
    private errorHandler: ErrorHandler,
    private asyncStorage: AsyncStorageService,
  ) {}

  parseRequest(req: ExpressRequest) {
    return {
      method: req.method,
      route: req.originalUrl,
      ip: req.ip,
      ips: req.ips,
      time: Date.now(),
      protocol: req.protocol,
      referer: req.get('Referer'),
      userAgent: req.get('User-Agent'),
    };
  }

  parseResponse(res: ExpressResponse) {
    const store = this.asyncStorage.mustGetStore();
    return {
      size: Number(res.get('Content-Length')) || 0,
      statusCode: res.statusCode,
      timeTaken: performance.now() - Number(store.reqStartTime.toFixed(2)),
    };
  }

  parseError(err: BaseError) {
    return logging.parseError(err);
  }

  logRequest(req: ExpressRequest) {
    logger.infoj({
      type: 'http-request',
      data: {
        req: this.parseRequest(req),
      },
    });
  }

  logResponse(
    err: BaseError | null,
    req: ExpressRequest,
    res: ExpressResponse,
  ) {
    const toPrint = {
      type: 'http-response',
      data: {
        req: this.parseRequest(req),
        res: this.parseResponse(res),
        err: err ? this.parseError(err) : undefined,
      },
    };

    if (err) {
      logger.errorj(toPrint);
    } else {
      logger.infoj(toPrint);
    }
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const reqContext = HttpCommunication.getRequestContext(req);
    const asyncStore = {
      ...reqContext,
      action: this.controller.name,
    };

    await this.asyncStorage.getInstance().run(asyncStore, async () => {
      try {
        this.logRequest(req);

        const { locals = {} } = res as { locals: Locals };
        const { body, query, params, headers: reqHeaders, cookies } = req;
        const request = NewRequest({
          body,
          query,
          params,
          context: { ...locals, appContextStore: this.appContextStore },
          headers: reqHeaders,
          cookies,
        });

        // First sanitize the request
        if (this.controller.sanitize) {
          this.controller.sanitize(request);
        }

        // Second validate the request
        if (this.controller.validate) {
          const validation = this.controller?.validate(request);
          // If there is a validation error, aggregate and throw it
          if (validation) {
            if (validation.error) {
              const messages = validation.error.details.map((d) => d.message);
              throw new ValidationError({
                msg: 'Validation failed',
                context: messages,
                data: messages,
              });
            }
          }
        }
        // Execute the request
        const { data = {}, headers = [] } =
          (await this.controller.exec(request)) || {};

        // Prepare the response
        headers.map((header) => {
          const key = Object.keys(header)[0];
          const value = header[key];
          res.set(key, value);
        });
        res.status(200).send({ success: true, data, time: new Date() });
        this.logResponse(null, req, res);
      } catch (err) {
        const _error = BaseError.from(err);
        this.logResponse(_error, req, res);
        this.errorHandler.handleHttpError(_error, req, res);
        res
          .status(_error.code || 500)
          .send(ErrorMessageGenerator.httpErrorMessage(_error));
      }
    });
  }
}
