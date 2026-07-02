import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

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
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState(defaultValue);

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
      const nextHtml = currentEditor.getHTML();
      setHtml(nextHtml);
      setSourceHtml(nextHtml);
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

  function toggleSourceMode() {
    if (!editor) return;

    if (isSourceMode) {
      editor.commands.setContent(sourceHtml, { emitUpdate: false });
      setHtml(sourceHtml);
      setIsSourceMode(false);
      return;
    }

    const currentHtml = editor.getHTML();
    setSourceHtml(currentHtml);
    setHtml(currentHtml);
    setIsSourceMode(true);
  }

  function handleSourceChange(value: string) {
    setSourceHtml(value);
    setHtml(value);
  }

  if (!editor) return null;

  return (
    <div className="yk-rich-editor">
      <div className="yk-editor-toolbar">
        <button
          type="button"
          className={cn(isSourceMode && "active")}
          onClick={toggleSourceMode}
        >
          {isSourceMode ? "편집" : "소스"}
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          굵게
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          기울임
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          제목
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          목록
        </button>
        <button
          type="button"
          disabled={isSourceMode}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          번호
        </button>
        <button type="button" disabled={isSourceMode} onClick={uploadImage}>
          이미지
        </button>
      </div>
      {isSourceMode ? (
        <textarea
          className="yk-editor-source"
          value={sourceHtml}
          onChange={(event) => handleSourceChange(event.target.value)}
          spellCheck={false}
          aria-label="HTML 소스 편집"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}
