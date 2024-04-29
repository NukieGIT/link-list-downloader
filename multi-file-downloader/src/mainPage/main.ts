import './style.css'
import './form.css'
import '@/components/componentImports'
import DownloadManager from '@/downloading/downloadManager'
import DownloadVisualizer from '@/downloading/downloadVisualizer'

const urls = [
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB"
]

const totalProgressContainer = document.getElementById('total-progress-container') as HTMLDivElement
const downloadProgressContainer = document.getElementById('downloads-progress-container') as HTMLDivElement


const downloadManager = new DownloadManager(urls)
new DownloadVisualizer(downloadManager, totalProgressContainer, downloadProgressContainer)

downloadManager.fetchTotalFileSize()
downloadManager.downloadAll()