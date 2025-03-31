import { PrismaClient } from "@prisma/client";
import { connect } from "http2";

const prisma = new PrismaClient();

const authors = [
  {
    firstname: "J. R. R.",
    lastname: "Tolkien",
  },
  {
    firstname: "H. P.",
    lastname: "Lovecraft",
  },
];

const tags = [
  {
    name: "Horror",
  },
  {
    name: "Fantastic",
  },
];

async function main()
{
  for (const tag of tags)
  {
    await prisma.tag.create({
      data: {
        ...tag,
      },
    });
  }

  for (const author of authors)
  {
    await prisma.author.create({
      data: {
        ...author,
        books: {
          create: [
            {
              title: "Livre1 de " + author.lastname,
              publication_year: 2024,
              tags: {
                connect: {
                  name: "Horror",
                },
              },
            },
            {
              title: "Livre2 de " + author.lastname,
              publication_year: 2024,
              tags: {
                connect: {
                  name: "Fantastic",
                },
              },
            },
          ],
        },
      },
    });
  }
}

main()
  .then(async () =>
  {
    await prisma.$disconnect();
  })
  .catch(async (e) =>
  {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
