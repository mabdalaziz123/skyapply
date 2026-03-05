import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Quote,
  Undo,
  Redo,
  Type,
  Palette,
  ChevronDown,
  Eraser
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Extension } from '@tiptap/core';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

// Custom Font Size Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    } as any;
  },
});

const fontSizes = [
  { label: 'صغير جداً', value: '12px' },
  { label: 'صغير', value: '14px' },
  { label: 'عادي', value: '16px' },
  { label: 'كبير', value: '18px' },
  { label: 'كبير جداً', value: '24px' },
  { label: 'ضخم', value: '32px' },
];

const colors = [
  // Grayscale & Basics
  { name: 'أسود', value: '#000000' },
  { name: 'أبيض', value: '#ffffff' },
  { name: 'رمادي داكن', value: '#374151' },
  { name: 'رمادي', value: '#6b7280' },
  { name: 'رمادي فاتح', value: '#d1d5db' },

  // Brand Red & Pinks
  { name: 'أحمر داكن', value: '#991b1b' },
  { name: 'أحمر (البراند)', value: '#E31E24' },
  { name: 'أحمر فاتح', value: '#f87171' },
  { name: 'وردي', value: '#db2777' },

  // Blues
  { name: 'أزرق كحلي', value: '#1e3a8a' },
  { name: 'أزرق', value: '#2563eb' },
  { name: 'أزرق سماوي', value: '#0ea5e9' },

  // Greens
  { name: 'أخضر داكن', value: '#14532d' },
  { name: 'أخضر', value: '#16a34a' },
  { name: 'أخضر فاتح', value: '#4ade80' },

  // Gold & Yellows
  { name: 'ذهبي', value: '#b45309' },
  { name: 'أصفر', value: '#eab308' },
  { name: 'برتقالي', value: '#ea580c' },

  // Purples
  { name: 'بنفسجي', value: '#7c3aed' },
  { name: 'بنفسجي فاتح', value: '#a855f7' },
];

const MenuBar = ({ editor }: { editor: any }) => {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target as Node)) {
        setShowFontMenu(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target as Node)) {
        setShowColorMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-slate-50 border-slate-200 rounded-t-xl relative z-20">
      <div className="flex items-center gap-1 border-l border-slate-200 pl-1 ml-1 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-1 rtl:ml-0 rtl:mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30"
          title="تراجع"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 disabled:opacity-30"
          title="إلغاء التراجع"
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-200 pl-1 ml-1 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-1 rtl:ml-0 rtl:mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive('bold') ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="عريض"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive('italic') ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="مائل"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive('underline') ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="تحته خط"
        >
          <UnderlineIcon size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-200 pl-1 ml-1 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-1 rtl:ml-0 rtl:mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="عنوان رئيسي"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="عنوان فرعي"
        >
          H2
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-200 pl-1 ml-1 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-1 rtl:ml-0 rtl:mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="محاذاة لليسار"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="توسيط"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="محاذاة لليمين"
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-200 pl-1 ml-1 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-1 rtl:ml-0 rtl:mr-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="قائمة نقطية"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="قائمة رقمية"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive('link') ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="إضافة رابط"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 hover:bg-slate-200 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-brand-red/10 text-brand-red' : 'text-slate-600'}`}
          title="اقتباس"
        >
          <Quote size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-200 pl-1 ml-1 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-1 rtl:ml-0 rtl:mr-1">
        {/* Font Size Dropdown */}
        <div className="relative" ref={fontMenuRef}>
          <button
            type="button"
            onClick={() => setShowFontMenu(!showFontMenu)}
            className="flex items-center gap-1 p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            title="حجم الخط"
          >
            <Type size={16} />
            <ChevronDown size={12} />
          </button>
          {showFontMenu && (
            <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-[100] overflow-hidden">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontSize(size.value).run();
                    setShowFontMenu(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${editor.isActive('textStyle', { fontSize: size.value }) ? 'text-brand-red font-bold bg-brand-red/5' : 'text-slate-700'}`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Dropdown */}
        <div className="relative" ref={colorMenuRef}>
          <button
            type="button"
            onClick={() => setShowColorMenu(!showColorMenu)}
            className="flex items-center gap-1 p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            title="لون الخط"
          >
            <Palette size={16} style={{ color: editor.getAttributes('textStyle').color || 'currentColor' }} />
            <ChevronDown size={12} />
          </button>
          {showColorMenu && (
            <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-[100] overflow-hidden p-2">
              <div className="grid grid-cols-5 gap-1.5">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setColor(color.value).run();
                      setShowColorMenu(false);
                    }}
                    className="w-6 h-6 rounded border border-slate-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorMenu(false);
                  }}
                  className="col-span-4 mt-1 text-xs text-slate-500 hover:text-brand-red text-center py-1 rounded hover:bg-slate-50 border border-dashed border-slate-200 transition-colors"
                >
                  إعادة تعيين اللون
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
          title="مسح التنسيق"
        >
          <Eraser size={16} />
        </button>
      </div>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-red underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontSize,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-4 text-right dir-rtl',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync with external value if needed (e.g. on reset)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="rich-text-editor border border-slate-200 rounded-xl overflow-hidden focus-within:border-brand-red/50 transition-colors bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <style>{`
        .ProseMirror {
          min-height: 200px;
          text-align: right;
          direction: rtl;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: right;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-right: 1.5rem;
          padding-left: 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-right: 1.5rem;
          padding-left: 0;
        }
        .ProseMirror blockquote {
          border-right: 4px solid #e2e8f0;
          border-left: none;
          padding-right: 1rem;
          padding-left: 0;
          font-style: italic;
        }
        /* Custom Styles to Override Prose */
        .ProseMirror strong, 
        .ProseMirror h1, 
        .ProseMirror h2, 
        .ProseMirror h3, 
        .ProseMirror h4, 
        .ProseMirror h5, 
        .ProseMirror h6 {
          color: inherit;
        }
      `}</style>
    </div>
  );
}
