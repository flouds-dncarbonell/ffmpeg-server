const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8765;

app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|flac|ogg|m4a)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/convert', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const { format = 'mp3', quality = '128k' } = req.body;
  const inputPath = req.file.path;
  const outputFilename = `converted-${Date.now()}.${format}`;
  const outputPath = path.join('temp', outputFilename);

  ffmpeg(inputPath)
    .toFormat(format)
    .audioBitrate(quality)
    .on('end', () => {
      res.download(outputPath, outputFilename, (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(500).json({ error: 'Download failed' });
        }
        
        fs.remove(inputPath);
        setTimeout(() => fs.remove(outputPath), 5000);
      });
    })
    .on('error', (err) => {
      console.error('Conversion error:', err);
      res.status(500).json({ error: 'Conversion failed: ' + err.message });
      fs.remove(inputPath);
    })
    .save(outputPath);
});

app.get('/formats', (req, res) => {
  res.json({
    supportedFormats: ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac'],
    qualities: ['64k', '128k', '192k', '256k', '320k']
  });
});

app.post('/convert-base64', (req, res) => {
  const { data, mimeType, outputFormat = 'mp3', quality = '128k' } = req.body;
  
  if (!data || !mimeType) {
    return res.status(400).json({ error: 'Base64 data and mimeType are required' });
  }

  try {
    const buffer = Buffer.from(data, 'base64');
    const inputExtension = getExtensionFromMimeType(mimeType);
    const inputFilename = `input-${Date.now()}.${inputExtension}`;
    const inputPath = path.join('uploads', inputFilename);
    const outputFilename = `audio.${outputFormat}`;
    const outputPath = path.join('temp', outputFilename);

    fs.writeFileSync(inputPath, buffer);

    ffmpeg(inputPath)
      .toFormat(outputFormat)
      .audioBitrate(quality)
      .on('end', () => {
        res.download(outputPath, outputFilename, (err) => {
          if (err) {
            console.error('Download error:', err);
            res.status(500).json({ error: 'Download failed' });
          }
          
          fs.remove(inputPath);
          setTimeout(() => fs.remove(outputPath), 5000);
        });
      })
      .on('error', (err) => {
        console.error('Conversion error:', err);
        res.status(500).json({ error: 'Conversion failed: ' + err.message });
        fs.remove(inputPath);
      })
      .save(outputPath);
  } catch (error) {
    console.error('Base64 decode error:', error);
    res.status(400).json({ error: 'Invalid base64 data' });
  }
});

function getExtensionFromMimeType(mimeType) {
  const mimeToExt = {
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
    'audio/flac': 'flac',
    'audio/ogg': 'ogg',
    'audio/m4a': 'm4a',
    'audio/aac': 'aac',
    'audio/x-wav': 'wav',
    'audio/vnd.wave': 'wav'
  };
  
  const baseMimeType = mimeType.split(';')[0].toLowerCase();
  return mimeToExt[baseMimeType] || 'raw';
}

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Audio converter API running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});