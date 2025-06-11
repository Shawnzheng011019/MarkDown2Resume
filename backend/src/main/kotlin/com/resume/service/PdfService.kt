package com.resume.service

import org.springframework.stereotype.Service
import org.xhtmlrenderer.pdf.ITextRenderer
import java.io.ByteArrayOutputStream
import java.io.StringReader

@Service
class PdfService {

    fun convertHtmlToPdf(htmlContent: String): ByteArray {
        val outputStream = ByteArrayOutputStream()
        
        try {
            val renderer = ITextRenderer()
            renderer.setDocumentFromString(htmlContent)
            renderer.layout()
            renderer.createPDF(outputStream)
            
            return outputStream.toByteArray()
        } catch (e: Exception) {
            throw RuntimeException("Failed to generate PDF: ${e.message}", e)
        } finally {
            outputStream.close()
        }
    }
}
