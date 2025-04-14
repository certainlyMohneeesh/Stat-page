import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'
import React from 'react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button
          className="mt-8"
          onClick={() => navigate('/')}
        >
          Go Back Home
        </Button>
      </motion.div>
    </div>
  )
} 