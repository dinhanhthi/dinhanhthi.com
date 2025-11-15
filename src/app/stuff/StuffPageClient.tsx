'use client'

import Container from '@/src/app/components/Container'
import StuffCard from '@/src/app/components/StuffCard'
import StuffEditor from '@/src/app/components/StuffEditor'
import { Button } from '@/src/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/src/app/components/ui/dialog'
import type { Stuff } from '@/src/lib/types/stuff'
import { useEffect, useState } from 'react'
import HeaderPage from '../components/HeaderPage'

interface StuffResponse {
  stuff: Stuff[]
  totalCount: number
  page: number
  totalPages: number
}

export default function StuffPageClient() {
  const [mounted, setMounted] = useState(false)
  const [stuff, setStuff] = useState<Stuff[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingStuff, setEditingStuff] = useState<Stuff | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check admin status
  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/verify')
      setIsAdmin(response.ok)
    } catch {
      setIsAdmin(false)
    }
  }

  // Fetch stuff
  useEffect(() => {
    fetchStuff()
  }, [page, selectedTag, searchQuery])

  const fetchStuff = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString()
      })
      if (selectedTag) {
        params.append('tag', selectedTag)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/stuff?${params}`)
      if (!response.ok) throw new Error('Failed to fetch stuff')

      const data: StuffResponse = await response.json()
      setStuff(data.stuff)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching stuff:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setPage(1) // Reset to first page
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearchQuery('')
    setPage(1)
  }

  const handleSave = async (formData: any) => {
    try {
      const url = editingStuff ? `/api/stuff/${editingStuff.id}` : '/api/stuff'
      const method = editingStuff ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save stuff')

      setEditingStuff(null)
      setIsCreating(false)
      fetchStuff()
    } catch (error) {
      console.error('Error saving stuff:', error)
      alert('Failed to save stuff')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stuff?')) return

    try {
      const response = await fetch(`/api/stuff/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete stuff')

      setEditingStuff(null)
      fetchStuff()
    } catch (error) {
      console.error('Error deleting stuff:', error)
      alert('Failed to delete stuff')
    }
  }

  // Get all unique tags
  const allTags = Array.from(new Set(stuff.flatMap(s => s.tags))).sort()

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Container className="max-w-7xl py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Cool Stuff</h1>
          <p className="text-gray-600">
            A collection of interesting bookmarks, tools, articles, and resources I find useful.
          </p>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Container>
    )
  }

  return (
    <>
      <HeaderPage
        title="Cool Stuff"
        subtitle="A collection of interesting bookmarks, tools, articles, and resources I find useful."
        iconPath="/logo_sketches/sketch_stuff_nobg.png"
        number={stuff.length}
      />
      <Container>
        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-6">
            <button
              onClick={() => setIsCreating(true)}
              className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Add New Stuff
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search stuff (title, url, description, notes)..."
                className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Search
            </button>
          </form>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Searching for: <span className="font-semibold">{searchQuery}</span>
            </p>
          )}
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedTag(null)
                  setPage(1)
                }}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  !selectedTag
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag)
                    setPage(1)
                  }}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Editor Modal */}
        <Dialog
          open={isCreating || !!editingStuff}
          onOpenChange={open => {
            if (!open) {
              setEditingStuff(null)
              setIsCreating(false)
            }
          }}
        >
          <DialogContent className="flex max-h-[90vh] max-w-[calc(100%-2rem)] flex-col p-0 md:max-w-[680px] md:min-w-[680px]">
            <DialogHeader className="border-border-muted border-b p-4">
              <DialogTitle>{isCreating ? 'Add New Stuff' : 'Edit Stuff'}</DialogTitle>
              <DialogDescription className="text-muted text-sm">
                {isCreating
                  ? 'Fill in the details below to add a new item to your collection.'
                  : 'Update the details below to edit this item.'}
              </DialogDescription>
            </DialogHeader>
            <StuffEditor
              className="thi-scrollbar thi-scrollbar-small min-h-0 flex-1 overflow-y-auto p-4 pt-0"
              stuff={editingStuff || undefined}
              onSave={handleSave}
              formId="stuff-editor-form"
              setIsSaving={setIsSaving}
            />
            <DialogFooter className="border-border-muted border-t p-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingStuff(null)
                  setIsCreating(false)
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              {editingStuff && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDelete(editingStuff.id)}
                  disabled={isSaving}
                >
                  Delete
                </Button>
              )}
              <Button type="submit" form="stuff-editor-form" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {/* Stuff Grid */}
        {!loading && stuff.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stuff.map(item => (
              <StuffCard
                key={item.id}
                stuff={item}
                isAdmin={isAdmin}
                onEdit={() => setEditingStuff(item)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && stuff.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              {selectedTag
                ? `No stuff found with tag "${selectedTag}"`
                : 'No stuff yet. Come back later!'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </>
  )
}
