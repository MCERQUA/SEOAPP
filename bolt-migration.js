import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to read and parse package.json
function readPackageJson(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading package.json:', error);
    throw error;
  }
}

// Helper function to create Bolt.new compatible configuration
function createBoltConfig(packageJson) {
  return {
    name: packageJson.name,
    version: packageJson.version,
    dependencies: {
      ...packageJson.dependencies,
      // Remove any dependencies that Bolt.new provides natively
      react: undefined,
      'react-dom': undefined,
      tailwindcss: undefined,
    },
    boltDependencies: {
      openai: packageJson.dependencies.openai || '^4.28.0',
      react: '^18.3.1',
      tailwindcss: '^3.4.1'
    }
  };
}

// Helper function to prepare source files for Bolt.new
function prepareSourceFiles(srcDir, outputDir) {
  console.log(`Processing source files from ${srcDir} to ${outputDir}`);
  
  // Create output directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  }

  // Read and process all source files
  function processDirectory(currentPath, targetPath) {
    console.log(`Processing directory: ${currentPath}`);
    const files = readdirSync(currentPath);

    for (const file of files) {
      const sourcePath = join(currentPath, file);
      const targetFilePath = join(targetPath, file);
      const stats = statSync(sourcePath);

      if (stats.isDirectory()) {
        // Recursively process subdirectories
        mkdirSync(targetFilePath, { recursive: true });
        console.log(`Created directory: ${targetFilePath}`);
        processDirectory(sourcePath, targetFilePath);
      } else if (stats.isFile()) {
        // Process individual files
        console.log(`Processing file: ${file}`);
        let content = readFileSync(sourcePath, 'utf8');

        // Modify imports to match Bolt.new's structure
        content = content.replace(
          /from ['"]\.\.?\//g,
          'from \'@/'
        );

        // Update component imports to match Bolt.new's conventions
        content = content.replace(
          /from ['"]@\/components\//g,
          'from \'@/components/ui/'
        );

        writeFileSync(targetFilePath, content);
        console.log(`Wrote file: ${targetFilePath}`);
      }
    }
  }

  try {
    processDirectory(srcDir, outputDir);
  } catch (error) {
    console.error('Error processing files:', error);
    throw error;
  }
}

// Main migration function
function migrateToBolt() {
  const projectDir = process.cwd();
  const outputDir = join(projectDir, 'bolt-output');
  
  console.log('Starting Bolt.new migration...');
  console.log(`Project directory: ${projectDir}`);
  console.log(`Output directory: ${outputDir}`);

  try {
    // Read package.json
    const packageJsonPath = join(projectDir, 'package.json');
    console.log(`Reading package.json from: ${packageJsonPath}`);
    const packageJson = readPackageJson(packageJsonPath);
    
    // Create Bolt.new configuration
    const boltConfig = createBoltConfig(packageJson);
    
    // Create .bolt directory
    const boltDir = join(outputDir, '.bolt');
    mkdirSync(boltDir, { recursive: true });
    console.log(`Created .bolt directory: ${boltDir}`);
    
    // Prepare source files
    const srcDir = join(projectDir, 'src');
    const outputSrcDir = join(outputDir, 'src');
    prepareSourceFiles(srcDir, outputSrcDir);
    
    // Write Bolt.new configuration
    const configPath = join(boltDir, 'config.json');
    writeFileSync(configPath, JSON.stringify(boltConfig, null, 2));
    console.log(`Wrote Bolt.new configuration to: ${configPath}`);
    
    // Copy additional configuration files
    const configFiles = [
      'tailwind.config.js',
      'tsconfig.json',
      'index.html'
    ];
    
    for (const file of configFiles) {
      const sourcePath = join(projectDir, file);
      if (existsSync(sourcePath)) {
        const targetPath = join(outputDir, file);
        copyFileSync(sourcePath, targetPath);
        console.log(`Copied ${file} to: ${targetPath}`);
      } else {
        console.log(`Warning: ${file} not found, skipping...`);
      }
    }

    console.log('\nMigration completed successfully!');
    console.log(`Your Bolt.new-ready project is in: ${outputDir}`);
    console.log('\nNext steps:');
    console.log('1. Open Bolt.new in your browser');
    console.log('2. Create a new project');
    console.log('3. Use the import feature to upload the contents of the bolt-output directory');
  } catch (error) {
    console.error('\nMigration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateToBolt();