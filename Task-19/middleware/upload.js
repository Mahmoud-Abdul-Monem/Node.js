import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${randomUUID()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("invalid file type"), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter,
});

export function uploadImage(fieldName) {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                let message = err.message;
                if (err.code === "LIMIT_FILE_SIZE") {
                    message = "image must be smaller than 5MB";
                }
                return res.status(422).json({
                    errors: {
                        image: { errors: [message] }
                    }
                });
            }
            next();
        });
    };
}