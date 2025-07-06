const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
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

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Audio converter API running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});