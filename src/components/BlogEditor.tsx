import React, { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, Link, Image, List, ListOrdered, Quote, Code, Undo, Redo, Type, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import DOMPurify from 'dompurify'

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

  // Safe URL validation
  const isSafeUrl = (url: string, allowedDomains?: string[]): boolean => {
    try {
      const urlObj = new URL(url)
      const protocol = urlObj.protocol
      
      // Block dangerous protocols
      if (!['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
        return false
      }
      
      // For external URLs, check allowed domains if specified
      if (allowedDomains && protocol.startsWith('http')) {
        return allowedDomains.some(domain => urlObj.hostname.includes(domain))
      }
      
      return true
    } catch {
      return false
    }
  }

  // Sanitize HTML content
  const sanitizeContent = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'a', 'img', 'video', 'source', 'iframe',
        'strong', 'em', 'b', 'i', 'u', 'br', 'hr', 'span'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'target', 'rel',
        'controls', 'class', 'allowfullscreen', 'type'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      ADD_ATTR: ['target'],
      FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover'],
      FORBID_TAGS: ['script', 'object', 'embed', 'link', 'meta'],
      ALLOW_DATA_ATTR: false
    })
  }

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isInitialized && value) {
      console.log('RichTextEditor: Initializing with value:', value.substring(0, 200))
      editorRef.current.innerHTML = value
      setIsInitialized(true)
    }
  }, [value, isInitialized])

  // Save current selection before opening modals
  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange())
    }
  }

  // Restore selection when inserting content
  const restoreSelection = () => {
    if (savedSelection) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedSelection)
      }
    }
  }

  // Enhanced content update with better logging
  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      
      // Clean up the HTML a bit
      const cleanContent = newContent
        .replace(/<div><br><\/div>/g, '<br>')
        .replace(/<div>/g, '<p>')
        .replace(/<\/div>/g, '</p>')
      
      // Sanitize before sending to parent
      const sanitizedContent = sanitizeContent(cleanContent)
      onChange(sanitizedContent)
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('RichTextEditor: Updating content length:', sanitizedContent.length)
        console.log('RichTextEditor: Has links:', /<a[^>]*href/i.test(sanitizedContent))
        console.log('RichTextEditor: Content preview:', sanitizedContent.substring(0, 300))
      }
    }
  }

  // Enhanced command execution
  const execCommand = (command: string, value?: string) => {
    try {
      editorRef.current?.focus()
      const success = document.execCommand(command, false, value)
      console.log(`Command ${command} executed:`, success)
      
      // Force update after a short delay
      setTimeout(() => {
        updateContent()
      }, 100)
    } catch (error) {
      console.error('Error executing command:', error)
    }
  }

  // Enhanced input handler
  const handleInput = (e: React.FormEvent) => {
    console.log('RichTextEditor: Input event triggered')
    updateContent()
  }

  // Better paste handler
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    
    // Try to get HTML first, then fall back to plain text
    const htmlData = e.clipboardData.getData('text/html')
    const textData = e.clipboardData.getData('text/plain')
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Paste data:', { hasHTML: !!htmlData, hasText: !!textData })
    }
    
    if (htmlData) {
      // First clean, then sanitize
      let cleanHtml = htmlData
        .replace(/<meta[^>]*>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<!--.*?-->/gi, '')
        .replace(/<link[^>]*>/gi, '')
        .replace(/<font[^>]*>/gi, '<span>') // Convert font tags to span
        .replace(/<\/font>/gi, '</span>')
        .replace(/<b(\s[^>]*)?>([^<]*)<\/b>/gi, '<strong>$2</strong>') // Convert b to strong
        .replace(/<i(\s[^>]*)?>([^<]*)<\/i>/gi, '<em>$2</em>') // Convert i to em
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()

      // Sanitize the HTML
      cleanHtml = sanitizeContent(cleanHtml)
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Cleaned and sanitized HTML:', cleanHtml)
      }

      // Insert HTML content
      execCommand('insertHTML', cleanHtml)
    } else if (textData) {
      // For plain text, try to detect and create structure
      const lines = textData.split('\n').filter(line => line.trim())
      let structuredContent = ''
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim()
        
        // Detect potential headings (lines that are shorter and look like titles)
        if (trimmedLine.length < 60 && !trimmedLine.endsWith('.') && !trimmedLine.endsWith(',')) {
          if (index === 0) {
            structuredContent += `<h1>${trimmedLine}</h1>`
          } else {
            structuredContent += `<h2>${trimmedLine}</h2>`
          }
        } else {
          // Regular paragraph
          structuredContent += `<p>${trimmedLine}</p>`
        }
      })
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Structured content:', structuredContent)
      }
      execCommand('insertHTML', structuredContent)
    }
    
    setTimeout(updateContent, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Log key events for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('Key pressed:', e.key, 'Ctrl:', e.ctrlKey, 'Meta:', e.metaKey)
    }
    
    // Update content on certain key events
    if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
      setTimeout(updateContent, 50)
    }

    // Keyboard shortcuts - support both Ctrl (Windows) and Cmd (Mac)
    if (e.ctrlKey || e.metaKey) {
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
    saveSelection()
    const selection = window.getSelection()
    const text = selection?.toString() || ''
    setLinkText(text)
    setLinkUrl('')
    setShowLinkModal(true)
  }

  // Enhanced link insertion with better HTML
  const insertLink = () => {
    if (!linkUrl.trim()) return
    
    // Validate URL before insertion
    if (!isSafeUrl(linkUrl)) {
      alert('כתובת URL לא תקינה או לא בטוחה')
      return
    }

    restoreSelection()
    
    const finalText = linkText.trim() || linkUrl
    if (process.env.NODE_ENV !== 'production') {
      console.log('Inserting link:', { url: linkUrl, text: finalText })
    }

    // Create sanitized link HTML
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="editor-link">${finalText}</a>`
    const sanitizedLinkHtml = sanitizeContent(linkHtml)

    try {
      // Try to use the selection to replace content
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        
        // Create temporary container for sanitized HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = sanitizedLinkHtml
        const linkElement = tempDiv.firstChild
        
        if (linkElement) {
          range.insertNode(linkElement)
          
          // Move cursor after the link
          range.setStartAfter(linkElement)
          range.collapse(true)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      } else {
        // Fallback: append to editor
        execCommand('insertHTML', sanitizedLinkHtml)
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log('Link inserted successfully')
      }
      
      // Force update
      setTimeout(() => {
        updateContent()
        if (process.env.NODE_ENV !== 'production') {
          console.log('Content after link insert:', editorRef.current?.innerHTML.substring(0, 500))
        }
      }, 200)
      
    } catch (error) {
      console.error('Error inserting link:', error)
      // Fallback method
      execCommand('insertHTML', sanitizedLinkHtml)
    }
    
    setLinkUrl('')
    setLinkText('')
    setSavedSelection(null)
    setShowLinkModal(false)
  }

  const insertImage = () => {
    if (!imageUrl.trim()) return
    
    // Validate image URL
    if (!isSafeUrl(imageUrl)) {
      alert('כתובת תמונה לא תקינה או לא בטוחה')
      return
    }

    const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" class="editor-image" />`
    const sanitizedImageHtml = sanitizeContent(imageHtml)
    execCommand('insertHTML', sanitizedImageHtml)
    
    setTimeout(() => {
      updateContent()
    }, 200)
    
    setImageUrl('')
    setImageAlt('')
    setShowImageModal(false)
  }

  const formatHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`)
  }

  const insertHr = () => {
    const hrHtml = '<hr class="editor-hr" />'
    const sanitizedHrHtml = sanitizeContent(hrHtml)
    execCommand('insertHTML', sanitizedHrHtml)
  }

  const clearFormatting = () => {
    execCommand('removeFormat')
  }

  // Enhanced blur handler to ensure content is saved
  const handleBlur = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('RichTextEditor: Blur event - saving content')
    }
    updateContent()
  }

  // Enhanced focus handler
  const handleFocus = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('RichTextEditor: Focus event')
    }
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

        {/* Debug Info */}
        <div className="text-xs text-gray-500 bg-yellow-50 px-3 py-2 rounded">
          💡 <strong>קיצורי מקלדת:</strong> Ctrl+B (מודגש) | Ctrl+I (נטוי) | Ctrl+K (קישור) | Ctrl+Z (בטל)
          <br />
          <strong>Debug:</strong> תוכן: {value.length} תווים | קישורים: {(value.match(/<a[^>]*href/g) || []).length}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        spellCheck={true}
        lang="he"
        aria-label="עורך תוכן עשיר"
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        className="focus:outline-none prose prose-sm max-w-none p-4 min-h-[400px]"
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
        onClose={() => {
          setShowLinkModal(false)
          setSavedSelection(null)
        }}
        title="הוסף קישור"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 טיפ לקישורים:</h4>
            <p className="text-sm text-blue-700">
              בחר טקסט לפני לחיצה על "הוסף קישור" או הקלד טקסט חדש למטה
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              טקסט הקישור *
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="הטקסט שיהיה קישור"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
              required
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">דוגמאות נפוצות:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setLinkUrl('https://wa.me/972522126366')
                  setLinkText('שלח הודעה בווטסאפ')
                }}
                className="text-right p-2 bg-white rounded hover:bg-blue-50 transition-colors"
                aria-label="הוסף קישור וואטסאפ"
              >
                📱 וואטסאפ - https://wa.me/972522126366
              </button>
              <button
                type="button"
                onClick={() => {
                  setLinkUrl('mailto:eranfixer@gmail.com')
                  setLinkText('שלח מייל')
                }}
                aria-label="הוסף קישור מייל"
                className="text-right p-2 bg-white rounded hover:bg-blue-50 transition-colors"
              >
                📧 מייל - mailto:eranfixer@gmail.com
              </button>
              <button
                type="button"
                onClick={() => {
                  setLinkUrl('tel:052-212-6366')
                  setLinkText('התקשר עכשיו')
                }}
                className="text-right p-2 bg-white rounded hover:bg-blue-50 transition-colors"
              >
                📞 טלפון - tel:052-212-6366
              </button>
              <button
                type="button"
                onClick={() => {
                  setLinkUrl('https://seo.eranfixer.co.il')
                  setLinkText('מחקרי SEO מתקדמים')
                }}
                className="text-right p-2 bg-white rounded hover:bg-blue-50 transition-colors"
              >
                🔍 SEO Research - https://seo.eranfixer.co.il
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => {
                setShowLinkModal(false)
                setSavedSelection(null)
              }}
            >
              ביטול
            </Button>
            <Button 
              onClick={insertLink}
              disabled={!linkUrl.trim() || !linkText.trim()}
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
            <h4 className="text-sm font-medium text-gray-700 mb-2">דוגמאות Cloudinary:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setImageUrl('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
                  setImageAlt('עסקים וטכנולוגיה')
                }}
                className="text-blue-600 hover:text-blue-700 text-right"
              >
                עסקים וטכנולוגיה
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
                  setImageAlt('פיתוח ואתרים')
                }}
                className="text-blue-600 hover:text-blue-700 text-right"
              >
                פיתוח ואתרים
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrl('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
                  setImageAlt('עבודה צוותית')
                }}
                className="text-blue-600 hover:text-blue-700 text-right"
              >
                עבודה צוותית
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrl('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
                  setImageAlt('פגישות ויעוץ')
                }}
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
        
        /* Enhanced link styles - VERY IMPORTANT! */
        .prose a,
        .prose .editor-link,
        [contenteditable] a,
        [contenteditable] .editor-link { 
          color: #3b82f6 !important; 
          text-decoration: underline !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          pointer-events: all !important;
          position: relative !important;
          z-index: 1 !important;
          transition: all 0.2s ease !important;
          display: inline !important;
          background: transparent !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .prose a:hover,
        .prose .editor-link:hover,
        [contenteditable] a:hover,
        [contenteditable] .editor-link:hover { 
          color: #1d4ed8 !important;
          text-decoration: underline !important;
          background-color: rgba(59, 130, 246, 0.1) !important;
          padding: 1px 2px !important;
          border-radius: 3px !important;
        }
        
        .dark .prose a,
        .dark .prose .editor-link,
        .dark [contenteditable] a,
        .dark [contenteditable] .editor-link {
          color: #60a5fa !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }

        .dark .prose a:hover,
        .dark .prose .editor-link:hover,
        .dark [contenteditable] a:hover,
        .dark [contenteditable] .editor-link:hover {
          color: #93c5fd !important;
          background-color: rgba(96, 165, 250, 0.2) !important;
          padding: 1px 2px !important;
          border-radius: 3px !important;
        }
        
        .prose img,
        .prose .editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 1em 0;
          display: block;
        }
        .prose hr,
        .prose .editor-hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2em 0;
        }
        .dark .prose hr,
        .dark .prose .editor-hr {
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