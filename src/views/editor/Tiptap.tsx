'use client'

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import * as R from 'ramda'

interface Props {
  defaultValue: string
  onChange: (content: string) => void
}
const Tiptap = ({ onChange, defaultValue }: Props) => {
  const [content, setContent] = useState(
    !R.isEmpty(defaultValue) ? defaultValue : '<p>รายละเอียดทริป เช่น ไปไหนบ้าง พักที่ไหน มีกิจกรรมอะไร ฯลฯ</p>'
  )

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      const data = JSON.stringify(editor.getJSON())
      const dataHTML = editor.getHTML()
      setContent(data)
      onChange(dataHTML) // Trigger event with updated content
    }
  })

  return (
    <>
      <EditorContent editor={editor} />
    </>
  )
}

export default Tiptap
