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
  const [savedSelection, setSavedSelection] = useState<Range | null>(null)

  useEffect(() => {
    if (editorRef.current && !isInitialized && value) {
      console.log('Setting initial content:', value)
      editorRef.current.innerHTML = value
      setIsInitialized(true)
    }
  }, [value, isInitialized])

  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0))
    }
  }

  const restoreSelection = () => {
    if (savedSelection) {
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(savedSelection)
    }
  }

  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      console.log('Editor content updated:', newContent)
      onChange(newContent)
    }
  }

  const handleInput = () => {
    console.log('Input event triggered')
    updateContent()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    console.log('Pasting text:', text)
    document.execCommand('insertText', false, text)
    setTimeout(updateContent, 100)
  }

  const execCommand = (command: string, value?: string) => {
    console.log('Executing command:', command, value)
    document.execCommand(command, false, value)
    setTimeout(updateContent, 100)
  }

  const openLinkModal = () => {
    saveSelection()
    const selection = window.getSelection()
    const selectedText = selection?.toString() || ''
    console.log('Opening link modal with selected text:', selectedText)
    setLinkText(selectedText)
    setLinkUrl('')
    setShowLinkModal(true)
  }

  const insertLink = () => {
    if (!linkUrl.trim()) {
      console.log('No URL provided')
      return
    }

    console.log('Inserting link:', { url: linkUrl, text: linkText })
    
    // Restore selection first
    restoreSelection()
    
    const finalText = linkText.trim() || linkUrl
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline; cursor: pointer;">${finalText}</a>`
    
    console.log('Generated link HTML:', linkHtml)
    
    if (savedSelection && linkText.trim()) {
      // Replace selected text
      document.execCommand('insertHTML', false, linkHtml)
    } else {
      // Insert at cursor
      document.execCommand('insertHTML', false, linkHtml)
    }
    
    // Force update and log result
    setTimeout(() => {
      updateContent()
      if (editorRef.current) {
        console.log('Content after link insertion:', editorRef.current.innerHTML)
      }
    }, 200)
    
    setLinkUrl('')
    setLinkText('')
    setSavedSelection(null)
    setShowLinkModal(false)
  }

  const insertImage = () => {
    if (!imageUrl.trim()) return

    console.log('Inserting image:', imageUrl)
    const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; display: block;" />`
    document.execCommand('insertHTML', false, imageHtml)
    setTimeout(updateContent, 200)
    setImageUrl('')
    setImageAlt('')
    setShowImageModal(false)
  }

  const formatHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
    
    // Update content after key events
    if (['Enter', 'Backspace', 'Delete', 'Space'].includes(e.key)) {
      setTimeout(updateContent, 50)
    }
  }

  const toolbarSections = [
    {
      title: 'עיצוב טקסט',
      buttons: [
        { icon: Bold, command: () => execCommand('bold'), title: 'מודגש (Ctrl+B)' },
        { icon: Italic, command: () => execCommand('italic'), title: 'נטוי (Ctrl+I)' },
        { icon: Underline, command: () => execCommand('underline'), title: 'קו תחתון (Ctrl+U)' },
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
        { icon: Link, command: openLinkModal, title: 'הוסף קישור (Ctrl+K)' },
        { icon: Image, command: () => setShowImageModal(true), title: 'הוסף תמונה' },
      ]
    }
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
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

        {/* Help Text */}
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
        onKeyDown={handleKeyDown}
        onBlur={() => {
          console.log('Editor blurred, updating content')
          updateContent()
        }}
        suppressContentEditableWarning={true}
        className="focus:outline-none p-4 min-h-[400px] prose prose-sm max-w-none"
        style={{ 
          direction: 'rtl',
          minHeight: height,
          lineHeight: '1.7'
        }}
        data-placeholder={placeholder}
      />

      {/* Link Modal */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => {
          setShowLinkModal(false)
          setLinkUrl('')
          setLinkText('')
          setSavedSelection(null)
        }}
        title="🔗 הוסף קישור"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">איך להוסיף קישור:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. בחרו טקסט (אופציונלי) או פשוט הוסיפו קישור</li>
              <li>2. הכניסו את כתובת האתר</li>
              <li>3. לחצו "הוסף קישור"</li>
            </ol>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              טקסט הקישור
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="טקסט הקישור (אופציונלי)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת URL *
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
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">🔗 דוגמאות קישורים נפוצים:</h4>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setLinkUrl('https://wa.me/972522126366')}
                className="text-left text-blue-600 hover:text-blue-700 text-sm p-2 hover:bg-blue-50 rounded"
              >
                https://wa.me/972522126366 (WhatsApp)
              </button>
              <button
                type="button"
                onClick={() => setLinkUrl('mailto:eranfixer@gmail.com')}
                className="text-left text-blue-600 hover:text-blue-700 text-sm p-2 hover:bg-blue-50 rounded"
              >
                mailto:eranfixer@gmail.com (Email)
              </button>
              <button
                type="button"
                onClick={() => setLinkUrl('tel:052-212-6366')}
                className="text-left text-blue-600 hover:text-blue-700 text-sm p-2 hover:bg-blue-50 rounded"
              >
                tel:052-212-6366 (טלפון)
              </button>
              <button
                type="button"
                onClick={() => setLinkUrl('https://eranfixer.co.il')}
                className="text-left text-blue-600 hover:text-blue-700 text-sm p-2 hover:bg-blue-50 rounded"
              >
                https://eranfixer.co.il (אתרים במחיר מיוחד)
              </button>
            </div>
          </div>
          
          {linkUrl && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-700 mb-2">👀 תצוגה מקדימה:</h4>
              <a 
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
                onClick={(e) => e.preventDefault()}
              >
                {linkText || linkUrl}
              </a>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => {
                setShowLinkModal(false)
                setLinkUrl('')
                setLinkText('')
                setSavedSelection(null)
              }}
            >
              ביטול
            </Button>
            <Button 
              onClick={insertLink}
              disabled={!linkUrl.trim()}
            >
              <Link className="w-4 h-4 ml-2" />
              הוסף קישור
            </Button>
          </div>
        </div>
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => {
          setShowImageModal(false)
          setImageUrl('')
          setImageAlt('')
        }}
        title="🖼️ הוסף תמונה"
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
              תיאור התמונה
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="תיאור התמונה לנגישות"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">🖼️ תמונות מומלצות:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setImageUrl('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
                  setImageAlt('טכנולוגיה ועסקים')
                }}
                className="text-blue-600 hover:text-blue-700 text-right p-2 hover:bg-blue-50 rounded"
              >
                עסקים וטכנולוגיה
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
                  setImageAlt('פיתוח ותכנות')
                }}
                className="text-blue-600 hover:text-blue-700 text-right p-2 hover:bg-blue-50 rounded"
              >
                פיתוח ואתרים
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
              onClick={() => {
                setShowImageModal(false)
                setImageUrl('')
                setImageAlt('')
              }}
            >
              ביטול
            </Button>
            <Button 
              onClick={insertImage}
              disabled={!imageUrl.trim()}
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
        
        /* Editor content styling */
        [contenteditable] {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 16px;
          line-height: 1.7;
          color: #374151;
        }
        
        [contenteditable] h1 { 
          font-size: 2.25em; 
          font-weight: bold; 
          margin: 1em 0 0.5em; 
          color: #1f2937;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 0.3em;
        }
        
        [contenteditable] h2 { 
          font-size: 1.875em; 
          font-weight: bold; 
          margin: 0.8em 0 0.4em; 
          color: #1f2937;
        }
        
        [contenteditable] h3 { 
          font-size: 1.5em; 
          font-weight: bold; 
          margin: 0.7em 0 0.35em; 
          color: #374151;
        }
        
        [contenteditable] h4 { 
          font-size: 1.25em; 
          font-weight: bold; 
          margin: 0.6em 0 0.3em; 
          color: #374151;
        }
        
        [contenteditable] p { 
          margin: 0.8em 0; 
          line-height: 1.7;
          color: #4b5563;
        }
        
        [contenteditable] b,
        [contenteditable] strong {
          color: #1f2937 !important;
          font-weight: 700 !important;
        }
        
        [contenteditable] ul, 
        [contenteditable] ol { 
          margin: 0.8em 0; 
          padding-right: 1.5em;
          color: #4b5563;
        }
        
        [contenteditable] li { 
          margin: 0.3em 0; 
          line-height: 1.6;
        }
        
        [contenteditable] blockquote { 
          border-right: 4px solid #3b82f6; 
          padding: 1em 1.5em; 
          margin: 1em 0; 
          font-style: italic; 
          color: #6b7280;
          background: #f8fafc;
          border-radius: 0 8px 8px 0;
        }
        
        /* CRITICAL: Link styling that WILL be saved */
        [contenteditable] a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
          cursor: pointer !important;
          font-weight: 500 !important;
          transition: color 0.2s ease !important;
        }
        
        [contenteditable] a:hover {
          color: #1d4ed8 !important;
          text-decoration: underline !important;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        [contenteditable] hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2em 0;
        }
        
        /* Focus outline */
        [contenteditable]:focus {
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
        }
      `}</style>
    </div>
  )
}