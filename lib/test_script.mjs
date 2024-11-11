import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

// Configuration
const CONFIG = {
  inputDir: 'lib/msranotes/Musculoskeletal',
  outputDir: 'pages/Musculoskeletal',
  prompt1Path: 'lib/prompts/prompt-1.md',
  prompt2Path: 'lib/prompts/prompt-2.md'
};

const openai = new OpenAI({
 apiKey: 'sk-cBZIHCxf9Cckxs90-4Qr5YQwNzKY6QInz5hqfQIaAwT3BlbkFJdXBz6pGerynmacN0YQ_dzOqyjZ8MgsbEC9sSGXFw0A',
 baseURL: "https://gateway.ai.cloudflare.com/v1/ceb8d96668a0f9b49960ecf3ff6b3739/peerr-ai/openai"
});

function formatFileName(fileName) {
  return fileName
    .toLowerCase()                    // Convert to lowercase
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')      // Remove special characters
    .replace(/-+/g, '-')             // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');          // Remove leading/trailing hyphens
}

async function processWithPrompt(content, promptPath) {
  const promptTemplate = await fs.readFile(promptPath, 'utf-8');
  const fullPrompt = `${promptTemplate}\n---\n${content}`;
  
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: fullPrompt }],
    model: "gpt-4o",
    temperature: 0.7
  });

  return completion.choices[0].message.content
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
}

async function processFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const originalFileName = path.basename(filePath, '.md');
  const formattedFileName = formatFileName(originalFileName);
  
  console.log(`Processing ${originalFileName}...`);
  
  // Process with both prompts
  const firstPass = await processWithPrompt(content, CONFIG.prompt1Path);
  const secondPass = await processWithPrompt(firstPass, CONFIG.prompt2Path);
  
  // Save the processed file
  const outputPath = path.join(CONFIG.outputDir, `${formattedFileName}.mdx`);
  await fs.writeFile(outputPath, `${firstPass}\n\n---\n\n${secondPass}`);
  
  console.log(`✓ Completed ${formattedFileName}.mdx`);
}

async function main() {
  try {
    // Create output directory
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    // Get all .md files from input directory
    const files = await fs.readdir(CONFIG.inputDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`Found ${mdFiles.length} files to process`);
    console.log(`Input directory: ${CONFIG.inputDir}`);
    console.log(`Output directory: ${CONFIG.outputDir}\n`);
    
    // Process files in chunks of 4
    const CHUNK_SIZE = 4;
    for (let i = 0; i < mdFiles.length; i += CHUNK_SIZE) {
      const chunk = mdFiles.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(file => 
          processFile(path.join(CONFIG.inputDir, file))
        )
      );
    }
    
    console.log('\nAll files processed successfully!');
  } catch (e) {
    console.error('Error:', e.message);
  }
}

main();