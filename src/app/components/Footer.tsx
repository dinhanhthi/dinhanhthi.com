'use client'

import CafeIcon from '@/public/cafe.svg'
import cn from 'classnames'
import { ExternalLink, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import Container from './Container'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'

export default function Footer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const aClass = 'hover:text-white whitespace-nowrap flex items-center gap-1'

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify')
      setIsAuthenticated(response.ok)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoggingIn(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (!response.ok) {
        setError('Invalid password')
        setIsLoggingIn(false)
        return
      }

      // Store password in localStorage for API requests
      localStorage.setItem('admin-password', password)
      setIsAuthenticated(true)
      setShowLoginModal(false)
      setPassword('')
      window.location.reload()
    } catch {
      setError('Login failed. Please try again.')
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      localStorage.removeItem('admin-password')
      setIsAuthenticated(false)
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setShowLoginModal(open)
    if (!open) {
      setPassword('')
      setError('')
    }
  }

  return (
    <>
      <footer className="bg-nav-dark-bg text-gray-300">
        <Container className="p-4">
          <div className="flex flex-row flex-wrap items-center justify-center gap-2 lg:flex-row">
            <Link className={cn(aClass)} href={'/about/'}>
              About
            </Link>
            <span>|</span>
            <a
              className={cn(aClass)}
              href="https://photos.app.goo.gl/9OVEkdTjmtRPg7vC3"
              target="_blank"
            >
              Sketches <ExternalLink size={16} />
            </a>{' '}
            <span>|</span>
            <a
              className={cn(aClass)}
              href="https://goo.gl/photos/yQXdQws1LLS16x5v5"
              target="_blank"
            >
              Cooking <ExternalLink size={16} />
            </a>{' '}
            <span>|</span>
            <Link className={cn(aClass)} href={'/note/support-thi/'}>
              <Image className="h-4 w-auto" src={CafeIcon} alt="Cafe icon" /> Support Thi
            </Link>
            {!isLoading && (
              <>
                <span>|</span>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className={cn(aClass, 'cursor-pointer border-none bg-transparent')}
                    title="Logout"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <Dialog open={showLoginModal} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                      <button className={cn(aClass, 'cursor-pointer border-none bg-transparent')}>
                        Login
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-md">
                      <DialogHeader>
                        <DialogTitle>Admin Login</DialogTitle>
                        <DialogDescription>
                          Enter your admin password to access protected features.
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleLogin} className="flex flex-row gap-4">
                        <input
                          type="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:italic focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                          placeholder="password..."
                          required
                          autoFocus
                        />

                        {error && (
                          <div className="rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                          </div>
                        )}

                        <Button type="submit" disabled={isLoggingIn} className="w-fit">
                          {isLoggingIn ? 'Logging in...' : 'Login'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
          </div>
        </Container>
      </footer>
    </>
  )
}
