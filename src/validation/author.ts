import {
  object,
  optional,
  string,
  size,
  partial,
  number,
  refine,
} from "superstruct";
import { isInt } from "validator";

export const AuthorsGetParams = object({
  firstname: optional(size(string(), 1, 50)),
  lastname: optional(size(string(), 1, 50)),
  page: optional(refine(string(), "int", (value) => isInt(value))),
  take: optional(refine(string(), "int", (value) => isInt(value))),
});

export const AuthorCreationData = object({
  firstname: size(string(), 1, 50),
  lastname: size(string(), 1, 50),
});

export const AuthorUpdateData = partial(AuthorCreationData);

// export const AuthorUpdateData = object({
//   firstname: optional(size(string(), 1, 50)),
//   lastname: optional(size(string(), 1, 50)),
// });
