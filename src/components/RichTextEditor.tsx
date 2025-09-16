import React, { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, Link, Image, List, ListOrdered, Quote, Code, Undo, Redo, Type, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'הכנס את תוכן העמוד כאן...',
  height = '400px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [selectedText, setSelectedText] = useState('')

  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value
      setIsInitialized(true)
    }
  }, [value, isInitialized])

  // Separate effect for handling external content changes
  useEffect(() => {
    if (isInitialized && editorRef.current && editorRef.current.innerHTML !== value && value !== '') {
      // Only update if the content is significantly different
      const currentContent = editorRef.current.innerHTML
      if (currentContent.length === 0 && value.length > 0) {
        editorRef.current.innerHTML = value
      }
    }
  }, [value, isInitialized])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    // Force update content after command
    setTimeout(updateContent, 100)
  }

  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      console.log('RichTextEditor updating content:', newContent)
      onChange(newContent)
    }
  }

  // Handle input events with debouncing
  const handleInput = () => {
    updateContent()
  }

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    setTimeout(updateContent, 100)
  }

  // Handle focus events
  const handleFocus = () => {
    if (editorRef.current) {
      console.log('Editor focused, current content:', editorRef.current.innerHTML)
    }
  }

  // Handle blur events  
  const handleBlur = () => {
    updateContent()
    if (editorRef.current) {
      console.log('Editor blurred, final content:', editorRef.current.innerHTML)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Update content on certain key events
    if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
      setTimeout(updateContent, 50)
    }

    // Keyboard shortcuts
    if (e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
        case 'k':
          e.preventDefault()
          openLinkModal()
          break
        case 'z':
          if (e.shiftKey) {
            e.preventDefault()
            execCommand('redo')
          } else {
            e.preventDefault()
            execCommand('undo')
          }
          break
      }
    }
  }

  const openLinkModal = () => {
    const selection = window.getSelection()
    const text = selection?.toString() || ''
    setSelectedText(text)
    setLinkText(text)
    setLinkUrl('')
    setShowLinkModal(true)
  }

  const insertLink = () => {
    if (linkUrl) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline; cursor: pointer;">${linkText || selectedText || linkUrl}</a>`
      
      if (selectedText) {
        // Replace selected text with link
        execCommand('insertHTML', linkHtml)
      } else {
        // Insert new link
        execCommand('insertHTML', linkHtml)
      }
      
      // Force content update immediately
      updateContent()
      
      setLinkUrl('')
      setLinkText('')
      setSelectedText('')
      setShowLinkModal(false)
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; display: block;" />`
      execCommand('insertHTML', imageHtml)
      setTimeout(updateContent, 200)
      setImageUrl('')
      setImageAlt('')
      setShowImageModal(false)
    }
  }

  const formatHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`)
  }

  const insertHr = () => {
    execCommand('insertHTML', '<hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;" />')
  }

  const clearFormatting = () => {
    execCommand('removeFormat')
  }

  const toolbarSections = [
    {
      title: 'עיצוב טקסט',
      buttons: [
        { icon: Bold, command: () => execCommand('bold'), title: 'מודגש (Ctrl+B)', shortcut: 'Ctrl+B' },
        { icon: Italic, command: () => execCommand('italic'), title: 'נטוי (Ctrl+I)', shortcut: 'Ctrl+I' },
        { icon: Underline, command: () => execCommand('underline'), title: 'קו תחתון (Ctrl+U)', shortcut: 'Ctrl+U' },
      ]
    },
    {
      title: 'יישור',
      buttons: [
        { icon: AlignRight, command: () => execCommand('justifyRight'), title: 'יישור לימין' },
        { icon: AlignCenter, command: () => execCommand('justifyCenter'), title: 'יישור למרכז' },
        { icon: AlignLeft, command: () => execCommand('justifyLeft'), title: 'יישור לשמאל' },
      ]
    },
    {
      title: 'רשימות',
      buttons: [
        { icon: List, command: () => execCommand('insertUnorderedList'), title: 'רשימה' },
        { icon: ListOrdered, command: () => execCommand('insertOrderedList'), title: 'רשימה ממוספרת' },
        { icon: Quote, command: () => execCommand('formatBlock', 'blockquote'), title: 'ציטוט' },
      ]
    },
    {
      title: 'מדיה וקישורים',
      buttons: [
        { icon: Link, command: openLinkModal, title: 'הוסף קישור (Ctrl+K)', shortcut: 'Ctrl+K' },
        { icon: Image, command: () => setShowImageModal(true), title: 'הוסף תמונה' },
      ]
    },
    {
      title: 'פעולות',
      buttons: [
        { icon: Undo, command: () => execCommand('undo'), title: 'בטל (Ctrl+Z)' },
        { icon: Redo, command: () => execCommand('redo'), title: 'חזור (Ctrl+Shift+Z)' },
        { icon: Code, command: clearFormatting, title: 'נקה עיצוב' },
      ]
    }
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Enhanced Toolbar */}
      <div className="bg-gray-50 p-3 border-b space-y-3">
        {/* Headings Row */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700 ml-2">כותרות:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <Button
                key={level}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatHeading(level)}
                className="px-3 py-1 text-sm h-8 hover:bg-blue-100"
              >
                H{level}
              </Button>
            ))}
          </div>
          
          <div className="border-r border-gray-300 h-6 mx-2" />
          
          <select
            onChange={(e) => {
              if (e.target.value) {
                execCommand('formatBlock', e.target.value)
                e.target.value = ''
              }
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            defaultValue=""
          >
            <option value="">סגנון טקסט</option>
            <option value="p">פסקה רגילה</option>
            <option value="h1">כותרת ראשית</option>
            <option value="h2">כותרת משנה</option>
            <option value="h3">כותרת קטנה</option>
            <option value="blockquote">ציטוט</option>
            <option value="pre">קוד</option>
          </select>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertHr}
            className="px-3 py-1 text-sm h-8"
            title="הוסף קו מפריד"
          >
            HR
          </Button>
        </div>

        {/* Main Toolbar */}
        <div className="flex flex-wrap gap-4">
          {toolbarSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="flex items-center gap-1">
              {section.buttons.map((btn, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={btn.command}
                  title={btn.title}
                  className="p-2 h-8 w-8 hover:bg-blue-100 group"
                >
                  <btn.icon className="w-4 h-4 group-hover:text-blue-600" />
                </Button>
              ))}
              {sectionIndex < toolbarSections.length - 1 && (
                <div className="border-r border-gray-300 h-6 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded">
          💡 <strong>קיצורי מקלדת:</strong> Ctrl+B (מודגש) | Ctrl+I (נטוי) | Ctrl+K (קישור) | Ctrl+Z (בטל)
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        className="focus:outline-none prose prose-sm max-w-none p-4"
        style={{ 
          direction: 'rtl', 
          minHeight: height,
          lineHeight: '1.6'
        }}
        data-placeholder={placeholder}
      />

      {/* Enhanced Link Modal */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title="הוסף קישור"
        size="md"
      >
        <div className="space-y-4">
          {selectedText && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-sm text-blue-700">טקסט נבחר: "</span>
              <strong className="text-blue-900">{selectedText}</strong>
              <span className="text-sm text-blue-700">"</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              טקסט הקישור
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder={selectedText || "טקסט הקישור"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת URL
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">דוגמאות נפוצות:</h4>
            <div className="space-y-1 text-sm">
              <button
                type="button"
                onClick={() => setLinkUrl('https://wa.me/972522126366')}
                className="block text-blue-600 hover:text-blue-700"
              >
                https://wa.me/972522126366 (WhatsApp)
              </button>
              <button
                type="button"
                onClick={() => setLinkUrl('mailto:eranfixer@gmail.com')}
                className="block text-blue-600 hover:text-blue-700"
              >
                mailto:eranfixer@gmail.com (Email)
              </button>
              <button
                type="button"
                onClick={() => setLinkUrl('tel:052-212-6366')}
                className="block text-blue-600 hover:text-blue-700"
              >
                tel:052-212-6366 (טלפון)
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => setShowLinkModal(false)}
            >
              ביטול
            </Button>
            <Button 
              onClick={insertLink}
              disabled={!linkUrl}
            >
              <Link className="w-4 h-4 ml-2" />
              הוסף קישור
            </Button>
          </div>
        </div>
      </Modal>

      {/* Enhanced Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="הוסף תמונה"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת התמונה
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תיאור התמונה (Alt Text)
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="תיאור התמונה לנגישות"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">תמונות Unsplash מומלצות:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button
                type="button"
                onClick={() => setImageUrl('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')}
                className="text-blue-600 hover:text-blue-700 text-right"
              >
                עסקים וטכנולוגיה
              </button>
              <button
                type="button"
                onClick={() => setImageUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')}
                className="text-blue-600 hover:text-blue-700 text-right"
              >
                פיתוח ואתרים
              </button>
              <button
                type="button"
                onClick={() => setImageUrl('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')}
                className="text-blue-600 hover:text-blue-700 text-right"
              >
                עבודה צוותית
              </button>
              <button
                type="button"
                onClick={() => setImageUrl('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')}
                className="text-blue-600 hover:text-blue-700 text-right"
              >
                פגישות ויעוץ
              </button>
            </div>
          </div>

          {imageUrl && (
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">תצוגה מקדימה:</h4>
              <img
                src={imageUrl}
                alt={imageAlt}
                className="max-w-full h-32 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => setShowImageModal(false)}
            >
              ביטול
            </Button>
            <Button 
              onClick={insertImage}
              disabled={!imageUrl}
            >
              <Image className="w-4 h-4 ml-2" />
              הוסף תמונה
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }
        
        .prose { 
          max-width: none !important; 
          color: #374151;
          line-height: 1.6;
        }
        .dark .prose {
          color: #e5e7eb !important;
        }
        .prose h1 { 
          font-size: 2.25em; 
          font-weight: bold; 
          margin: 0.8em 0 0.4em; 
          color: #1f2937;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 0.2em;
        }
        .dark .prose h1 {
          color: #ffffff !important;
        }
        .prose h2 { 
          font-size: 1.875em; 
          font-weight: bold; 
          margin: 0.7em 0 0.3em; 
          color: #1f2937;
        }
        .dark .prose h2 {
          color: #f3f4f6 !important;
        }
        .prose h3 { 
          font-size: 1.5em; 
          font-weight: bold; 
          margin: 0.6em 0 0.3em; 
          color: #374151;
        }
        .dark .prose h3 {
          color: #e5e7eb !important;
        }
        .prose h4 { 
          font-size: 1.25em; 
          font-weight: bold; 
          margin: 0.5em 0 0.25em; 
          color: #374151;
        }
        .dark .prose h4 {
          color: #e5e7eb !important;
        }
        .prose p { 
          margin: 0.75em 0; 
          line-height: 1.7;
          color: #4b5563;
        }
        .dark .prose p {
          color: #d1d5db !important;
        }
        .prose b,
        .prose strong {
          color: #1f2937 !important;
          font-weight: 700 !important;
        }
        .dark .prose b,
        .dark .prose strong {
          color: #60a5fa !important;
          font-weight: 700 !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        .prose ul, .prose ol { 
          margin: 0.75em 0; 
          padding-right: 1.5em;
          color: #4b5563;
        }
        .dark .prose ul,
        .dark .prose ol {
          color: #d1d5db !important;
        }
        .prose li { 
          margin: 0.25em 0; 
          line-height: 1.6;
        }
        .dark .prose li {
          color: #d1d5db !important;
        }
        .prose blockquote { 
          border-right: 4px solid #3b82f6; 
          padding: 1em 1.5em; 
          margin: 1em 0; 
          font-style: italic; 
          color: #6b7280;
          background: #f8fafc;
          border-radius: 0 8px 8px 0;
        }
        .dark .prose blockquote {
          color: #d1d5db !important;
          background: #374151 !important;
        }
        .prose pre { 
          background: #f3f4f6; 
          padding: 1em; 
          border-radius: 8px; 
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          border: 1px solid #e5e7eb;
          margin: 1em 0;
        }
        .dark .prose pre {
          background: #1f2937 !important;
          color: #e5e7eb !important;
          border-color: #4b5563 !important;
        }
        .prose code {
          background: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #dc2626;
        }
        .dark .prose code {
          background: #374151 !important;
          color: #fbbf24 !important;
        }
        .prose a { 
          color: #3b82f6; 
          text-decoration: underline;
          transition: color 0.2s;
          cursor: pointer;
          pointer-events: all;
        }
        .prose a:hover { 
          color: #1d4ed8;
          text-decoration: underline;
        }
        .dark .prose a {
          color: #60a5fa !important;
          cursor: pointer;
        }
        .dark .prose a:hover {
          color: #93c5fd !important;
        }
        .prose img {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 1em 0;
        }
        .prose hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2em 0;
        }
        .dark .prose hr {
          border-top-color: #4b5563 !important;
        }
        
        /* Focus styles */
        [contenteditable]:focus {
          outline: none;
          box-shadow: inset 0 0 0 2px #3b82f6;
        }
        
        /* Selection styles */
        [contenteditable] ::selection {
          background: #bfdbfe;
          color: #1e40af;
        }
      `}</style>
    </div>
  )
}