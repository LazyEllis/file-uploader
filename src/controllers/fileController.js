import prisma from "../lib/prisma.js";
import { ForbiddenError, NotFoundError } from "../lib/errors.js";

const getFileById = async (id, userId, options = {}) => {
  const file = await prisma.file.findUnique({
    where: { id: Number(id) },
    ...options,
  });

  if (!file) {
    throw new NotFoundError("File not found");
  }

  if (file.userId !== userId) {
    throw new ForbiddenError("You do not have permission to access this file");
  }

  return file;
};

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

  const file = await prisma.file.create({
    data: {
      name: originalname,
      size,
      url: path,
      folderId,
      userId: id,
    },
  });

  res.redirect(`/files/${file.id}`);
};

export const renderFileRenameForm = async (req, res) => {
  const { id } = req.user;

  const file = await getFileById(req.params.id, id);

  const folders = await prisma.folder.findMany({
    where: { userId: id },
  });

  res.render("file-rename-form", { folders, data: file });
};

export const renameFile = async (req, res) => {
  const { id } = req.params;
  const { name, folderId } = req.body;

  await getFileById(id, req.user.id);

  await prisma.file.update({
    data: {
      name,
      folderId,
    },
    where: {
      id: Number(id),
    },
  });

  res.redirect(`/files/${id}`);
};

export const getFileDetails = async (req, res) => {
  const file = await getFileById(req.params.id, req.user.id, {
    include: {
      folder: true,
    },
  });

  res.render("file", { file });
};

export const downloadFile = async (req, res) => {
  const file = await getFileById(req.params.id, req.user.id);
  res.download(file.url, file.name);
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;

  await getFileById(id, req.user.id);

  const { folderId } = await prisma.file.delete({ where: { id } });

  const redirectPath = folderId ? `/folders/${folderId}` : "/";

  res.redirect(redirectPath);
};
