package com.resume.model

data class ConvertResponse(
    val htmlContent: String,
    val success: Boolean,
    val message: String? = null
)

data class TemplateInfo(
    val name: String,
    val displayName: String,
    val description: String
)

enum class OutputFormat {
    HTML, PDF
}
