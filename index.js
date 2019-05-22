"use strict";

const { cloneDeep, merge, omit, unset, get, isEmpty } = require("lodash");

function getCrudHandler(value) {
  if (typeof value === "object") {
    return value.handler;
  } else if (typeof value === "function") {
    return value;
  } else {
    throw new Error(`${value} must be an object or a function`);
  }
}

function getCrudConfig(value) {
  if (typeof value === "object") {
    return omit(value, ["handler"]);
  }
  return {};
}

exports = module.exports = (server, options) => {
  const basePath = options.path.slice(0, options.path.lastIndexOf("/"));
  const slug = get(/\{(\w+)\}$/.exec(options.path), 1, null);

  const validatePayload = options.config.validate.payload;
  const validateAllParams = options.config.validate.params;
  let validateCommonParams = omit(validateAllParams, slug);
  validateCommonParams = isEmpty(validateCommonParams)
    ? null
    : validateCommonParams;

  const baseOptions = omit(cloneDeep(options), [
    "method",
    "path",
    "handler",
    "crudReadAll",
    "crudCreate",
    "crudRead",
    "crudUpdate",
    "crudDelete"
  ]);
  unset(baseOptions, "config.validate.params");
  unset(baseOptions, "config.validate.payload");
  unset(baseOptions, "config.validate.query");

  function createRoute(crudMethod, route) {
    const crudConfig = getCrudConfig(crudMethod);
    if (crudConfig) {
      merge(route.config, crudConfig);
    }
    route.config.handler = getCrudHandler(crudMethod);
    server.route(merge(cloneDeep(baseOptions), route));
  }

  if (options.crudReadAll) {
    createRoute(options.crudReadAll, {
      method: "GET",
      path: basePath,
      config: {
        validate: {
          params: validateCommonParams,
          query: get(options, "config.validate.query")
        }
      }
    });
  }

  if (options.crudCreate) {
    createRoute(options.crudCreate, {
      method: "POST",
      path: basePath,
      config: {
        validate: {
          params: validateCommonParams,
          payload: validatePayload
        }
      }
    });
  }

  if (options.crudRead) {
    createRoute(options.crudRead, {
      method: "GET",
      path: options.path,
      config: {
        validate: {
          params: validateAllParams
        }
      }
    });
  }

  if (options.crudUpdate) {
    createRoute(options.crudUpdate, {
      method: "PUT",
      path: options.path,
      config: {
        validate: {
          params: validateAllParams,
          payload: validatePayload
        }
      }
    });
  }

  if (options.crudDelete) {
    createRoute(options.crudUpdate, {
      method: "DELETE",
      path: options.path,
      config: {
        validate: {
          params: validateAllParams
        }
      }
    });
  }
};
