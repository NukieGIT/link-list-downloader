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

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}