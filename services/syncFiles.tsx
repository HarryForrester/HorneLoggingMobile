import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

const ip = 'http://192.168.1.12:3001';

const syncFiles = async (app: any) => {
  console.log('SyncFiles called');

  try {
    const _account = app._account.toString();
    console.log('SyncFiles: _account', _account);

    const token = await SecureStore.getItemAsync('access_token');

    console.log('token ', token);

    if (!_account) {
      throw new Error('Failed to retrieve _account');
    }

    const downloadUrl = `${ip}/api/files`;
    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        account: `${_account}`,
      },
    });

    if (response.status === 200) {
      console.log('200 response');
      const responseData = await response.json();
      const filesData = responseData.files;

      const folderPath = `${FileSystem.documentDirectory}files/store/${_account}`;

      try {
        await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
        console.log('Folder created successfully');
      } catch (mkdirError: any) {
        if (mkdirError.message.includes('already exists')) {
          console.log(`Folder ${folderPath} already exists`);
        } else {
          throw mkdirError;
        }
      }

      // Parallelize the file downloads using a pool of download tasks
      const downloadTasks = filesData.map(async (fileData: any) => {
        const { name, modified } = fileData;

        if (name === '.DS_Store') {
          return;
        }

        const fileUrl = `${downloadUrl}/${name}`;
        const filePath = `${folderPath}/${name}`;
        const metadataFilePath = `${folderPath}/${getMetadataFileName(name)}`;
        const metadataExists = await FileSystem.getInfoAsync(metadataFilePath);

        if (metadataExists.exists) {
          const existingMetadata = await readMetadata(metadataFilePath);

          // Compare the timestamps
          if (modified === existingMetadata.modified) {
            return; // File is already up to date, no changes needed
          }
        }

        try {
          const fileResponse = await FileSystem.downloadAsync(fileUrl, filePath, {
            headers: {
              Authorization: `Bearer ${token}`,
              account: _account,
            },
          });

          if (fileResponse.status === 200) {
            console.log(`File ${name} downloaded successfully`);
            // Update the metadata with the new timestamp
            await writeMetadata(metadataFilePath, { modified });
          } else {
            console.error(`Failed to fetch file ${name}:`, fileResponse.status);
          }
        } catch (error) {
          console.error(`Failed to download file ${name}:`, error);
        }
      });

      // Execute all download tasks in parallel
      await Promise.all(downloadTasks);

      // Remove files and their associated metadata files that are not present in the filesData array
      const existingFiles = await FileSystem.readDirectoryAsync(folderPath);

      const filesToRemove = existingFiles.filter((file) => {
        const fileName = getFileNameWithoutExtension(file);
        const fileExtension = getFileExtension(file);
        const fileDataExists = filesData.some((fileData: any) => {
          const dataFileName = getFileNameWithoutExtension(fileData.name);
          const dataFileExtension = getFileExtension(fileData.name);
          return dataFileName === fileName && dataFileExtension === fileExtension;
        });
        return !fileDataExists && !file.endsWith('.metadata');
      });

      await Promise.all(
        filesToRemove.map(async (file) => {
          const metadataFilePath = `${folderPath}/${getMetadataFileName(file)}`;
          await Promise.all([
            FileSystem.deleteAsync(`${folderPath}/${file}`),
            FileSystem.deleteAsync(metadataFilePath),
          ]);
          console.log(`File ${file} and its metadata removed successfully`);
        }),
      );

      return true;
    } else {
      console.error('Failed to fetch file list:', response.status);
    }
  } catch (error) {
    console.error('Error downloading files:', error);
  }
};

// Utility function to extract the file name without extension
const getFileNameWithoutExtension = (fileName: string) => {
  const index = fileName.lastIndexOf('.');
  return index !== -1 ? fileName.substring(0, index) : fileName;
};

// Utility function to extract the file extension
const getFileExtension = (fileName: string) => {
  const index = fileName.lastIndexOf('.');
  return index !== -1 ? fileName.substring(index + 1) : '';
};

// Utility function to get the metadata file name for a given file name
const getMetadataFileName = (fileName: string) => {
  return `${getFileNameWithoutExtension(fileName)}.metadata`;
};

async function readMetadata(metadataFilePath: string) {
  const metadataContent = await FileSystem.readAsStringAsync(metadataFilePath, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  return JSON.parse(metadataContent);
}

async function writeMetadata(metadataFilePath: string, metadata: any) {
  await FileSystem.writeAsStringAsync(metadataFilePath, JSON.stringify(metadata), {
    encoding: FileSystem.EncodingType.UTF8,
  });
}

export default syncFiles;
