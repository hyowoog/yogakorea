import { Form, Link } from "react-router";
import { RichTextEditor } from "~/components/rich-text-editor";
import { isJobBoard, JOB_CATEGORIES } from "~/lib/job-board";
import { getBoardBasePath } from "~/lib/route-paths";
import { Separator } from "../ui/separator";

interface BoardWriteFormProps {
  boardId: string;
  boardTitle: string;
  isAdmin?: boolean;
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
        <h1>글쓰기</h1>
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

        <label>
          내용
          <RichTextEditor
            name="content"
            defaultValue={defaultValues?.content}
            placeholder="내용을 입력하세요"
          />
        </label>

        <label>
          첨부파일
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
