import { Form, Link } from "react-router";
import { AttachmentFileIcon } from "~/components/board/attachment-file-icon";
import { RichTextEditor } from "~/components/rich-text-editor";
import type { Attachment } from "~/lib/board.server";
import { getPublicUploadUrl } from "~/lib/files";
import { isJobBoard, JOB_CATEGORIES } from "~/lib/job-board";
import { getBoardBasePath } from "~/lib/route-paths";
import { Separator } from "../ui/separator";

interface BoardWriteFormProps {
  boardId: string;
  boardTitle: string;
  isAdmin?: boolean;
  /** 수정 화면에서 보여 줄 기존 첨부파일 (교체·삭제 가능) */
  existingAttachments?: Attachment[];
  heading?: string;
  defaultValues?: {
    title?: string;
    content?: string;
    authorName?: string;
    isNotice?: boolean;
    jobCategory?: string;
  };
  submitLabel?: string;
  action?: string;
}

export function BoardWriteForm({
  boardId,
  boardTitle,
  isAdmin = false,
  existingAttachments = [],
  heading = "글쓰기",
  defaultValues,
  submitLabel = "등록",
  action,
}: BoardWriteFormProps) {
  const showJobCategory = isJobBoard(boardId);

  return (
    <div className="yk-board-write">
      <div className="yk-board-write-header">
        <p className="yk-breadcrumb">
          <Link to={getBoardBasePath(boardId)}>{boardTitle}</Link>
        </p>
        <h1>{heading}</h1>
      </div>
      <Separator className="my-4" />
      <Form method="post" encType="multipart/form-data" action={action} className="yk-form">
        {isAdmin ? (
          <label className="yk-form-check">
            <input
              type="checkbox"
              name="isNotice"
              value="1"
              defaultChecked={defaultValues?.isNotice}
            />
            공지글로 등록
          </label>
        ) : null}
        <label>
          제목
          <div className={showJobCategory ? "yk-form-title-row" : undefined}>
            {showJobCategory ? (
              <select
                name="jobCategory"
                required
                defaultValue={defaultValues?.jobCategory ?? ""}
                aria-label="구인/구직 구분"
              >
                <option value="" disabled>
                  구분
                </option>
                {JOB_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            ) : null}
            <input
              name="title"
              required
              defaultValue={defaultValues?.title}
              placeholder="제목을 입력하세요"
            />
          </div>
        </label>

        <label>
          작성자
          <input
            name="authorName"
            required
            defaultValue={defaultValues?.authorName}
            placeholder="이름"
          />
        </label>

        {/* label로 감싸면 본문 클릭이 툴바 첫 버튼(소스/편집) 클릭으로 전달됨 */}
        <div className="yk-form-field" role="group" aria-label="내용">
          내용
          <RichTextEditor
            name="content"
            defaultValue={defaultValues?.content}
            placeholder="내용을 입력하세요"
          />
        </div>

        {existingAttachments.length > 0 ? (
          <div className="yk-form-field" role="group" aria-label="기존 첨부파일">
            기존 첨부파일
            <ul className="grid gap-2 rounded-xl border p-3 font-normal">
              {existingAttachments.map((file) => (
                <li
                  key={file.id}
                  className="grid gap-2 border-b pb-2 last:border-b-0 last:pb-0 md:grid-cols-[1fr_auto_auto] md:items-center"
                >
                  <a
                    href={getPublicUploadUrl(file.r2_key)}
                    download={file.file_name}
                    className="inline-flex min-w-0 items-center gap-2 text-sm hover:underline"
                  >
                    <AttachmentFileIcon
                      fileName={file.file_name}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="truncate">
                      {file.file_name}
                      {file.file_size ? ` (${Math.round(file.file_size / 1024)}KB)` : ""}
                    </span>
                  </a>
                  <input
                    type="file"
                    name={`replaceAttachment_${file.id}`}
                    aria-label={`${file.file_name} 교체할 파일`}
                    title="교체할 파일 선택"
                    className="yk-attachment-replace text-sm"
                  />
                  <label className="yk-form-check text-sm">
                    <input type="checkbox" name="deleteAttachmentIds" value={file.id} />
                    삭제
                  </label>
                </li>
              ))}
            </ul>
            <p className="text-xs font-normal text-muted-foreground">
              파일을 선택하면 해당 첨부가 새 파일로 교체되고, 삭제에 체크하면 저장 시 삭제됩니다.
            </p>
          </div>
        ) : null}

        <label>
          {existingAttachments.length > 0 ? "첨부파일 추가" : "첨부파일"}
          <input type="file" name="attachments" multiple />
        </label>

        <div className="yk-form-actions">
          <Link to={getBoardBasePath(boardId)} className="yk-btn">
            취소
          </Link>
          <button type="submit" className="yk-btn yk-btn-primary">
            {submitLabel}
          </button>
        </div>
      </Form>
    </div>
  );
}
