import prisma from "../lib/prisma.js";
import { ForbiddenError, NotFoundError } from "../lib/errors.js";

export const renderFileUploadForm = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });

  res.render("file-upload-form", { folders });
};

export const uploadFile = async (req, res) => {
  const { id } = req.user;
  const { folderId } = req.body;
  const { originalname, size, path } = req.file;

  await prisma.file.create({
    data: {
      name: originalname,
      size,
      url: path,
      folderId,
      userId: id,
    },
  });

  const redirectPath = folderId ? `/folders/${folderId}` : "/";

  res.redirect(redirectPath);
};

export const renderFileRenameForm = async (req, res) => {
  const { id } = req.user;
  const { id: fileId } = req.params;

  const file = await prisma.file.findUnique({ where: { id: Number(fileId) } });

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.userId !== id) {
    throw new ForbiddenError("You do not have permission to rename this file");
  }

  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });

  res.render("file-rename-form", { folders, data: file });
};

export const renameFile = async (req, res) => {
  const { id } = req.user;
  const { id: fileId } = req.params;
  const { name, folderId } = req.body;

  const file = await prisma.file.findUnique({ where: { id: Number(fileId) } });

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.userId !== id) {
    throw new ForbiddenError("You do not have permission to rename this file");
  }

  await prisma.file.update({
    data: {
      name,
      folderId,
    },
    where: {
      id: Number(fileId),
    },
  });

  const redirectPath = folderId ? `/folders/${folderId}` : "/";

  res.redirect(redirectPath);
};

export const getFileDetails = async (req, res) => {
  const file = await prisma.file.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.userId !== req.user.id) {
    throw new ForbiddenError("You do not have permission to rename this file");
  }

  res.render("file", { file });
};
