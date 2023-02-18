import multer, {
  type Options,
  type DiskStorageOptions,
  type Field,
} from 'multer'

const storageOptions: DiskStorageOptions = {
  destination: './uploads/images',
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}_${file.originalname}`)
  },
}

const storage = multer.diskStorage(storageOptions)

const options: Options = {
  storage,
  limits: { fieldSize: 50 * 1024 * 1024 },
}

const fields: Field[] = [
  { name: 'userPic', maxCount: 1 },
  { name: 'userBanner', maxCount: 1 },
]

export default multer(options).fields(fields)
