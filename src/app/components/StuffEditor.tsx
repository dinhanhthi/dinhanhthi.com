'use client'

import { Button } from '@/src/app/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/src/app/components/ui/field'
import { Input } from '@/src/app/components/ui/input'
import { Textarea } from '@/src/app/components/ui/textarea'
import type {
  CloudinaryUploadResponse,
  Stuff,
  StuffFormData,
  URLMetadata
} from '@/src/lib/types/stuff'
import { cn } from '@/src/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

interface StuffEditorProps {
  className?: string
  stuff?: Stuff
  onSave: (data: StuffFormData) => Promise<void>
  formId?: string
  setIsSaving?: (isSaving: boolean) => void
}

export default function StuffEditor({
  className,
  stuff,
  onSave,
  formId = 'stuff-editor-form',
  setIsSaving: externalSetIsSaving
}: StuffEditorProps) {
  const [formData, setFormData] = useState<StuffFormData>({
    title: stuff?.title || '',
    url: stuff?.url || '',
    image_url: stuff?.image_url || '',
    description: stuff?.description || '',
    notes: stuff?.notes || '',
    tags: stuff?.tags || []
  })

  const [tagInput, setTagInput] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState('')

  // Use external setIsSaving or a no-op function
  const setIsSaving = externalSetIsSaving ?? (() => {})

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, url })
  }

  const fetchMetadata = async () => {
    if (!formData.url) return

    setIsFetching(true)
    try {
      const response = await fetch('/api/stuff/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.url })
      })

      if (!response.ok) throw new Error('Failed to fetch metadata')

      const metadata: URLMetadata = await response.json()

      setFormData({
        ...formData,
        title: formData.title || metadata.title,
        description: formData.description || metadata.description
      })
      setTempImageUrl(metadata.image)
    } catch (error) {
      // console.error('Error fetching metadata:', error)
      toast.error('Failed to fetch metadata from URL')
    } finally {
      setIsFetching(false)
    }
  }

  const uploadToCloudinary = async () => {
    if (!tempImageUrl) {
      toast.error('No image URL to upload')
      return
    }

    setIsUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('imageUrl', tempImageUrl)

      const response = await fetch('/api/stuff/upload-image', {
        method: 'POST',
        headers: {
          'x-admin-password': localStorage.getItem('admin-password') || ''
        },
        body: formDataToSend
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const result: CloudinaryUploadResponse = await response.json()
      setFormData({ ...formData, image_url: result.secure_url })
      setTempImageUrl('')
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      toast.error('Failed to upload image to Cloudinary')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave(formData)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* URL Input */}
      <Field>
        <FieldLabel>
          URL <span className="text-red-500">*</span>
        </FieldLabel>
        <FieldContent>
          <div className="flex gap-2">
            <Input
              type="url"
              value={formData.url}
              onChange={e => handleUrlChange(e.target.value)}
              className="flex-1"
              placeholder="https://example.com"
              required
            />
            <Button onClick={fetchMetadata} disabled={isFetching || !formData.url}>
              {isFetching ? 'Fetching...' : 'Fetch'}
            </Button>
          </div>
          <FieldDescription className='text-muted text-xs'>
            Enter the URL and click &ldquo;Fetch Metadata&rdquo; to auto-fill the form
          </FieldDescription>
        </FieldContent>
      </Field>

      {/* Title */}
      <Field>
        <FieldLabel>
          Title <span className="text-red-500">*</span>
        </FieldLabel>
        <FieldContent>
          <Input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Title of the stuff"
            required
          />
        </FieldContent>
      </Field>

      {/* Image URL */}
      <Field>
        <FieldLabel>Image URL</FieldLabel>
        <FieldContent>
          {tempImageUrl && (
            <div className="mb-2 rounded-md border border-yellow-200 bg-yellow-50 p-3">
              <p className="mb-2 text-sm text-yellow-800">Temporary image URL from metadata:</p>
              <p className="mb-2 text-xs break-all text-gray-600">{tempImageUrl}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tempImageUrl} alt="Preview" className="mb-2 w-full max-w-md rounded" />
              <Button
                type="button"
                onClick={uploadToCloudinary}
                disabled={isUploading}
                variant="default"
              >
                {isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
              </Button>
            </div>
          )}
          <Input
            type="url"
            value={formData.image_url}
            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          {formData.image_url && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full max-w-md rounded border"
              />
            </div>
          )}
          <FieldDescription className='text-muted text-xs'>Upload an image or provide a URL for the cover image</FieldDescription>
        </FieldContent>
      </Field>

      {/* Description */}
      <Field>
        <FieldLabel>Description</FieldLabel>
        <FieldContent>
          <Textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Brief description"
          />
          <FieldDescription className='text-muted text-xs'>A short summary of what this stuff is about</FieldDescription>
        </FieldContent>
      </Field>

      {/* Tags */}
      <Field>
        <FieldLabel>Tags</FieldLabel>
        <FieldContent>
          <div className="mb-2 flex gap-2">
            <Input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              className="flex-1"
              placeholder="Add a tag"
            />
            <Button type="button" onClick={handleAddTag} variant="secondary">
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <FieldDescription className='text-muted text-xs'>
            Press Enter or click &ldquo;Add Tag&rdquo; to add tags for categorization
          </FieldDescription>
        </FieldContent>
      </Field>

      {/* Notes */}
      <Field>
        <FieldLabel>Notes</FieldLabel>
        <FieldContent>
          <Textarea
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Additional notes"
          />
          <FieldDescription className='text-muted text-xs'>
            Personal notes or thoughts about this stuff (optional)
          </FieldDescription>
        </FieldContent>
      </Field>
    </form>
  )
}
