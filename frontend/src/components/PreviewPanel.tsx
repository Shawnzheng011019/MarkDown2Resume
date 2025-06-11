import React from 'react'
import { Loader2, FileText } from 'lucide-react'

interface PreviewPanelProps {
  htmlContent: string
  isLoading: boolean
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ htmlContent, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Generating preview...</p>
        </div>
      </div>
    )
  }

  if (!htmlContent) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No preview available</p>
          <p className="text-gray-400 text-sm">Upload a Markdown file to see the preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-96 overflow-auto">
      <div className="p-4">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-0"
          style={{ minHeight: '500px' }}
          title="Resume Preview"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  )
}

export default PreviewPanel
