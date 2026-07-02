import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
  PresentationIcon,
  type LucideIcon,
} from "lucide-react";

function getFileExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  if (dot < 0) return "";
  return fileName.slice(dot + 1).toLowerCase();
}

const EXTENSION_ICON_MAP: Record<string, LucideIcon> = {
  jpg: FileImageIcon,
  jpeg: FileImageIcon,
  png: FileImageIcon,
  gif: FileImageIcon,
  webp: FileImageIcon,
  bmp: FileImageIcon,
  svg: FileImageIcon,
  ico: FileImageIcon,
  pdf: FileTextIcon,
  hwp: FileTextIcon,
  hwpx: FileTextIcon,
  doc: FileTextIcon,
  docx: FileTextIcon,
  txt: FileTextIcon,
  md: FileTextIcon,
  rtf: FileTextIcon,
  odt: FileTextIcon,
  xls: FileSpreadsheetIcon,
  xlsx: FileSpreadsheetIcon,
  csv: FileSpreadsheetIcon,
  ppt: PresentationIcon,
  pptx: PresentationIcon,
  zip: FileArchiveIcon,
  rar: FileArchiveIcon,
  "7z": FileArchiveIcon,
  tar: FileArchiveIcon,
  gz: FileArchiveIcon,
  mp4: FileVideoIcon,
  avi: FileVideoIcon,
  mov: FileVideoIcon,
  mkv: FileVideoIcon,
  webm: FileVideoIcon,
  wmv: FileVideoIcon,
  mp3: FileAudioIcon,
  wav: FileAudioIcon,
  ogg: FileAudioIcon,
  flac: FileAudioIcon,
  m4a: FileAudioIcon,
  js: FileCodeIcon,
  ts: FileCodeIcon,
  tsx: FileCodeIcon,
  jsx: FileCodeIcon,
  html: FileCodeIcon,
  css: FileCodeIcon,
  json: FileCodeIcon,
  xml: FileCodeIcon,
};

interface AttachmentFileIconProps {
  fileName: string;
  className?: string;
}

export function AttachmentFileIcon({ fileName, className }: AttachmentFileIconProps) {
  const Icon = EXTENSION_ICON_MAP[getFileExtension(fileName)] ?? FileIcon;
  return <Icon className={className} aria-hidden />;
}
