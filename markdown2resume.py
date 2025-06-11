#!/usr/bin/env python3
"""
MarkDown2Resume Python Module
A command-line tool to convert Markdown resumes to HTML and PDF formats.
"""

import sys
import click
import markdown
from pathlib import Path
from jinja2 import Template
from typing import Optional


class MarkdownResumeConverter:
    """Main converter class for processing markdown resumes."""
    
    def __init__(self):
        self.available_templates = ["modern", "classic", "minimal"]
        self.script_dir = Path(__file__).parent
        self.templates_dir = self.script_dir / "templates"
        
        # Initialize markdown processor with extensions
        self.md = markdown.Markdown(
            extensions=[
                'markdown.extensions.tables',
                'markdown.extensions.toc',
                'markdown.extensions.fenced_code'
            ]
        )
    
    def load_template_css(self, template_name: str) -> str:
        """Load CSS template content."""
        if template_name not in self.available_templates:
            template_name = "modern"  # fallback
        
        css_file = self.templates_dir / f"{template_name}-resume.css"
        
        try:
            with open(css_file, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            # Fallback to modern template
            modern_css = self.templates_dir / "modern-resume.css"
            with open(modern_css, 'r', encoding='utf-8') as f:
                return f.read()
    
    def convert_markdown_to_html(self, markdown_content: str, template_name: str = "modern") -> str:
        """Convert markdown content to styled HTML."""
        # Convert markdown to HTML
        html_content = self.md.convert(markdown_content)
        
        # Load template CSS
        css_content = self.load_template_css(template_name)
        
        # Create complete HTML document
        html_template = Template("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume</title>
    <style>
        {{ css_content }}
    </style>
</head>
<body>
    <div class="resume-container">
        {{ html_content }}
    </div>
</body>
</html>""")
        
        return html_template.render(
            css_content=css_content,
            html_content=html_content
        )
    
    def save_html_for_pdf_conversion(self, html_content: str, output_file: str):
        """Save HTML with print-friendly styles for manual PDF conversion."""
        # Add print-specific CSS
        print_css = """
        <style media="print">
            @page {
                margin: 0.75in;
                size: A4;
            }
            .resume-container {
                margin: 0;
                box-shadow: none;
                border-radius: 0;
            }
        </style>
        """

        # Insert print CSS before closing head tag
        html_with_print_css = html_content.replace('</head>', f'{print_css}</head>')

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_with_print_css)
    
    def process_file(self, input_file: str, template: str, output_format: str, output_file: Optional[str] = None):
        """Process markdown file and generate output."""
        # Read input file
        input_path = Path(input_file)
        if not input_path.exists():
            raise FileNotFoundError(f"Input file not found: {input_file}")
        
        if not input_path.suffix.lower() == '.md':
            raise ValueError("Input file must be a Markdown (.md) file")
        
        with open(input_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        # Convert to HTML
        html_content = self.convert_markdown_to_html(markdown_content, template)
        
        # Determine output file name if not provided
        if output_file is None:
            base_name = input_path.stem
            if output_format.upper() == 'HTML':
                output_file = f"{base_name}_resume.html"
            else:
                output_file = f"{base_name}_resume.pdf"
        
        # Generate output
        if output_format.upper() == 'HTML':
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            click.echo(f"HTML resume generated: {output_file}")

        elif output_format.upper() == 'PDF':
            # Generate HTML file optimized for PDF conversion
            pdf_html_file = output_file.replace('.pdf', '_for_pdf.html')
            self.save_html_for_pdf_conversion(html_content, pdf_html_file)
            click.echo(f"HTML file for PDF conversion generated: {pdf_html_file}")
            click.echo("To convert to PDF:")
            click.echo(f"1. Open {pdf_html_file} in your browser")
            click.echo("2. Press Ctrl+P (Cmd+P on Mac) to print")
            click.echo("3. Select 'Save as PDF' as destination")
            click.echo(f"4. Save as {output_file}")

        else:
            raise ValueError("Output format must be 'HTML' or 'PDF'")


@click.command()
@click.argument('input_file', type=click.Path(exists=True))
@click.option('--template', '-t', 
              type=click.Choice(['modern', 'classic', 'minimal'], case_sensitive=False),
              default='modern',
              help='Resume template to use (default: modern)')
@click.option('--format', '-f', 'output_format',
              type=click.Choice(['HTML', 'PDF'], case_sensitive=False),
              default='HTML',
              help='Output format (default: HTML)')
@click.option('--output', '-o',
              help='Output file name (optional)')
@click.option('--list-templates', is_flag=True,
              help='List available templates')
def main(input_file, template, output_format, output, list_templates):
    """
    Convert Markdown resume to HTML or PDF format.
    
    INPUT_FILE: Path to the markdown resume file (.md)
    """
    converter = MarkdownResumeConverter()
    
    if list_templates:
        click.echo("Available templates:")
        for tmpl in converter.available_templates:
            click.echo(f"  - {tmpl}")
        return
    
    try:
        converter.process_file(input_file, template, output_format, output)
    except Exception as e:
        click.echo(f"Error: {str(e)}", err=True)
        sys.exit(1)


if __name__ == '__main__':
    main()
