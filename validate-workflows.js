const fs = require('fs');
const path = require('path');

/**
 * Simple validation script for n8n workflow files
 * Checks that the workflow JSON files are valid and contain expected nodes
 */

console.log('Validating n8n workflow files...\n');

const workflowDir = path.join(__dirname, 'workflows');
const workflowFiles = fs.readdirSync(workflowDir).filter(file => file.endsWith('.json'));

let allValid = true;

workflowFiles.forEach(file => {
    const filePath = path.join(workflowDir, file);
    console.log(`Validating ${file}...`);
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const workflow = JSON.parse(content);
        
        // Basic validation checks
        const checks = [
            { name: 'Has name', test: () => workflow.name && typeof workflow.name === 'string' },
            { name: 'Has nodes array', test: () => Array.isArray(workflow.nodes) },
            { name: 'Has connections object', test: () => typeof workflow.connections === 'object' },
            { name: 'Has at least one node', test: () => workflow.nodes.length > 0 },
            { name: 'Has HTTP request node', test: () => workflow.nodes.some(node => node.type === 'n8n-nodes-base.httpRequest') },
            { name: 'Has code processing node', test: () => workflow.nodes.some(node => node.type === 'n8n-nodes-base.code') },
            { name: 'All nodes have valid IDs', test: () => workflow.nodes.every(node => node.id && typeof node.id === 'string') },
            { name: 'All nodes have valid names', test: () => workflow.nodes.every(node => node.name && typeof node.name === 'string') }
        ];
        
        let fileValid = true;
        checks.forEach(check => {
            try {
                const result = check.test();
                console.log(`  ✓ ${check.name}: ${result ? 'PASS' : 'FAIL'}`);
                if (!result) fileValid = false;
            } catch (error) {
                console.log(`  ✗ ${check.name}: ERROR - ${error.message}`);
                fileValid = false;
            }
        });
        
        // Check specific workflow requirements
        if (file.includes('advanced')) {
            const hasCustomNode = workflow.nodes.some(node => node.type === 'htmlToPdf');
            console.log(`  ✓ Has custom HTML to PDF node: ${hasCustomNode ? 'PASS' : 'FAIL'}`);
            if (!hasCustomNode) fileValid = false;
        }
        
        console.log(`  Overall: ${fileValid ? '✅ VALID' : '❌ INVALID'}\n`);
        if (!fileValid) allValid = false;
        
    } catch (error) {
        console.log(`  ❌ ERROR: ${error.message}\n`);
        allValid = false;
    }
});

// Validate custom node files
console.log('Validating custom node files...');
const customNodePath = path.join(__dirname, 'custom-nodes', 'n8n-nodes-html-to-pdf');

try {
    const packageJsonPath = path.join(customNodePath, 'package.json');
    const nodeFilePath = path.join(customNodePath, 'src', 'nodes', 'HtmlToPdf', 'HtmlToPdf.node.ts');
    
    console.log('  ✓ Package.json exists:', fs.existsSync(packageJsonPath) ? 'PASS' : 'FAIL');
    console.log('  ✓ Node TypeScript file exists:', fs.existsSync(nodeFilePath) ? 'PASS' : 'FAIL');
    
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log('  ✓ Has n8n configuration:', packageJson.n8n ? 'PASS' : 'FAIL');
        console.log('  ✓ Has puppeteer dependency:', packageJson.dependencies?.puppeteer ? 'PASS' : 'FAIL');
    }
    
} catch (error) {
    console.log(`  ❌ Custom node validation error: ${error.message}`);
    allValid = false;
}

console.log('\n' + '='.repeat(50));
console.log(`Overall validation: ${allValid ? '✅ ALL VALID' : '❌ SOME ISSUES FOUND'}`);

if (allValid) {
    console.log('\n🎉 All workflow files are valid and ready to use!');
    console.log('You can now import them into n8n and start scraping!');
} else {
    console.log('\n⚠️  Some issues were found. Please check the output above.');
    process.exit(1);
}