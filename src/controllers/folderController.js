import prisma from "../lib/prisma.js";
import { ForbiddenError, NotFoundError } from "../lib/errors.js";

export const renderCreateFolderForm = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });

  res.render("folder-form", { folders });
};

export const createFolder = async (req, res) => {
  const { name, parentId } = req.body;
  const { id } = req.user;

  const redirectPath = parentId ? `/folders/${parentId}` : "/";

  await prisma.folder.create({
    data: { name, parentId, userId: id },
  });

  res.redirect(redirectPath);
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

export const updateFolder = async (req, res) => {
  const { id } = req.params;
  const { name, parentId } = req.body;

  const redirectPath = parentId ? `/folders/${parentId}` : "/";

  await prisma.folder.update({
    data: { name, parentId },
    where: { id: Number(id) },
  });

  res.redirect(redirectPath);
};
