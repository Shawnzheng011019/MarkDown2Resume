package com.resume.controller

import com.resume.model.ConvertResponse
import com.resume.model.OutputFormat
import com.resume.model.TemplateInfo
import com.resume.service.MarkdownService
import com.resume.service.PdfService
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.nio.charset.StandardCharsets

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5173"])
class ConvertController(
    private val markdownService: MarkdownService,
    private val pdfService: PdfService
) {

    @PostMapping("/convert", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun convertMarkdown(
        @RequestParam("file") file: MultipartFile,
        @RequestParam("template", defaultValue = "modern") template: String,
        @RequestParam("format", defaultValue = "HTML") format: OutputFormat
    ): ResponseEntity<Any> {
        
        if (file.isEmpty) {
            return ResponseEntity.badRequest()
                .body(ConvertResponse("", false, "File is empty"))
        }

        if (!file.originalFilename?.endsWith(".md", ignoreCase = true)!!) {
            return ResponseEntity.badRequest()
                .body(ConvertResponse("", false, "File must be a Markdown (.md) file"))
        }

        return try {
            val markdownContent = String(file.bytes, StandardCharsets.UTF_8)
            val htmlContent = markdownService.convertMarkdownToHtml(markdownContent, template)

            when (format) {
                OutputFormat.HTML -> {
                    ResponseEntity.ok(ConvertResponse(htmlContent, true))
                }
                OutputFormat.PDF -> {
                    val pdfBytes = pdfService.convertHtmlToPdf(htmlContent)
                    val headers = HttpHeaders().apply {
                        contentType = MediaType.APPLICATION_PDF
                        setContentDispositionFormData("attachment", "resume.pdf")
                    }
                    ResponseEntity.ok()
                        .headers(headers)
                        .body(pdfBytes)
                }
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ConvertResponse("", false, "Error processing file: ${e.message}"))
        }
    }

    @GetMapping("/templates")
    fun getTemplates(): ResponseEntity<List<TemplateInfo>> {
        val templates = listOf(
            TemplateInfo("modern", "Modern", "Clean and contemporary design"),
            TemplateInfo("classic", "Classic", "Traditional professional layout"),
            TemplateInfo("minimal", "Minimal", "Simple and elegant design")
        )
        return ResponseEntity.ok(templates)
    }

    @GetMapping("/health")
    fun health(): ResponseEntity<Map<String, String>> {
        return ResponseEntity.ok(mapOf("status" to "OK", "service" to "MarkDown2Resume"))
    }
}
