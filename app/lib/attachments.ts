import type { Attachment } from "~/lib/board.server";

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
]);

function getFileExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  if (dot < 0) return "";
  return fileName.slice(dot + 1).toLowerCase();
}

export function isImageAttachment(file: Attachment) {
  if (file.mime_type?.startsWith("image/")) return true;

  const fileNameExt = getFileExtension(file.file_name);
  const storedExt = getFileExtension(file.r2_key.split("/").pop() ?? "");

  return IMAGE_EXTENSIONS.has(fileNameExt) || IMAGE_EXTENSIONS.has(storedExt);
}

export function partitionAttachments(attachments: Attachment[]) {
  const imageAttachments: Attachment[] = [];
  const fileAttachments: Attachment[] = [];

  for (const file of attachments) {
    if (isImageAttachment(file)) {
      imageAttachments.push(file);
    } else {
      fileAttachments.push(file);
    }
  }

  return { imageAttachments, fileAttachments };
}
