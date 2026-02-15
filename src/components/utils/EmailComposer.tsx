"use client"
import React, { useState, useRef, FormEvent, ChangeEvent } from "react"
import { File, X, Paperclip } from "lucide-react"

interface EmailData {
  recipient: string
  subject: string
  message: string
  attachments: File[]
}

const EmailComposer: React.FC = () => {
  // State for form fields
  const [recipient, setRecipient] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  // State for file uploads
  const [files, setFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState<string>("")

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Maximum file size (10MB)
  const MAX_FILE_SIZE: number = 10 * 1024 * 1024 // 10 MB in bytes
  // Maximum total upload size (25MB)
  const MAX_TOTAL_SIZE: number = 25 * 1024 * 1024 // 25 MB in bytes
  // Maximum number of files
  const MAX_FILES: number = 5

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : []
    setUploadError("")

    // Check total number of files
    if (files.length + selectedFiles.length > MAX_FILES) {
      setUploadError(`Maximum ${MAX_FILES} files allowed`)
      return
    }

    // Check individual and total file sizes
    const newFiles = selectedFiles.filter((file) => {
      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File ${file.name} exceeds 10MB limit`)
        return false
      }
      return true
    })

    // Check total upload size
    const totalSize = [...files, ...newFiles].reduce(
      (acc, file) => acc + file.size,
      0
    )
    if (totalSize > MAX_TOTAL_SIZE) {
      setUploadError("Total file size cannot exceed 25MB")
      return
    }

    // Add new files
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  // Remove a specific file
  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove))
  }

  // Handle email send
  const handleSendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic validation
    if (!recipient || !subject || !message) {
      alert("Please fill in all required fields")
      return
    }

    // Here you would typically implement your email sending logic
    const emailData: EmailData = {
      recipient,
      subject,
      message,
      attachments: files,
    }

    // Log or send email data
    console.log(emailData)

    // Reset form
    setRecipient("")
    setSubject("")
    setMessage("")
    setFiles([])

    // Optional: Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSendEmail}>
        {/* Recipient Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">To:</label>
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Recipient email"
            required
          />
        </div>

        {/* Subject Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Email subject"
            required
          />
        </div>

        {/* Message Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded h-40"
            placeholder="Your message"
            required
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Paperclip className="mr-2" /> Attach Files
          </button>

          {/* Error Message */}
          {uploadError && (
            <div className="text-red-500 mt-2">{uploadError}</div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-2 border-t pt-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded mb-1"
                >
                  <div className="flex items-center">
                    <File className="mr-2 text-blue-500" size={20} />
                    <span>{file.name}</span>
                    <span className="ml-2 text-gray-500 text-sm">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send Email
        </button>
      </form>
    </div>
  )
}

export default EmailComposer
