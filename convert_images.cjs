const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const TARGET_SIZE_KB = 150;
const PUBLIC_DIR = path.join(__dirname, 'public');
const COMPONENTS_DIR = path.join(__dirname, 'components');
const SRC_DIR = path.join(__dirname, 'src');

function findImages(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const stats = fs.statSync(filePath);
        if (stats.size > TARGET_SIZE_KB * 1024) {
          fileList.push(filePath);
        }
      }
    }
  }
  return fileList;
}

function findTsxFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const largeImages = findImages(PUBLIC_DIR);
console.log(`Found ${largeImages.length} images larger than ${TARGET_SIZE_KB}KB`);

const tsxFiles = [...findTsxFiles(COMPONENTS_DIR), ...findTsxFiles(SRC_DIR), path.join(__dirname, 'App.tsx')].filter(fs.existsSync);

let convertedCount = 0;

async function run() {
  for (const imagePath of largeImages) {
    const dir = path.dirname(imagePath);
    const ext = path.extname(imagePath);
    const baseName = path.basename(imagePath, ext);
    const webpPath = path.join(dir, `${baseName}.webp`);
    
    try {
      console.log(`Converting ${path.basename(imagePath)} to WebP...`);
      await sharp(imagePath).webp({ quality: 80 }).toFile(webpPath);
      
      if (fs.existsSync(webpPath) && fs.statSync(webpPath).size > 0) {
        fs.unlinkSync(imagePath);
        
        const searchString = path.basename(imagePath);
        const replaceString = `${baseName}.webp`;
        
        let refCount = 0;
        for (const tsxFile of tsxFiles) {
          let content = fs.readFileSync(tsxFile, 'utf8');
          if (content.includes(searchString)) {
            const regex = new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            content = content.replace(regex, replaceString);
            fs.writeFileSync(tsxFile, content, 'utf8');
            refCount++;
          }
        }
        
        console.log(` -> Converted and updated in ${refCount} files.`);
        convertedCount++;
      }
    } catch (error) {
      console.error(`Failed to convert ${imagePath}:`, error.message);
    }
  }
  
  console.log(`Successfully converted ${convertedCount} images to WebP.`);
}

run();
