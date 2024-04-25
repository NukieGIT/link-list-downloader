const validLinkFileTypes = [
    "text/plain"
]

/**
 * Checks if the file has a valid file type.
 * 
 * @param {File} file - The file to be checked.
 * @param {string[]} validTypes - An array of valid file types.
 * @returns {boolean} Returns true if the file has a valid file type, otherwise false.
 */
export function isValidFileType(file, validTypes = validLinkFileTypes) {
    return validTypes.includes(file.type)
}

/**
 * Checks if a given URL is valid.
 *
 * @param {string} url - The URL to be checked.
 * @returns {boolean} Returns true if the URL is valid, false otherwise.
 */
export function isValidUrl(url) {
    try {
        new URL(url)
        return true
    } catch (err) {
        return false
    }
}

export const DATA_UNITS = /** @type {const} */ (['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']);

/**
 * Formats the given data size to a human-readable format.
 * 
 * @param {number} data - The data size to be formatted.
 * @param {typeof DATA_UNITS[number]} from - The data unit of the given data size.
 * @param {typeof DATA_UNITS[number]} to - The data unit to which the data size should be converted.
 * @returns {number} The formatted data size.
 */
export function convertDataUnit(data, from, to) {
    const fromIndex = DATA_UNITS.indexOf(from)
    const toIndex = DATA_UNITS.indexOf(to)

    if (fromIndex === -1 || toIndex === -1) {
        throw new Error('Invalid data unit')
    }

    return data / Math.pow(1024, toIndex - fromIndex)
}

/**
 * Retrieves the data unit for the given data size.
 * 
 * @param {number} data - The data size to be formatted.
 * @returns {typeof DATA_UNITS[number]} The formatted data with unit.
 */
export function getDataUnit(data) {
    if (data === 0) return "Bytes"
    
    data = Math.abs(data)
    const index = Math.floor(Math.log(data) / Math.log(1024))

    return DATA_UNITS[index]
}

/**
 * Retrieves the file name from a given URL.
 * If no file name is found, it returns the default name.
 *
 * @param {string} url - The URL from which to retrieve the file name.
 * @param {string} defaultName - The default name to use if no file name is found. Default is 'index.html'.
 * @returns {string} The retrieved file name.
 */
export function retrieveFileNameFromUrl(url, defaultName = sanitizeFileName(url)) {
    const fileName = url.split('#').shift().split('?').shift().split('/').pop()

    // check for empty name, such as only spaces or tabs
    const validFileName = !/\s+/.test(fileName) ? defaultName : sanitizeFileName(fileName)
    return validFileName
}

/**
 * Sanitizes the given file name by replacing invalid characters and checking for reserved names.
 * @param {string} fileName - The original file name.
 * @returns {string} The sanitized file name.
 */
export function sanitizeFileName(fileName) {
    const invalidCharactersRegex = /[<>:"/\\|?*\x00-\x1F]/g;
    const sanitizedFileName = fileName.replace(invalidCharactersRegex, '_');

    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    if (reservedNames.includes(sanitizedFileName.toUpperCase())) {
        return sanitizedFileName + '_';
    }

    return sanitizedFileName;
}