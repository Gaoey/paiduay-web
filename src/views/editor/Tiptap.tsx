'use client'

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = ({ onContentChange }) => {
  const [content, setContent] = useState('<p>Hello World! 🌎️</p>')

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      const data = JSON.stringify(editor.getJSON())
      setContent(data)
      onContentChange(data) // Trigger event with updated content
    }
  })

  return (
    <>
      {/* <button
        onClick={() => editor?.chain().focus().toggleBold().run()} 
        disabled={
          !editor?.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor?.isActive('bold') ? 'is-active' : ''} 
        style={{ backgroundColor: '#ddd', border: 'none', margin: '0.2em', borderRadius: '10px' }}
      >
        <FormatBoldIcon />
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={editor?.isActive('italic') ? 'is-active' : ''}
        style={{ backgroundColor: '#ddd', border: 'none', margin: '0.2em', borderRadius: '10px' }}
      >
        <FormatItalicIcon />
      </button> */}
      <EditorContent editor={editor} />
    </>
  )
}

export default Tiptap
