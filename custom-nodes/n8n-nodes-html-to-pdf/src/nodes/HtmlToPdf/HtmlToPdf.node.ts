import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeExecutionWithMetadata,
	IDataObject,
} from 'n8n-workflow';

import * as puppeteer from 'puppeteer';

export class HtmlToPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTML to PDF',
		name: 'htmlToPdf',
		group: ['transform'],
		version: 1,
		description: 'Convert HTML content to PDF using Puppeteer',
		defaults: {
			name: 'HTML to PDF',
			color: '#772244',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'HTML Content Property',
				name: 'htmlProperty',
				type: 'string',
				default: 'html',
				description: 'The property that contains the HTML content to convert',
				required: true,
			},
			{
				displayName: 'Output Filename',
				name: 'filename',
				type: 'string',
				default: 'output.pdf',
				description: 'The filename for the generated PDF',
				required: true,
			},
			{
				displayName: 'PDF Options',
				name: 'pdfOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{
								name: 'A4',
								value: 'A4',
							},
							{
								name: 'A3',
								value: 'A3',
							},
							{
								name: 'Letter',
								value: 'Letter',
							},
						],
						default: 'A4',
						description: 'The format of the PDF',
					},
					{
						displayName: 'Print Background',
						name: 'printBackground',
						type: 'boolean',
						default: true,
						description: 'Whether to print background graphics',
					},
					{
						displayName: 'Margin Top',
						name: 'marginTop',
						type: 'string',
						default: '0.4in',
						description: 'Top margin of the PDF',
					},
					{
						displayName: 'Margin Bottom',
						name: 'marginBottom',
						type: 'string',
						default: '0.4in',
						description: 'Bottom margin of the PDF',
					},
					{
						displayName: 'Margin Left',
						name: 'marginLeft',
						type: 'string',
						default: '0.4in',
						description: 'Left margin of the PDF',
					},
					{
						displayName: 'Margin Right',
						name: 'marginRight',
						type: 'string',
						default: '0.4in',
						description: 'Right margin of the PDF',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const htmlProperty = this.getNodeParameter('htmlProperty', i) as string;
			const filename = this.getNodeParameter('filename', i) as string;
			const pdfOptions = this.getNodeParameter('pdfOptions', i) as IDataObject;

			const htmlContent = items[i].json[htmlProperty] as string;

			if (!htmlContent) {
				throw new Error(`No HTML content found in property '${htmlProperty}'`);
			}

			try {
				// Launch puppeteer browser
				const browser = await puppeteer.launch({
					headless: true,
					args: ['--no-sandbox', '--disable-setuid-sandbox'],
				});

				const page = await browser.newPage();

				// Set HTML content
				await page.setContent(htmlContent, {
					waitUntil: 'networkidle0',
				});

				// Configure PDF options
				const pdfConfig: any = {
					format: pdfOptions.format || 'A4',
					printBackground: pdfOptions.printBackground !== false,
					margin: {
						top: pdfOptions.marginTop || '0.4in',
						bottom: pdfOptions.marginBottom || '0.4in',
						left: pdfOptions.marginLeft || '0.4in',
						right: pdfOptions.marginRight || '0.4in',
					},
				};

				// Generate PDF
				const pdfBuffer = await page.pdf(pdfConfig);

				await browser.close();

				// Return the PDF as binary data
				returnData.push({
					json: {
						filename,
						size: pdfBuffer.length,
						mimeType: 'application/pdf',
						success: true,
					},
					binary: {
						pdf: {
							data: pdfBuffer.toString('base64'),
							mimeType: 'application/pdf',
							fileName: filename,
						},
					},
				});
			} catch (error) {
				throw new Error(`Failed to generate PDF: ${error.message}`);
			}
		}

		return [returnData];
	}
}