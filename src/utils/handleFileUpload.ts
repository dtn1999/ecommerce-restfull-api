import * as uuid from 'uuid';
import * as fs from 'fs';

type FileUploaderOption = {
    dest: string,
    // eslint-disable-next-line no-unused-vars
    fileFilter: (fileName:string)=>boolean
}

export type FileDetails = {
    fieldname: string,
    originalName: string,
    filename: string,
    mimetype: string,
    destination: string,
    path: string,
    size: number,
  }

/*  images uploader */

export const imageUploader = (file: any, options: FileUploaderOption) => {
  if (!file) throw new Error('no file(s)');

  // update this line to accept single or multiple files
  return Array.isArray(file) ? handleFilesUploads(file, options)
    : handleFileUploads(file, options);
};

const handleFilesUploads = (files: any[], options: FileUploaderOption) => {
  if (!files || !Array.isArray(files)) throw new Error('no files');

  const promises = files.map((file:any) => handleFileUploads(file, options));
  return Promise.all(promises);
};

const handleFileUploads = (file: any, options: FileUploaderOption) => {
  if (!file) throw new Error('no file');

  const originalName = file.hapi.filename as string;
  console.log('originalName', file.hapi);
  const extension = originalName.split('.').pop();
  const filename = uuid.v4();
  const path = `${options.dest}${filename}.${extension}`;
  console.log(path);
  const fileStream = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    file.on('error', (error:any) => {
      reject(error);
    });
    file.pipe(fileStream);

    file.on('end', (_error:any) => {
      if (!_error) {
        const fileDetails: FileDetails = {
          fieldname: file.hapi.name,
          originalName,
          filename: `${filename}.${extension}`,
          mimetype: file.hapi.headers['content-type'],
          destination: `${options.dest}`,
          path,
          size: fs.statSync(path).size,
        };
        resolve(fileDetails);
      }
      console.log(_error);
    });
  });
};

/*   image filter */

export const imageFilter = (fileName: string) => {
  // accept image only
  if (!fileName.match(/\.(jpg|jpeg|png)$/)) {
    return false;
  }

  return true;
};

export default handleFileUploads;
