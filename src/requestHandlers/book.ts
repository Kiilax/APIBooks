import { assert } from "superstruct";
import { prisma } from "../db";
import { HttpError } from "../error";

import { Request, Response } from "express";
import {
  BookCreationData,
  BookGetParams,
  BookUpdateData,
} from "../validation/book";
import { Prisma } from "@prisma/client";

export async function get_all(req: Request, res: Response)
{
  assert(req.query, BookGetParams);
  const { title } = req.query;
  const books = await prisma.book.findMany({
    where: {
      title: {
        contains: title?.toString(),
      },
    },
  });
  res.json(books);
}

export async function get_all_of_author(req: Request, res: Response)
{
  assert(req.query, BookGetParams);
  const title: string = req.query.title || "";
  const authorIncludes: Prisma.AuthorInclude = {
    books: {
      where: {
        title: {
          contains: title.toString(),
        },
      },
      select: {
        title: true,
        publication_year: true,
      },
    },
  };
  const author = await prisma.author.findUnique({
    where: {
      id: parseInt(req.params.author_id),
    },
    include: authorIncludes,
  });
  if (author == null)
  {
    throw new HttpError("Author not found", 404);
  }
  else
  {
    res.status(200).json(author.books);
  }
}

export async function get_one(req: Request, res: Response)
{
  const book = await prisma.book.findUnique({
    where: {
      id: parseInt(req.params.book_id),
    },
  });
  res.json(book);
}

export async function create_one_of_author(req: Request, res: Response)
{
  assert(req.body, BookCreationData);
  const book = await prisma.book.create({
    data: {
      ...req.body,
      author: {
        connect: {
          id: parseInt(req.params.author_id),
        },
      },
    },
  });
  res.status(201).json(book);
}

export async function update_one(req: Request, res: Response)
{
  assert(req.body, BookUpdateData);
  const { title: bookTitle } = req.body;
  await prisma.book.update({
    where: {
      id: parseInt(req.params.book_id),
    },
    data: {
      title: bookTitle,
    },
  });
  res.end();
}

export async function delete_one(req: Request, res: Response)
{
  await prisma.book.delete({
    where: {
      id: parseInt(req.params.book_id),
    },
  });
  res.status(204).end();
}
