import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useState } from "react";

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "내용을 입력하세요...",
}: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      setHtml(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "yk-editor-content",
      },
    },
  });

  const uploadImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "editor");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) return;
      const data = (await response.json()) as { url: string };
      editor.chain().focus().setImage({ src: data.url }).run();
    };
    input.click();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="yk-rich-editor">
      <div className="yk-editor-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
          굵게
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
          기울임
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          제목
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          목록
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          번호
        </button>
        <button type="button" onClick={uploadImage}>
          이미지
        </button>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}
