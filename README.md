# MarkDown2Resume

A modern web application that converts Markdown resumes to beautiful HTML and PDF formats.

## Features

- Upload Markdown resume files
- Convert to styled HTML with professional templates
- Generate PDF downloads
- Modern React frontend with Kotlin Spring Boot backend
- Multiple resume templates (Modern, Classic)
- No database required - pure file processing

## Tech Stack

**Backend:**
- Kotlin + Spring Boot
- CommonMark (Markdown parsing)
- Flying Saucer + iText (PDF generation)

**Frontend:**
- React + Vite + TypeScript
- Tailwind CSS

## Quick Start

1. Install dependencies:
```bash
./gradlew build
cd frontend && npm install
```

2. Start development servers:
```bash
# Backend (port 8080)
./gradlew bootRun

# Frontend (port 5173)
cd frontend && npm run dev
```

3. Open http://localhost:5173 in your browser

## Python Command-Line Tool

This project also includes a standalone Python module for command-line usage.

### Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Usage

Convert Markdown resume to HTML or PDF format:

```bash
# Basic usage - convert to HTML with modern template
python markdown2resume.py sample-resume.md

# Specify template and output format
python markdown2resume.py sample-resume.md --template classic --format HTML

# Generate PDF-ready HTML file
python markdown2resume.py sample-resume.md --template modern --format PDF

# Specify custom output file name
python markdown2resume.py sample-resume.md --output my-resume.html

# List available templates
python markdown2resume.py --list-templates
```

### Available Templates

- `modern` - Clean, modern design (default)
- `classic` - Traditional professional layout
- `minimal` - Simple, minimalist style

### Output Formats

- `HTML` - Direct HTML output (default)
- `PDF` - Generates HTML optimized for PDF conversion via browser print

### Important Notes

- **Image Support**: Currently, image insertion is not supported in the resume templates
- **PDF Generation**: PDF output requires manual conversion through browser print functionality
- **File Format**: Input files must be Markdown (.md) format

### Command-Line Options

- `--template, -t`: Choose resume template (modern, classic, minimal)
- `--format, -f`: Output format (HTML, PDF)
- `--output, -o`: Specify output file name
- `--list-templates`: Show available templates

## Project Structure

```
MarkDown2Resume/
├── backend/                    # Kotlin Spring Boot
├── frontend/                   # React application
├── markdown2resume.py          # Python CLI tool
├── requirements.txt            # Python dependencies
├── templates/                  # CSS templates
└── README.md
```
