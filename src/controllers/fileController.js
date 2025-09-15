import prisma from "../lib/prisma.js";

export const renderFileUploadForm = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });

  res.render("file-upload-form", { folders });
};
