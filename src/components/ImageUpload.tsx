'use client'

import { useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
  hint?: string
}

export default function ImageUpload({ value, onChange, label, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  async function uploadFile(file: File) {
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Upload failed.')
      } else {
        onChange(data.url)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    uploadFile(files[0])
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Preview */}
      {value && (
        <div className="relative mb-2 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-24 w-auto rounded-lg border border-slate-200 object-cover bg-slate-50"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs leading-none border-0 cursor-pointer transition-colors"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all text-sm ${
          dragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
        } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <span className="text-2xl shrink-0">{uploading ? '⏳' : '📎'}</span>
        <div className="min-w-0">
          <p className="font-semibold text-slate-700">
            {uploading ? 'Uploading…' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">{hint ?? 'JPG, PNG, WebP, GIF or SVG · max 5 MB'}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* URL text input — allows pasting an external URL too */}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="/uploads/my-image.jpg  or  https://..."
        className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />

      {error && <p className="mt-1.5 text-red-600 text-xs font-semibold">{error}</p>}
    </div>
  )
}
