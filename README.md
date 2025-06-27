# n8n Web Scraper to PDF Sample Project

This project demonstrates how to create an n8n workflow that scrapes web content and converts it to PDF format. Specifically, it scrapes the SmartSDR Mac documentation page and saves it as a PDF file.

## Overview

This sample project includes:
- Two example n8n workflows (basic and advanced)
- A custom HTML to PDF node using Puppeteer
- Complete documentation and setup instructions
- Example configurations and usage guidelines

## Project Structure

```
├── package.json                                    # Main project dependencies
├── workflows/
│   ├── web-scraper-to-pdf.json                    # Basic workflow example
│   └── advanced-web-scraper-to-pdf.json           # Advanced workflow with custom node
├── custom-nodes/
│   └── n8n-nodes-html-to-pdf/                     # Custom HTML to PDF node
│       ├── package.json
│       ├── tsconfig.json
│       └── src/nodes/HtmlToPdf/
│           └── HtmlToPdf.node.ts
└── README.md                                       # This documentation
```

## Features

### Basic Workflow (`web-scraper-to-pdf.json`)
- Fetches HTML content from the target webpage
- Processes and cleans HTML content
- Generates PDF metadata and preview
- Saves HTML preview to file system
- Sends email notification when complete

### Advanced Workflow (`advanced-web-scraper-to-pdf.json`)
- Enhanced HTML processing with better PDF styling
- Uses custom HTML to PDF node for proper PDF generation
- Automatic filename generation based on page title and date
- PDF formatting options (margins, paper size, etc.)
- Complete PDF file saving with proper binary handling

### Custom HTML to PDF Node
- Built with TypeScript and Puppeteer
- Configurable PDF options (format, margins, background printing)
- Proper binary data handling
- Error handling and validation

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- n8n installed globally or locally
- Basic understanding of n8n workflows

### Installation Steps

1. **Clone this repository**
   ```bash
   git clone <repository-url>
   cd n8n-web-scraper-pdf-sample
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the custom node** (for advanced workflow)
   ```bash
   cd custom-nodes/n8n-nodes-html-to-pdf
   npm install
   npm run build
   ```

4. **Link the custom node to n8n** (optional, for advanced workflow)
   ```bash
   # From the custom-nodes/n8n-nodes-html-to-pdf directory
   npm link
   
   # In your n8n installation directory
   npm link n8n-nodes-html-to-pdf
   ```

## Usage

### Option 1: Basic Workflow (No Custom Nodes Required)

1. Import the basic workflow:
   ```bash
   # Start n8n
   n8n start
   
   # In n8n interface, import workflows/web-scraper-to-pdf.json
   ```

2. Configure the workflow:
   - The workflow is pre-configured to scrape `https://documents.roskosch.de/smartsdr-mac/`
   - Optionally configure email settings for notifications
   - Execute the workflow

3. Review the output:
   - HTML content preview will be saved to file system
   - Email notification will be sent (if configured)
   - Check logs for execution details

### Option 2: Advanced Workflow (With Custom HTML to PDF Node)

1. Ensure the custom node is installed (see installation steps above)

2. Import the advanced workflow:
   ```bash
   # Import workflows/advanced-web-scraper-to-pdf.json in n8n interface
   ```

3. Execute the workflow:
   - The workflow will automatically fetch, process, and convert to PDF
   - PDF file will be saved with automatic filename generation
   - Summary information will be provided

## Workflow Details

### Node Explanations

#### 1. Fetch Web Page (HTTP Request Node)
```javascript
// Configuration
URL: "https://documents.roskosch.de/smartsdr-mac/"
Options: {
  response: { fullResponse: true },
  timeout: 30000
}
```
**Purpose**: Retrieves the HTML content from the target webpage with full response headers.

#### 2. Enhance HTML for PDF (Code Node)
```javascript
// Key functions:
// - Extracts page title from HTML
// - Adds CSS styling for better PDF formatting
// - Wraps content with proper HTML structure
// - Includes header and footer information
```
**Purpose**: Processes raw HTML and enhances it with proper styling and structure for PDF conversion.

#### 3. Convert to PDF (Custom Node)
```javascript
// Configuration options:
{
  htmlProperty: "html",
  filename: "{{ $json.title }}_{{ $json.timestamp }}.pdf",
  pdfOptions: {
    format: "A4",
    printBackground: true,
    margins: "0.5in"
  }
}
```
**Purpose**: Converts the enhanced HTML to PDF using Puppeteer with configurable options.

#### 4. Save PDF File (File System Node)
**Purpose**: Saves the generated PDF binary data to the file system with the generated filename.

#### 5. Generate Summary (Code Node)
**Purpose**: Creates a summary of the completed process with success status and file details.

## Configuration Options

### Custom Node PDF Options
- **Format**: A4, A3, Letter
- **Print Background**: Include background colors and images
- **Margins**: Configurable top, bottom, left, right margins
- **Custom CSS**: Can be added in the HTML enhancement step

### Workflow Customization
- **Target URL**: Change in the HTTP Request node
- **Output Directory**: Modify in the File System node
- **PDF Styling**: Customize CSS in the HTML enhancement code
- **Filename Pattern**: Adjust in the custom node configuration

## Troubleshooting

### Common Issues

1. **Puppeteer Installation Issues**
   ```bash
   # On Linux, you might need additional dependencies
   sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2
   ```

2. **Custom Node Not Appearing**
   - Ensure the node is properly built (`npm run build`)
   - Check that n8n can find the custom node
   - Restart n8n after installing custom nodes

3. **PDF Generation Fails**
   - Check that the HTML content is valid
   - Ensure sufficient system resources for Puppeteer
   - Verify file system permissions for output directory

4. **Network Issues**
   - Check firewall settings for outbound HTTPS requests
   - Verify the target URL is accessible
   - Consider timeout adjustments for slow connections

### Debugging Tips

1. **Enable detailed logging**
   ```bash
   N8N_LOG_LEVEL=debug n8n start
   ```

2. **Test HTML content manually**
   - Save the enhanced HTML to a file
   - Open in browser to verify formatting
   - Test PDF generation separately

3. **Check node outputs**
   - Use the n8n interface to inspect data between nodes
   - Verify data types and structure
   - Test individual nodes in isolation

## Extending the Project

### Adding More Websites
1. Duplicate the workflow
2. Change the target URL in the HTTP Request node
3. Adjust HTML processing if needed for different site structures

### Custom PDF Styling
1. Modify the CSS in the "Enhance HTML for PDF" node
2. Add custom styling rules for specific HTML elements
3. Test different margin and formatting options

### Additional File Formats
1. Extend the custom node to support other formats
2. Add image generation capabilities
3. Include multiple output format options

### Integration with Cloud Storage
1. Add nodes for cloud storage services (AWS S3, Google Drive, etc.)
2. Modify the workflow to upload PDFs automatically
3. Add metadata and tagging capabilities

## License

This project is provided as a sample/example for educational purposes. Please ensure you comply with the terms of service of any websites you scrape and respect robots.txt files.

## Support

For issues specific to this sample project, please check:
1. n8n official documentation: https://docs.n8n.io/
2. Puppeteer documentation: https://pptr.dev/
3. Common troubleshooting steps above

## Contributing

This is a sample project, but improvements and extensions are welcome:
1. Enhanced error handling
2. Additional PDF customization options
3. Support for more complex website structures
4. Performance optimizations
