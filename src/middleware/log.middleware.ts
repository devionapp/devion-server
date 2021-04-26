import {Middleware} from '@loopback/rest';

export const log: Middleware = async (middlewareCtx, next) => {
  const {request} = middlewareCtx;
  console.log('Request: %s %s', request.method, request.originalUrl);
  try {
    // Proceed with next middleware
    const result = await next();
    // Process response
    console.log(
      'Response received for %s %s',
      request.method,
      request.originalUrl,
    );
    return result;
  } catch (err) {
    // Catch errors from downstream middleware
    console.error(
      'Error received for %s %s',
      request.method,
      request.originalUrl,
    );
    throw err;
  }
};
