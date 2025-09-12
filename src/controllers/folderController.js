import prisma from "../lib/prisma.js";
import { ForbiddenError, NotFoundError } from "../lib/errors.js";

export const renderCreateFolderForm = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });

  res.render("folder-form", { folders });
};

export const renderUpdateFolderForm = async (req, res) => {
  const { id } = req.user;
  const { id: folderId } = req.params;

  const folder = await prisma.folder.findUnique({
    where: { id: Number(folderId) },
  });

  if (!folder) {
    throw new NotFoundError("Folder not found");
  }

  if (folder.userId !== id) {
    throw new ForbiddenError(
      "You do not have permission to update this folder",
    );
  }

  const folders = await prisma.folder.findMany({
    where: { userId: Number(id), id: { not: Number(folderId) } },
  });

  res.render("folder-form", {
    folders,
    data: folder,
  });
};
