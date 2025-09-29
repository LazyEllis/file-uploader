import crypto from "crypto";
import prisma from "../lib/prisma.js";
import formatFileSize from "../lib/formatFileSize.js";
import supabase from "../lib/supabase.js";
import { ForbiddenError, NotFoundError } from "../lib/errors.js";
import { format } from "date-fns";

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
  const { originalname, size, buffer } = req.file;

  const uniqueName = crypto.randomBytes(16).toString("hex");

  const { data, error } = await supabase.storage
    .from("files")
    .upload(uniqueName, buffer);

  if (error) {
    throw error;
  }

  const file = await prisma.file.create({
    data: {
      name: originalname,
      size,
      url: data.path,
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

  res.render("file", { file, format, formatFileSize });
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;

  const { url, folderId } = await getFileById(id, req.user.id);

  await prisma.$transaction(async (tx) => {
    await tx.file.delete({ where: { id: Number(id) } });

    const { error } = await supabase.storage.from("files").remove([url]);

    if (error) {
      throw error;
    }
  });

  const redirectPath = folderId ? `/folders/${folderId}` : "/";

  res.redirect(redirectPath);
};
