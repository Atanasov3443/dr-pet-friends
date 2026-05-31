import { Router, Response } from "express"
import { authenticate, AuthRequest } from "../middleware/auth"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { Readable } from "stream"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true)
    else cb(new Error("Само изображения са разрешени"))
  },
})

const router = Router()

// POST /api/upload/image?folder=pets|avatars|licenses
// Returns { url: string }
router.post("/image", authenticate, upload.single("image"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) { res.status(400).json({ error: "Не е предоставено изображение" }); return }
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      res.status(503).json({ error: "Upload service not configured" }); return
    }

    const folder = ["pets", "avatars", "licenses"].includes(String(req.query.folder))
      ? `drpetfriend/${req.query.folder}`
      : "drpetfriend/misc"

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image", transformation: [{ width: 800, height: 800, crop: "limit" }] },
        (err, result) => err ? reject(err) : resolve(result as { secure_url: string })
      )
      Readable.from(req.file!.buffer).pipe(stream)
    })

    res.json({ url: result.secure_url })
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Upload failed" })
  }
})

export default router
