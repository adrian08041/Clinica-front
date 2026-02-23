const fs = require('fs');

const inputFile = 'C:/Users/pc/.gemini/antigravity/brain/f2d6af21-ba1d-45da-8a83-e6f9a37e1da5/.system_generated/steps/147/output.txt';
const outputFile = 'c:/Users/pc/Documents/repositorios clinica/front/clinica/app/dashboard/page.tsx';

let content = fs.readFileSync(inputFile, 'utf-8');

// Stop before the trailing text
const endMarkerIndex = content.indexOf('SUPER CRITICAL:');
if (endMarkerIndex !== -1) {
    content = content.substring(0, endMarkerIndex);
}

// Remove data-name and data-node-id attributes
content = content.replace(/ data-name="[^"]*"/g, '');
content = content.replace(/ data-node-id="[^"]*"/g, '');

fs.writeFileSync(outputFile, content.trim() + '\n');
console.log('Successfully wrote to page.tsx');
