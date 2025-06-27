#!/bin/bash

# n8n Web Scraper to PDF - Setup Script
echo "Setting up n8n Web Scraper to PDF sample project..."

# Install main dependencies
echo "Installing main project dependencies..."
npm install

# Build custom node
echo "Building custom HTML to PDF node..."
cd custom-nodes/n8n-nodes-html-to-pdf
npm install
npm run build

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start n8n: npm start (or n8n start)"
echo "2. Import one of the workflow files:"
echo "   - workflows/web-scraper-to-pdf.json (basic)"
echo "   - workflows/advanced-web-scraper-to-pdf.json (with custom node)"
echo "3. Execute the workflow to scrape and generate PDF"
echo ""
echo "For more information, see README.md"