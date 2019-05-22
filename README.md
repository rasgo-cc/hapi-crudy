# hapi-crudy

Heavily inspired on [hapi-crud-promise](https://github.com/gangstead/hapi-crud-promise), `hapi-crudy` adds support for hapi 17+ and individually configurable routes.

Each CRUD route can be configured either through a function (the handler) or an object which contains the handler and other hapi configurations.

## Example

```javascript
const crudy = require('hapi-crudy')

crudy(server, {
    path: `${ENDPOINT_NAME}/{permalink}`,
    config: {
      tags: ENDPOINT_TAGS,
      validate: {
        params: {
          permalink: validate.id().required()
        },
        payload: {
          thing: validate.object().required()
        }
      }
    },
    crudReadAll: (_request, h) => {
      return h.response("READ ALL");
    },
    crudRead: (request, h) => {
      return h.response(`READ ${request.params.permalink}`);
    },
    crudCreate: {
      validate: {
        query: { anotherParam: validate.string() }
      },
      handler: (_request, h) => {
        return h.response(`CREATE ${request.query.anotherParam}`);
      }
    },
    crudUpdate: (request, h) => {
      return h.response(`UPDATE ${request.params.permalink}`);
    },
    crudDelete: (request, h) => {
      return h.response(`DELETE ${request.params.permalink}`);
    }
  });
};
```
