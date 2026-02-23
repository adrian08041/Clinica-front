const fs = require('fs');
const inputFile = "C:\\Users\\pc\\.gemini\\antigravity\\brain\\f2d6af21-ba1d-45da-8a83-e6f9a37e1da5\\.system_generated\\steps\\17\\output.txt";
const outputFile = "c:\\Users\\pc\\Documents\\repositorios clinica\\front\\clinica\\app\\dashboard\\page.tsx";

try {
    let content = fs.readFileSync(inputFile, 'utf-8');
    // Remove data-name and data-node-id attributes
    content = content.replace(/\sdata-name="[^"]*"/g, '');
    content = content.replace(/\sdata-node-id="[^"]*"/g, '');

    // Extract just the React component and variables
    const match = content.match(/const imgImage[\s\S]*export default function Dashboard\(\) \{[\s\S]*\}\s*/);

    if (match) {
        let finalCode = match[0];

        // Add "use client" if needed, but it's just divs so it's a server component.
        // Ensure the folder exists
        const dir = "c:\\Users\\pc\\Documents\\repositorios clinica\\front\\clinica\\app\\dashboard";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputFile, finalCode);
        console.log("Successfully wrote to " + outputFile);
    } else {
        console.error("Could not find React code block.");
    }
} catch (e) {
    console.error("Error:", e);
}
