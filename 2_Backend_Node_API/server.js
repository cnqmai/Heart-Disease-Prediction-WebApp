import cors from 'cors';
import express from 'express';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 5000);
const pythonCommand = process.env.PYTHON_CMD || 'python';
const predictorPath = path.join(__dirname, 'predict.py');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    message: 'Node.js Heart Disease Prediction API'
  });
});

app.post('/api/predict', async (req, res) => {
  const features = req.body?.features;

  if (!Array.isArray(features) || features.length === 0) {
    return res.status(400).json({
      error: 'Không tìm thấy dữ liệu đặc trưng (features) trong payload.'
    });
  }

  try {
    const result = await runPythonPrediction({ features });
    return res.json(result);
  } catch (error) {
    console.error('Lỗi xử lý predict:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi hệ thống khi dự đoán.'
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({
    error: 'Không tìm thấy endpoint.'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Node.js Heart Disease Prediction API đang chạy tại http://0.0.0.0:${port}`);
});

function runPythonPrediction(payload) {
  return new Promise((resolve, reject) => {
    const child = spawn(pythonCommand, [predictorPath], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      reject(new Error(`Không chạy được Python predictor: ${error.message}`));
    });

    child.on('close', (code) => {
      if (code !== 0) {
        const message = parsePythonError(stdout) || parsePythonError(stderr) || stderr.trim();
        reject(new Error(message || `Python predictor thoát với mã lỗi ${code}.`));
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(new Error(`Không đọc được kết quả predictor: ${error.message}`));
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

function parsePythonError(output) {
  try {
    const parsed = JSON.parse(output);
    return parsed.error;
  } catch {
    return null;
  }
}
