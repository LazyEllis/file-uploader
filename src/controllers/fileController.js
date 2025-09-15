import prisma from "../lib/prisma.js";

export const renderFileUploadForm = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });

  res.render("file-upload-form", { folders });
};

export const uploadFile = async (req, res) => {
  const { folderId } = req.body;
  const { originalname, size, path } = req.file;
  const { id } = req.user;

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
