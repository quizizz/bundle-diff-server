import axios from 'axios';
import * as fs from 'fs';

export const downloadFile = async (
  url: string,
  destinationPath: string,
): Promise<void> => {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(destinationPath);

  response.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};
