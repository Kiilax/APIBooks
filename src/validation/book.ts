import { title } from "process";
import { object, optional, string, size, partial, number } from "superstruct";

export const BookGetParams = object({
  title: optional(size(string(), 1, 50)),
});

export const BookCreationData = object({
  title: size(string(), 1, 50),
});

export const BookUpdateData = partial(BookCreationData);
