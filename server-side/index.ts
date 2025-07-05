import express, { Request, Response, RequestHandler } from "express";
import path from "path";
import * as fs from "fs";
import cors from "cors";
import multer from "multer";

const app = express();
const PORT = 3000;

app.use(cors());

const uploadDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadDir));

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const uploadHandler: RequestHandler = (req, res) => {
  const typedReq = req as MulterRequest;
  if (!typedReq.file) {
    res.status(400).send("No file uploaded.");
    return; // important: no Response returned, just exit
  }

  res.json({
    filename: typedReq.file.filename,
    path: `/uploads/${typedReq.file.filename}`,
  });
  return;
};

app.post("/api/upload", upload.single("file"), uploadHandler);

app.get("/api/files", (_req: Request, res: Response) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      res.status(500).send("Error reading upload directory.");
      return;
    }
    res.json(files);
  });
});

app.get("/api/files/:name", (req: Request, res: Response) => {
  const filePath = path.join(uploadDir, req.params.name);
  if (!fs.existsSync(filePath)) {
    res.status(404).send("File not found.");
    return;
  }
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
