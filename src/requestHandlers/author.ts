import { prisma } from "../db";
import { HttpError } from "../error";
import { Request, Response } from "express";
import { assert, unknown } from "superstruct";
import {
  AuthorCreationData,
  AuthorsGetParams,
  AuthorUpdateData,
} from "../validation/author";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// REQUEST PARAMS
// REQUEST QUERY
{
  lastname: "husser";
  age: "16";
}

// REQUEST BODY

export async function get_all(req: Request, res: Response)
{
  assert(req.query, AuthorsGetParams);
  const { lastname, firstname } = req.query;
  const page: number = Number(req.query.page || "1") - 1;
  const take: number = Number(req.query.take || "5");

  const authors = await prisma.author.findMany({
    where: {
      lastname: {
        contains: lastname?.toString(),
      },
      firstname: {
        contains: firstname?.toString(),
      },
    },
    orderBy: {
      lastname: "asc",
    },
    take,
    skip: take * page,
  });
  res.json(authors);
}

export async function get_one(req: Request, res: Response)
{
  const author = await prisma.author.findUnique({
    where: {
      id: parseInt(req.params.author_id),
    },
  });
  if (author == null)
  {
    throw new HttpError("Author not found", 404);
  }
  else
  {
    res.status(200).json(author);
  }
}

export async function create_one(req: Request, res: Response)
{
  assert(req.body, AuthorCreationData);
  const author = await prisma.author.create({
    data: req.body,
  });
  res.status(201).json(author);
}

export async function update_one(req: Request, res: Response)
{
  assert(req.body, AuthorUpdateData);
  try
  {
    const author = await prisma.author.update({
      where: {
        id: parseInt(req.params.author_id),
      },
      data: req.body,
    });
    res.json(author);
  }
  catch (e: unknown)
  {
    // console.log(e);
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025")
    {
      throw new HttpError("Author not found", 404);
    }
    throw e;
  }
}

export async function delete_one(req: Request, res: Response)
{
  try
  {
    await prisma.author.delete({
      where: {
        id: parseInt(req.params.author_id),
      },
    });
    res.status(204).end();
  }
  catch (e: unknown)
  {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025")
    {
      throw new HttpError("Author not found", 404);
    }
    throw e;
  }
}
