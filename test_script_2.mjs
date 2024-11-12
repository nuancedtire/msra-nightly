import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Configuration object for all script settings
const CONFIG = {
  baseInputDir: 'lib/msranotes/',
  baseOutputDir: 'pages/',
  prompt1Path: 'lib/prompts/prompt-1.md', // First pass prompt
  prompt2Path: 'lib/prompts/prompt-2.md', // Second pass prompt
  chunkSize: 4,                           // Number of files to process in parallel
  totalFiles: 0,
  processedFiles: 0,
  startTime: 0,
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: 'sk-cBZIHCxf9Cckxs90-4Qr5YQwNzKY6QInz5hqfQIaAwT3BlbkFJdXBz6pGerynmacN0YQ_dzOqyjZ8MgsbEC9sSGXFw0A',
  baseURL: "https://gateway.ai.cloudflare.com/v1/ceb8d96668a0f9b49960ecf3ff6b3739/peerr-ai/openai"
});

/**
 * Formats a filename to be URL-friendly
 * @param {string} fileName - The original filename
 * @returns {string} - URL-friendly filename
 */
function formatFileName(fileName) {
  return fileName
    .toLowerCase()                    // Convert to lowercase
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')      // Remove special characters
    .replace(/-+/g, '-')             // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');          // Remove leading/trailing hyphens
}

/**
 * Process content with OpenAI using a specific prompt
 * @param {string} content - The content to process
 * @param {string} promptPath - Path to the prompt template
 * @returns {Promise<string>} - Processed content
 */
async function processWithPrompt(content, promptPath) {
  const promptTemplate = await fs.readFile(promptPath, 'utf-8');
  const fullPrompt = `${promptTemplate}\n---\n${content}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: fullPrompt }],
    model: "gpt-4o",
    temperature: 0.7
  });

  return completion.choices[0].message.content
    .replace(/^```[a-z]*\s*/i, '')   // Remove opening code fence
    .replace(/```\s*$/, '')          // Remove closing code fence
    .trim();
}

/**
 * Process a single file through the AI pipeline
 * @param {string} filePath - Path to the input file
 * @param {number} fileIndex - The current file's index
 */
async function processFile(filePath, fileIndex) {
  const originalFileName = path.basename(filePath, '.md');
  const formattedFileName = formatFileName(originalFileName);
  const outputPath = path.join(CONFIG.outputDir, `${formattedFileName}.mdx`);

  try {
    // Check if file already exists
    await fs.access(outputPath);
    CONFIG.processedFiles++;
    console.log(`⏩ [${fileIndex + 1}/${CONFIG.totalFiles}] Skipping ${originalFileName}`);
    return;
  } catch {
    // Process new file
    console.log(`🔄 [${fileIndex + 1}/${CONFIG.totalFiles}] Processing ${originalFileName}...`);

    const content = await fs.readFile(filePath, 'utf-8');
    const firstPass = await processWithPrompt(content, CONFIG.prompt1Path);
    const secondPass = await processWithPrompt(firstPass, CONFIG.prompt2Path);

    await fs.writeFile(outputPath, `${firstPass}\n\n---\n\n${secondPass}`);

    CONFIG.processedFiles++;
    console.log(`✅ [${fileIndex + 1}/${CONFIG.totalFiles}] Completed ${formattedFileName}.mdx`);
  }
}

// Function to get user input
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Main execution function
 */
// Modified main function
async function main() {
  try {
    CONFIG.startTime = Date.now();
    CONFIG.processedFiles = 0;
    console.clear();
    // Get user input
    const input = await askQuestion('Enter filename or folder name (relative to lib/msranotes/): ');
    const inputPath = path.join(CONFIG.baseInputDir, input);
    const outputPath = path.join(CONFIG.baseOutputDir, input.split('/')[0]);
    // Create output directory
    await fs.mkdir(outputPath, { recursive: true });
    // Check if input is file or directory
    const stats = await fs.stat(inputPath);
    let mdFiles = [];
    if (stats.isFile()) {
      if (!input.endsWith('.md')) {
        throw new Error('Input file must be a markdown file');
      }
      mdFiles = [path.basename(input)];
      CONFIG.inputDir = path.dirname(inputPath);
      CONFIG.outputDir = outputPath;
    } else {
      CONFIG.inputDir = inputPath;
      CONFIG.outputDir = outputPath;
      const files = await fs.readdir(inputPath);
      mdFiles = files.filter(file => file.endsWith('.md'));
    }
    CONFIG.totalFiles = mdFiles.length;
    // Display initial summary
    console.log('\n📊 Processing Summary:');
    console.log(`📁 Input path:  ${CONFIG.inputDir}`);
    console.log(`📁 Output path: ${CONFIG.outputDir}`);
    console.log(`📑 Total files: ${CONFIG.totalFiles}`);
    console.log(`🔄 Parallel jobs: ${CONFIG.chunkSize}\n`);
    // Process files in chunks
    for (let i = 0; i < mdFiles.length; i += CONFIG.chunkSize) {
      const chunk = mdFiles.slice(i, i + CONFIG.chunkSize);
      await Promise.all(
        chunk.map((file, chunkIndex) =>
          processFile(path.join(CONFIG.inputDir, file), i + chunkIndex)
        )
      );

      if (i + CONFIG.chunkSize < mdFiles.length) {
        console.log('');
      }
    }
    // Display completion summary
    const timeElapsed = ((Date.now() - CONFIG.startTime) / 1000).toFixed(1);
    console.log('\n✨ Processing complete!');
    console.log(`⏱️  Time elapsed: ${timeElapsed} seconds`);
    console.log(`📝 Files processed: ${CONFIG.processedFiles}/${CONFIG.totalFiles}`);
    rl.close();
  } catch (e) {
    console.error('\n❌ Error:', e.message);
    rl.close();
  }
}


// Execute the script
main();