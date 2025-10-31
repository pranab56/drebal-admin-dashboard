"use client";

import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo
} from 'lucide-react';

interface TiptapToolbarProps {
  editor: Editor | null;
}

export const TiptapToolbar = ({ editor }: TiptapToolbarProps) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="bg-green-600 px-4 py-2 flex items-center gap-1 text-white text-sm flex-wrap">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 p-0 hover:bg-green-700 ${editor.isActive('bold') ? 'bg-green-700' : ''
          }`}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 p-0 hover:bg-green-700 ${editor.isActive('italic') ? 'bg-green-700' : ''
          }`}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`h-8 w-8 p-0 hover:bg-green-700 ${editor.isActive('underline') ? 'bg-green-700' : ''
          }`}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`h-8 w-8 p-0 hover:bg-green-700 ${editor.isActive('strike') ? 'bg-green-700' : ''
          }`}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <div className="w-px h-4 bg-white opacity-50 mx-1"></div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 p-0 hover:bg-green-700 ${editor.isActive('bulletList') ? 'bg-green-700' : ''
          }`}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 p-0 hover:bg-green-700 ${editor.isActive('orderedList') ? 'bg-green-700' : ''
          }`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`h-8 w-8 p-0 hover:bg-green-700 ${editor.isActive('blockquote') ? 'bg-green-700' : ''
          }`}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-4 bg-white opacity-50 mx-1"></div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={setLink}
        className="h-8 w-8 p-0 hover:bg-green-700"
      >
        <Link className="h-4 w-4" />
      </Button>

      <div className="w-px h-4 bg-white opacity-50 mx-1"></div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        className="h-8 w-8 p-0 hover:bg-green-700"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        className="h-8 w-8 p-0 hover:bg-green-700"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};