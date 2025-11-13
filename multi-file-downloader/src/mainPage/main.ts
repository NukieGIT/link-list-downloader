import './style.css'
import './form.css'
import '@/components/componentImports'
import MultiDownloadManager from '@/downloading/downloadsManager'
// import DownloadVisualizer from '@/downloading/downloadVisualizer'

const urls = [
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB"
]

// const totalProgressContainer = document.getElementById('total-progress-container') as HTMLDivElement
// const downloadProgressContainer = document.getElementById('downloads-progress-container') as HTMLDivElement


const downloadManager = new MultiDownloadManager(urls)
// new DownloadVisualizer(downloadManager, totalProgressContainer, downloadProgressContainer)

downloadManager.fetchTotalFileSize()
// downloadManager.downloadAll()