/**
 * Saves the provided file data to the specified file handle.
 *
 * @param {FileSystemFileHandle} fileHandle - The file handle to save the data to.
 * @param {string | Blob | ArrayBuffer | ArrayBufferView} fileData - The data to be saved to the file.
 * @returns {Promise<void>} A promise that resolves when the file is successfully saved.
 */
export async function saveFile(fileHandle, fileData) {
    const writable = await fileHandle.createWritable()
    await writable.write(fileData)
    await writable.close()
}

/**
 * Saves a new file with the given file data and file name.
 * @param {FileSystemDirectoryHandle} directoryHandle - The directory handle to save the file to.
 * @param {string} fileData - The data to be saved in the file.
 * @param {string} fileName - The name of the file to be saved.
 * @returns {Promise<void>} A promise that resolves when the file is saved successfully.
 */
export async function saveNewFile(directoryHandle, fileData, fileName) {
    const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true })
    await saveFile(fileHandle, fileData)
}