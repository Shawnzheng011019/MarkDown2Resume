import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Palette, Check } from 'lucide-react'

interface Template {
  name: string
  displayName: string
  description: string
}

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/templates')
        setTemplates(response.data)
      } catch (error) {
        console.error('Failed to fetch templates:', error)
        // Fallback templates
        setTemplates([
          { name: 'modern', displayName: 'Modern', description: 'Clean and contemporary design' },
          { name: 'classic', displayName: 'Classic', description: 'Traditional professional layout' },
          { name: 'minimal', displayName: 'Minimal', description: 'Simple and elegant design' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <div
          key={template.name}
          className={`relative rounded-lg border-2 cursor-pointer transition-all ${
            selectedTemplate === template.name
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onTemplateChange(template.name)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedTemplate === template.name ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Palette className={`h-5 w-5 ${
                    selectedTemplate === template.name ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {template.displayName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {template.description}
                  </p>
                </div>
              </div>
              {selectedTemplate === template.name && (
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-blue-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TemplateSelector
