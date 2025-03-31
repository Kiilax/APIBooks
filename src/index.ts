import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "./error";
import * as author from "./requestHandlers/author";
import * as book from "./requestHandlers/book";
import * as tag from "./requestHandlers/tag";
import {
  StructError,
  object,
  optional,
  refine,
  string,
  assert,
} from "superstruct";
import { isInt } from "validator";
import cors from "cors";

const app = express();
const port = 3000;

export const ReqParams = object({
  author_id: optional(refine(string(), "int", (value) => isInt(value))),
  book_id: optional(refine(string(), "int", (value) => isInt(value))),
  tag_id: optional(refine(string(), "int", (value) => isInt(value))),
});

const validateParams = (req: Request, res: Response, next: NextFunction) =>
{
  assert(req.params, ReqParams);
  next();
};

app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) =>
{
  res.header("Access-Control-Expose-Headers", "X-Total-Count");
  next();
});

app.use(express.json());

app.get("/", (req: Request, res: Response) =>
{
  throw Error;
});

app
  .route("/authors/:author_id")
  .all(validateParams)
  .get(author.get_one)
  .patch(author.update_one)
  .delete(author.delete_one);

app.route("/authors").get(author.get_all).post(author.create_one);

app
  .route("/books/:book_id")
  .all(validateParams)
  .get(book.get_one)
  .patch(book.update_one)
  .delete(book.delete_one);

app.get("/books", book.get_all);

app
  .route("/authors/:author_id/books")
  .all(validateParams)
  .get(book.get_all_of_author)
  .post(book.create_one_of_author);

app.route("/tags").get(tag.get_all).post(tag.create_one);

app
  .route("/tags/:tag_id")
  .all(validateParams)
  .get(tag.get_one)
  .patch(tag.update_one)
  .delete(tag.delete_one);

app.route("/books/:book_id/tags").all(validateParams).get(tag.get_all_of_book);

app
  .route("/books/:book_id/tags/:tag_id")
  .all(validateParams)
  .patch(tag.connect_to_book)
  .delete(tag.disconnect_from_book);

app.use((err: HttpError, req: Request, res: Response) =>
{
  if (err instanceof StructError)
  {
    err.status = 400;
    err.message = `Bad value for field ${err.key}`;
  }
  res.status(err.status || 500).send(err.message);
});

app.listen(port, () =>
{
  console.log(`App listening on port ${port}`);
});
