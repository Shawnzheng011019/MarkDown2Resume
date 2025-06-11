import { useState } from 'react'
import axios from 'axios'
import FileUpload from './components/FileUpload'
import PreviewPanel from './components/PreviewPanel'
import TemplateSelector from './components/TemplateSelector'
import { FileText, Download, Eye, Upload } from 'lucide-react'

interface ConvertResponse {
  htmlContent: string
  success: boolean
  message?: string
}

function App() {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileConverted = (response: ConvertResponse, file?: File) => {
    if (response.success) {
      setHtmlContent(response.htmlContent)
      setError('')
      if (file) {
        setUploadedFile(file)
      }
    } else {
      setError(response.message || 'Conversion failed')
      setHtmlContent('')
      setUploadedFile(null)
    }
  }

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
  }

  const handlePdfDownload = async () => {
    if (!uploadedFile) {
      setError('No file uploaded')
      return
    }

    setIsLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', uploadedFile)
    formData.append('template', selectedTemplate)
    formData.append('format', 'PDF')

    try {
      const response = await axios.post('/api/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to download PDF')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MarkDown2Resume</h1>
            </div>
            <div className="text-sm text-gray-500">
              Convert Markdown to beautiful resumes
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload and Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Resume
              </h2>
              <FileUpload
                onFileConverted={handleFileConverted}
                selectedTemplate={selectedTemplate}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Template
              </h2>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
              />
            </div>

            {htmlContent && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Download Options
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const blob = new Blob([htmlContent], { type: 'text/html' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'resume.html'
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download HTML
                  </button>
                  <button
                    onClick={handlePdfDownload}
                    disabled={isLoading || !uploadedFile}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </h2>
            </div>
            <PreviewPanel htmlContent={htmlContent} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
