/** Identifiers for all dependencies */
export default {
  MAIN: Symbol.for('main'),
  ENV: Symbol.for('process_env'),
  LOGGER: Symbol.for('logger'),
  APP_CONTEXT_STORE: Symbol.for('app-context-store'),
  BOOTSTRAP: Symbol.for('bootstrap'),
  APP_FACTORY: Symbol.for('factory<app>'),
  HTTP_SERVER: Symbol.for('http_server'),
  HTTP_FACTORY: Symbol.for('factory<http_server>'),
  CONTROLLER_FACTORY: Symbol.for('factory<controller>'),
  HTTP_ROUTES: Symbol.for('http_routes'),
  ERROR_HANDLER: Symbol.for('error_handler'),
  CONFIG: Symbol.for('config'),
  MIDDLEWARE_FACTORY: Symbol.for('middleware_factory'),
  EMITTER: Symbol.for('emitter'),

  // resources
  EXAMPLE: Symbol.for('example'),

  // controllers
  META_CONTROLLER: Symbol.for('meta_controller'),
  HEALTH_CONTROLLER: Symbol.for('health_controller'),
  NOT_FOUND_CONTROLLER: Symbol.for('not_found_controller'),
  EXAMPLE_KAFKA_CONTROLLER: Symbol.for('example_kafka_controller'),
  CLIENT_CONTROLLER: Symbol.for('CLIENT_CONTROLLER'),

  // services
  ASYNC_STORAGE_SERVICE: Symbol.for('async_storage_service'),
};
