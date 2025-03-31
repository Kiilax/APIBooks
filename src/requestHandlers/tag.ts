import { prisma } from "../db";
import { HttpError } from "../error";
import { Request, Response } from "express";
import { assert, unknown } from "superstruct";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TagCreationData, TagUpdateData } from "../validation/tag";

export async function get_all(req: Request, res: Response)
{
  const tags = await prisma.tag.findMany();
  res.json(tags);
}

export async function get_all_of_book(req: Request, res: Response)
{
  const book = await prisma.book.findUnique({
    where: {
      id: parseInt(req.params.book_id),
    },
    include: {
      tags: true,
    },
  });
  if (book == null)
  {
    throw new HttpError("Book not found", 404);
  }
  else
  {
    res.status(200).json(book.tags);
  }
}

export async function get_one(req: Request, res: Response)
{
  const tag = await prisma.tag.findUnique({
    where: {
      id: parseInt(req.params.tag_id),
    },
  });
  if (tag == null)
  {
    throw new HttpError("Tag not found", 404);
  }
  else
  {
    res.status(200).json(tag);
  }
}

export async function create_one(req: Request, res: Response)
{
  assert(req.body, TagCreationData);
  const tag = await prisma.tag.create({
    data: req.body,
  });
  res.status(201).json(tag);
}

export async function update_one(req: Request, res: Response)
{
  assert(req.body, TagUpdateData);
  try
  {
    const tag = await prisma.tag.update({
      where: {
        id: parseInt(req.params.tag_id),
      },
      data: req.body,
    });
    res.status(200).json(tag);
  }
  catch (e: unknown)
  {
    // console.log(e);
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025")
    {
      throw new HttpError("Tag not found", 404);
    }
    throw e;
  }
}

export async function connect_to_book(req: Request, res: Response)
{
  try
  {
    const book = await prisma.book.update({
      where: {
        id: parseInt(req.params.book_id),
      },
      data: {
        tags: {
          connect: {
            id: parseInt(req.params.tag_id),
          },
        },
      },
      include: {
        tags: true,
      },
    });
    res.status(200).json(book.tags);
  }
  catch (e: unknown)
  {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025")
    {
      throw new HttpError("Tag not found", 404);
    }
    throw e;
  }
}

export async function disconnect_from_book(req: Request, res: Response)
{
  try
  {
    const book = await prisma.book.update({
      where: {
        id: parseInt(req.params.book_id),
      },
      data: {
        tags: {
          disconnect: {
            id: parseInt(req.params.tag_id),
          },
        },
      },
      include: {
        tags: true,
      },
    });
    res.status(200).json(book.tags);
  }
  catch (e: unknown)
  {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025")
    {
      throw new HttpError("Tag not found", 404);
    }
    throw e;
  }
}

export async function delete_one(req: Request, res: Response)
{
  try
  {
    await prisma.tag.delete({
      where: {
        id: parseInt(req.params.tag_id),
      },
    });
    res.status(204).end();
  }
  catch (e: unknown)
  {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025")
    {
      throw new HttpError("Tag not found", 404);
    }
    throw e;
  }
}
