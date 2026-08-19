'use client'

import { useMemo, useState } from 'react'

const GALLERY_SLOT_COUNT = 4
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'
const slotLabelClass = 'mb-2 block text-[10px] uppercase tracking-[0.16em] text-zinc-600'
const ghostButtonClass =
  'border border-zinc-800 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 hover:border-zinc-600 hover:text-zinc-200'

type GallerySlot = {
  url: string
  alt: string
}

type UploadKind = 'primary' | 'gallery'

type ProductImageFieldsProps = {
  productId?: string
  primaryImage?: string
  gallery?: GallerySlot[]
}

function emptyGallerySlots(gallery: GallerySlot[] | undefined) {
  return Array.from({ length: GALLERY_SLOT_COUNT }, (_, index) => gallery?.[index] || { url: '', alt: '' })
}

export function ProductImageFields({
  productId,
  primaryImage = '',
  gallery,
}: ProductImageFieldsProps) {
  const initialSlots = useMemo(() => emptyGallerySlots(gallery), [gallery])
  const [imageUrl, setImageUrl] = useState(primaryImage)
  const [slots, setSlots] = useState(initialSlots)
  const [uploading, setUploading] = useState<UploadKind | number | null>(null)
  const [storageNotice, setStorageNotice] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const mediaProductId = productId?.trim() || 'draft'

  async function uploadFile(file: File, kind: UploadKind, slotIndex?: number) {
    if (file.size > MAX_UPLOAD_BYTES) {
      setFieldError('File is too large. Maximum size is 5MB.')
      return
    }

    setFieldError(null)
    setStorageNotice(null)
    setUploading(kind === 'primary' ? 'primary' : slotIndex ?? 'gallery')

    try {
      const body = new FormData()
      body.append('file', file)
      body.append('productId', mediaProductId)
      body.append('kind', kind)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
        credentials: 'same-origin',
      })

      const payload = (await response.json().catch(() => null)) as
        | { ok: true; url: string }
        | { ok: false; error?: string }
        | null

      if (!response.ok || !payload || payload.ok !== true || !payload.url) {
        const message = payload && 'error' in payload && payload.error ? payload.error : 'Upload failed.'
        if (message === 'Media storage is not configured.') {
          setStorageNotice(message)
        } else {
          setFieldError(message)
        }
        return
      }

      if (kind === 'primary') {
        setImageUrl(payload.url)
        return
      }

      if (typeof slotIndex === 'number') {
        setSlots((current) =>
          current.map((slot, index) => (index === slotIndex ? { ...slot, url: payload.url } : slot)),
        )
      }
    } catch {
      setFieldError('Upload failed. Check your connection and try again.')
    } finally {
      setUploading(null)
    }
  }

  function onPrimaryFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    void uploadFile(file, 'primary')
  }

  function onGalleryFileChange(slotIndex: number, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    void uploadFile(file, 'gallery', slotIndex)
  }

  function clearPrimary() {
    setImageUrl('')
    setFieldError(null)
  }

  function clearGallerySlot(slotIndex: number) {
    setSlots((current) => current.map((slot, index) => (index === slotIndex ? { url: '', alt: '' } : slot)))
    setFieldError(null)
  }

  function updateGalleryAlt(slotIndex: number, alt: string) {
    setSlots((current) => current.map((slot, index) => (index === slotIndex ? { ...slot, alt } : slot)))
  }

  return (
    <div className="space-y-6">
      {storageNotice ? (
        <p className="text-sm text-zinc-400" role="status">
          {storageNotice} You can still paste image URLs below.
        </p>
      ) : null}
      {fieldError ? (
        <p className="text-sm text-zinc-400" role="alert">
          {fieldError}
        </p>
      ) : null}

      <div className="border border-zinc-800 bg-zinc-900 px-6 py-6">
        <p className={labelClass}>Primary image</p>
        <div className="mt-4 flex flex-wrap items-start gap-4">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Primary product preview"
              className="h-24 w-24 border border-zinc-800 bg-zinc-950 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center border border-zinc-800 bg-zinc-950 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
              No image
            </div>
          )}
          <div className="min-w-[16rem] flex-1 space-y-3">
            <label className="block">
              <span className={slotLabelClass}>Upload</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="block w-full text-xs text-zinc-400 file:mr-3 file:border file:border-zinc-700 file:bg-zinc-950 file:px-3 file:py-2 file:text-[10px] file:font-medium file:uppercase file:tracking-[0.16em] file:text-zinc-300"
                disabled={uploading === 'primary'}
                onChange={onPrimaryFileChange}
              />
            </label>
            {uploading === 'primary' ? (
              <p className="text-xs text-zinc-500">Uploading…</p>
            ) : null}
            {imageUrl ? (
              <button type="button" className={ghostButtonClass} onClick={clearPrimary}>
                Remove
              </button>
            ) : null}
          </div>
        </div>
        <label className="mt-6 block">
          <span className={slotLabelClass}>Image URL (advanced)</span>
          <input
            className={fieldClass}
            name="image"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://… or /images/…"
          />
        </label>
      </div>

      <div className="border border-zinc-800 bg-zinc-900 px-6 py-6">
        <p className={labelClass}>Gallery</p>
        <p className="mb-4 text-xs text-zinc-500">
          {GALLERY_SLOT_COUNT} slots. Upload a file or paste a URL. Empty rows are ignored on save.
        </p>
        <div className="space-y-6">
          {slots.map((slot, index) => (
            <div key={index} className="border border-zinc-800 bg-zinc-950 px-4 py-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">Slot {index + 1}</p>
              <div className="mt-4 flex flex-wrap items-start gap-4">
                {slot.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slot.url}
                    alt={slot.alt || `Gallery ${index + 1}`}
                    className="h-20 w-20 border border-zinc-800 bg-zinc-900 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center border border-zinc-800 bg-zinc-900 text-[8px] uppercase tracking-[0.12em] text-zinc-600">
                    Empty
                  </div>
                )}
                <div className="min-w-[16rem] flex-1 space-y-3">
                  <label className="block">
                    <span className={slotLabelClass}>Upload</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="block w-full text-xs text-zinc-400 file:mr-3 file:border file:border-zinc-700 file:bg-zinc-900 file:px-3 file:py-2 file:text-[10px] file:font-medium file:uppercase file:tracking-[0.16em] file:text-zinc-300"
                      disabled={uploading === index}
                      onChange={(event) => onGalleryFileChange(index, event)}
                    />
                  </label>
                  {uploading === index ? <p className="text-xs text-zinc-500">Uploading…</p> : null}
                  {slot.url ? (
                    <button type="button" className={ghostButtonClass} onClick={() => clearGallerySlot(index)}>
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={slotLabelClass}>URL {index + 1}</span>
                  <input
                    className={fieldClass}
                    name={`imageUrl${index}`}
                    value={slot.url}
                    onChange={(event) =>
                      setSlots((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, url: event.target.value } : entry,
                        ),
                      )
                    }
                  />
                </label>
                <label className="block">
                  <span className={slotLabelClass}>Alt {index + 1}</span>
                  <input
                    className={fieldClass}
                    name={`imageAlt${index}`}
                    value={slot.alt}
                    onChange={(event) => updateGalleryAlt(index, event.target.value)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
