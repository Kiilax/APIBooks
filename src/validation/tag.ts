import { object, optional, string, size, partial } from "superstruct";

export const TagCreationData = object({
  name: size(string(), 1, 50),
});

export const TagUpdateData = partial(TagCreationData);
