import api from '../api';
import toast from 'react-hot-toast';

// download pdf cu auth header
export async function downloadPdf(url, filename) {
    try {
        const response = await api.get(url, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);

        return true;
    } catch (err) {
        console.error('Download PDF failed:', err);
        toast.error('Nu s-a putut descarca PDF-ul. Te rog incearca din nou.');
        return false;
    }
}
