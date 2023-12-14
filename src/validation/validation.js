// const RessponseError = require('../error/response-error')
import { RessponseError } from "../error/response-error.js";

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false
});

  if (result.error) {
    throw new RessponseError(400, result.error.message);
  } else {
    return result.value;
  }
};

export {
  validate
}