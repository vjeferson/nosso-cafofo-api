import { Request } from 'express';
import multer from 'multer'; 
import mime from 'mime';

class UploadAvatar {
  
  constructor() {}

  private fileFilter() {
    return (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      const type = mime.extension(file.mimetype);
      const conditions = ["png", "jpg", "jpeg"];

      if (conditions.includes(`${type}`)) {
        cb(null, true);
      }

      cb(null, false);
    };
  }

  get getConfig(): multer.Options {
    return {
      storage: multer.memoryStorage(),
      fileFilter: this.fileFilter()
    };
  }

}

export const uploadAvatar = new UploadAvatar();