import React, { useRef, useState } from 'react'
import axios from 'axios'
import { Upload, FileText, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onFileConverted: (response: any, file?: File) => void
  selectedTemplate: string
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileConverted,
  selectedTemplate,
  isLoading,
  setIsLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = async (files: FileList) => {
    const file = files[0]
    if (!file) return

    if (!file.name.endsWith('.md')) {
      onFileConverted({
        success: false,
        message: 'Please select a Markdown (.md) file',
        htmlContent: ''
      })
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('template', selectedTemplate)
    formData.append('format', 'HTML')

    try {
      const response = await axios.post('/api/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      onFileConverted(response.data, file)
    } catch (error: any) {
      onFileConverted({
        success: false,
        message: error.response?.data?.message || 'Failed to convert file',
        htmlContent: ''
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".md"
          onChange={handleChange}
          disabled={isLoading}
        />

        <div className="text-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-sm text-gray-600">Converting your resume...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload your Markdown resume
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop your .md file here, or click to browse
              </p>
              <button
                onClick={onButtonClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Supported format: Markdown (.md)</p>
        <p>• Maximum file size: 10MB</p>
        <p>• Your file will be processed locally and not stored</p>
      </div>
    </div>
  )
}

export default FileUpload
