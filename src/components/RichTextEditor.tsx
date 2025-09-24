import React, { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, Link, Image, Video, List, ListOrdered, Quote, Code, Undo, Redo, Type, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
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
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [savedSelection, setSavedSelection] = useState<Range | null>(null)

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
      console.log('RichTextEditor: Updating content length:', newContent.length)
      console.log('RichTextEditor: Has links:', /<a[^>]*href/i.test(newContent))
      console.log('RichTextEditor: Content preview:', newContent.substring(0, 300))
      
      // Clean up the HTML a bit
      const cleanContent = newContent
        .replace(/<div><br><\/div>/g, '<br>')
        .replace(/<div>/g, '<p>')
        .replace(/<\/div>/g, '</p>')
      
      onChange(cleanContent)
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
    
    console.log('Paste data:', { hasHTML: !!htmlData, hasText: !!textData })
    
    if (htmlData) {
      // Clean and preserve HTML formatting
      const cleanHtml = htmlData
        .replace(/<meta[^>]*>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<!--.*?-->/gi, '')
        .replace(/<link[^>]*>/gi, '')
        .replace(/style="[^"]*"/gi, '') // Remove inline styles that might conflict
        .replace(/<font[^>]*>/gi, '<span>') // Convert font tags to span
        .replace(/<\/font>/gi, '</span>')
        .replace(/<b(\s[^>]*)?>([^<]*)<\/b>/gi, '<strong>$2</strong>') // Convert b to strong
        .replace(/<i(\s[^>]*)?>([^<]*)<\/i>/gi, '<em>$2</em>') // Convert i to em
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()

      console.log('Cleaned HTML:', cleanHtml)

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
      
      console.log('Structured content:', structuredContent)
      execCommand('insertHTML', structuredContent)
    }
    
    setTimeout(updateContent, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Log key events for debugging
    console.log('Key pressed:', e.key, 'Ctrl:', e.ctrlKey)
    
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

    restoreSelection()
    
    const finalText = linkText.trim() || linkUrl
    console.log('Inserting link:', { url: linkUrl, text: finalText })

    // Create a more robust link HTML
    const linkElement = document.createElement('a')
    linkElement.href = linkUrl
    linkElement.target = '_blank'
    linkElement.rel = 'noopener noreferrer'
    linkElement.className = 'editor-link'
    linkElement.style.cssText = 'color: #3b82f6 !important; text-decoration: underline !important; font-weight: 500 !important; cursor: pointer !important;'
    linkElement.textContent = finalText

    try {
      // Try to use the selection to replace content
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(linkElement)
        
        // Move cursor after the link
        range.setStartAfter(linkElement)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        // Fallback: append to editor
        editorRef.current?.appendChild(linkElement)
      }

      console.log('Link inserted successfully')
      
      // Force update
      setTimeout(() => {
        updateContent()
        console.log('Content after link insert:', editorRef.current?.innerHTML.substring(0, 500))
      }, 200)
      
    } catch (error) {
      console.error('Error inserting link:', error)
      // Fallback method
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="editor-link" style="color: #3b82f6 !important; text-decoration: underline !important; font-weight: 500 !important; cursor: pointer !important;">${finalText}</a>`
      execCommand('insertHTML', linkHtml)
    }
    
    setLinkUrl('')
    setLinkText('')
    setSavedSelection(null)
    setShowLinkModal(false)
  }

  const insertImage = () => {
    if (!imageUrl.trim()) return

    const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; display: block;" class="editor-image" />`
    execCommand('insertHTML', imageHtml)
    
    setTimeout(() => {
      updateContent()
    }, 200)
    
    setImageUrl('')
    setImageAlt('')
    setShowImageModal(false)
  }

  const insertVideo = () => {
    if (!videoUrl.trim()) return

    let videoHtml = ''
    
    // Check if it's a Cloudinary video
    if (videoUrl.includes('cloudinary.com') || videoUrl.includes('res.cloudinary.com')) {
      videoHtml = `<video controls style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; display: block;" class="editor-video" title="${videoTitle}">
        <source src="${videoUrl}" type="video/mp4">
        <source src="${videoUrl.replace('.mp4', '.webm')}" type="video/webm">
        הדפדפן שלכם לא תומך בהצגת וידאו.
      </video>`
    } else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      // YouTube embed
      const videoId = videoUrl.includes('youtu.be') 
        ? videoUrl.split('/').pop()?.split('?')[0]
        : new URL(videoUrl).searchParams.get('v')
      
      videoHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 10px 0; border-radius: 8px; overflow: hidden;" class="editor-youtube">
        <iframe src="https://www.youtube.com/embed/${videoId}" 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                allowfullscreen 
                title="${videoTitle}">
        </iframe>
      </div>`
    } else if (videoUrl.includes('vimeo.com')) {
      // Vimeo embed
      const videoId = videoUrl.split('/').pop()?.split('?')[0]
      videoHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 10px 0; border-radius: 8px; overflow: hidden;" class="editor-vimeo">
        <iframe src="https://player.vimeo.com/video/${videoId}" 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                allowfullscreen 
                title="${videoTitle}">
        </iframe>
      </div>`
    } else {
      // Generic video file
      videoHtml = `<video controls style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; display: block;" class="editor-video" title="${videoTitle}">
        <source src="${videoUrl}" type="video/mp4">
        הדפדפן שלכם לא תומך בהצגת וידאו.
      </video>`
    }
    
    execCommand('insertHTML', videoHtml)
    
    setTimeout(() => {
      updateContent()
    }, 200)
    
    setVideoUrl('')
    setVideoTitle('')
    setShowVideoModal(false)
  }

  const formatHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`)
  }

  const insertHr = () => {
    const hrHtml = '<hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;" class="editor-hr" />'
    execCommand('insertHTML', hrHtml)
  }

  const clearFormatting = () => {
    execCommand('removeFormat')
  }

  // Enhanced blur handler to ensure content is saved
  const handleBlur = () => {
    console.log('RichTextEditor: Blur event - saving content')
    updateContent()
  }

  // Enhanced focus handler
  const handleFocus = () => {
    console.log('RichTextEditor: Focus event')
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
        { icon: Video, command: () => setShowVideoModal(true), title: 'הוסף סרטון' },
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
              >
                📱 וואטסאפ - https://wa.me/972522126366
              </button>
              <button
                type="button"
                onClick={() => {
                  setLinkUrl('mailto:eranfixer@gmail.com')
                  setLinkText('שלח מייל')
                }}
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
            <h4 className="text-sm font-medium text-gray-700 mb-2">תמונות Unsplash מומלצות:</h4>
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

      {/* Enhanced Video Modal */}
      <Modal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        title="הוסף סרטון"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת הסרטון
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/your-cloud/video/upload/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כותרת הסרטון
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="תיאור קצר של הסרטון לנגישות"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 mb-2">🎬 סוגי סרטונים נתמכים:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="bg-white p-2 rounded border">
                <strong className="text-purple-800">Cloudinary:</strong> 
                <span className="text-gray-600"> res.cloudinary.com/your-cloud/video/upload/...</span>
              </div>
              <div className="bg-white p-2 rounded border">
                <strong className="text-red-600">YouTube:</strong> 
                <span className="text-gray-600"> youtube.com/watch?v=VIDEO_ID</span>
              </div>
              <div className="bg-white p-2 rounded border">
                <strong className="text-blue-600">Vimeo:</strong> 
                <span className="text-gray-600"> vimeo.com/VIDEO_ID</span>
              </div>
              <div className="bg-white p-2 rounded border">
                <strong className="text-green-600">קובץ ישיר:</strong> 
                <span className="text-gray-600"> example.com/video.mp4</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 טיפים לCloudinary:</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p>• העלה סרטונים ל-Cloudinary Media Library</p>
              <p>• קבל URL אופטימלי עם דחיסה אוטומטית</p>
              <p>• השתמש בפורמטים: MP4, WebM לתאימות מקסימלית</p>
              <p>• הוסף טרנספורמציות (רוחב, איכות) ל-URL</p>
            </div>
          </div>

          {videoUrl && (
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">תצוגה מקדימה:</h4>
              {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                <div className="bg-red-50 p-4 rounded text-center text-sm text-red-700 border border-red-200">
                  📺 סרטון YouTube יוצג כ-iframe מוטמע
                </div>
              ) : videoUrl.includes('vimeo.com') ? (
                <div className="bg-blue-50 p-4 rounded text-center text-sm text-blue-700 border border-blue-200">
                  📺 סרטון Vimeo יוצג כ-iframe מוטמע
                </div>
              ) : (
                <video
                  src={videoUrl}
                  className="max-w-full h-32 object-cover rounded"
                  controls
                  muted
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => setShowVideoModal(false)}
            >
              ביטול
            </Button>
            <Button 
              onClick={insertVideo}
              disabled={!videoUrl}
            >
              <Video className="w-4 h-4 ml-2" />
              הוסף סרטון
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
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 1em 0;
        }
        .prose video,
        .prose .editor-video {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 1em 0;
          max-width: 100%;
        }
        .prose .editor-youtube,
        .prose .editor-vimeo {
          margin: 1em 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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