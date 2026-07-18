const multer = require('multer')

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const ALLOWED_PDF_TYPE = 'application/pdf'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024  // 5 MB
const MAX_PDF_SIZE   = 20 * 1024 * 1024 // 20 MB

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype)
  const isPdf   = file.mimetype === ALLOWED_PDF_TYPE

  if (!isImage && !isPdf) {
    return cb(
      Object.assign(new Error('Tipe file tidak didukung. Gunakan JPG, PNG, atau PDF.'), { code: 'INVALID_FILE_TYPE' }),
      false
    )
  }

  cb(null, true)
}

// Batas atas yang dipakai multer — validasi per-tipe dilakukan di middleware berikutnya
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_PDF_SIZE },
})

/**
 * Validasi ukuran file setelah multer selesai mem-buffer.
 * Gambar max 5 MB, PDF max 20 MB.
 */
const validateFileSize = (req, res, next) => {
  if (!req.file) return next()

  const { mimetype, size } = req.file
  const isImage = ALLOWED_IMAGE_TYPES.includes(mimetype)

  if (isImage && size > MAX_IMAGE_SIZE) {
    return res.status(400).json({ message: 'Ukuran gambar melebihi batas 5 MB.' })
  }

  next()
}

module.exports = { upload, validateFileSize }
