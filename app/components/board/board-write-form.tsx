import { Form, Link } from "react-router";
import { RichTextEditor } from "~/components/rich-text-editor";
import { getBoardBasePath } from "~/lib/route-paths";
import { Separator } from "../ui/separator";

interface BoardWriteFormProps {
  boardId: string;
  boardTitle: string;
  defaultValues?: {
    title?: string;
    content?: string;
    authorName?: string;
  };
  submitLabel?: string;
  action?: string;
}

export function BoardWriteForm({
  boardId,
  boardTitle,
  defaultValues,
  submitLabel = "등록",
  action,
}: BoardWriteFormProps) {
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
        <label>
          제목
          <input
            name="title"
            required
            defaultValue={defaultValues?.title}
            placeholder="제목을 입력하세요"
          />
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
