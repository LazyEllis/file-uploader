import prisma from "../lib/prisma.js";
import { getNonSubfolders } from "../generated/prisma/sql/index.js";
import { ForbiddenError, NotFoundError } from "../lib/errors.js";

const getFolderById = async (id, userId, options = {}) => {
  const folder = await prisma.folder.findUnique({
    where: { id: Number(id) },
    ...options,
  });

  if (!folder) {
    throw new NotFoundError("Folder not found");
  }

  if (folder.userId !== userId) {
    throw new ForbiddenError(
      "You do not have permission to access this folder",
    );
  }

  return folder;
};

export const renderFolderPage = async (req, res) => {
  const folder = await getFolderById(req.params.id, req.user.id, {
    include: {
      subfolders: true,
      files: true,
      parent: true,
    },
  });

  res.render("index", { folder });
};

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

export const renderFolderRenameForm = async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  const folder = await getFolderById(id, userId);

  const folders = await prisma.$queryRawTyped(
    getNonSubfolders(Number(id), userId),
  );

  res.render("folder-form", {
    folders,
    data: folder,
  });
};

export const renameFolder = async (req, res) => {
  const { id } = req.params;
  const { name, parentId } = req.body;

  await getFolderById(id, req.user.id);

  await prisma.folder.update({
    data: { name, parentId },
    where: { id: Number(id) },
  });

  const redirectPath = parentId ? `/folders/${parentId}` : "/";

  res.redirect(redirectPath);
};

export const deleteFolder = async (req, res) => {
  const { id } = req.params;

  await getFolderById(id, req.user.id);

  const { parentId } = await prisma.folder.delete({
    where: { id: Number(id) },
  });

  const redirectPath = parentId ? `/folders/${parentId}` : "/";

  res.redirect(redirectPath);
};
