package com.resume.service

import org.commonmark.Extension
import org.commonmark.ext.gfm.tables.TablesExtension
import org.commonmark.ext.heading.anchor.HeadingAnchorExtension
import org.commonmark.parser.Parser
import org.commonmark.renderer.html.HtmlRenderer
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets

@Service
class MarkdownService {

    private val extensions: List<Extension> = listOf(
        TablesExtension.create(),
        HeadingAnchorExtension.create()
    )

    private val parser: Parser = Parser.builder()
        .extensions(extensions)
        .build()

    private val renderer: HtmlRenderer = HtmlRenderer.builder()
        .extensions(extensions)
        .build()

    fun convertMarkdownToHtml(markdownContent: String, templateName: String = "modern"): String {
        val document = parser.parse(markdownContent)
        val htmlContent = renderer.render(document)
        
        return wrapWithTemplate(htmlContent, templateName)
    }

    private fun wrapWithTemplate(htmlContent: String, templateName: String): String {
        val cssContent = loadTemplate(templateName)
        
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Resume</title>
                <style>
                    $cssContent
                </style>
            </head>
            <body>
                <div class="resume-container">
                    $htmlContent
                </div>
            </body>
            </html>
        """.trimIndent()
    }

    private fun loadTemplate(templateName: String): String {
        return try {
            val resource = ClassPathResource("templates/$templateName-resume.css")
            resource.getContentAsString(StandardCharsets.UTF_8)
        } catch (e: Exception) {
            loadTemplate("modern") // fallback to modern template
        }
    }

    fun getAvailableTemplates(): List<String> {
        return listOf("modern", "classic", "minimal")
    }
}
