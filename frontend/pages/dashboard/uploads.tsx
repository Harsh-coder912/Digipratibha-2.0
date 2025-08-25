import Head from 'next/head';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../../lib/api';

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadsPage() {
  const [uploads, setUploads] = useState<Array<{ url: string; name: string; mimeType: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      for (const file of acceptedFiles) {
        const dataUrl = await readAsDataURL(file);
        const res = await api.uploadDocument({ file: dataUrl, fileName: file.name, mimeType: file.type });
        setUploads((prev) => [{ url: res.url, name: file.name, mimeType: file.type }, ...prev]);
      }
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <Head>
        <title>Uploads - DigiPratibha</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div {...getRootProps()} className={`border-2 border-dashed rounded p-8 bg-white text-center ${isDragActive ? 'border-blue-600' : 'border-gray-300'}`}>
            <input {...getInputProps()} />
            <p className="mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-gray-500">Images (PNG, JPG, WEBP) and PDFs supported.</p>
            {isUploading && <p className="mt-2 text-blue-600">Uploading...</p>}
          </div>

          <h2 className="font-semibold mt-6 mb-3">Recent Uploads</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploads.map((u, idx) => (
              <a key={idx} href={u.url} target="_blank" rel="noreferrer" className="block bg-white rounded shadow p-3 hover:shadow-md">
                <div className="h-28 flex items-center justify-center bg-gray-50 rounded mb-2">
                  {u.mimeType.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.url} alt={u.name} className="max-h-24" />
                  ) : (
                    <span className="text-gray-500">PDF</span>
                  )}
                </div>
                <div className="text-sm truncate" title={u.name}>{u.name}</div>
              </a>
            ))}
            {uploads.length === 0 && <div className="text-sm text-gray-600">No uploads yet.</div>}
          </div>
        </div>
      </main>
    </>
  );
}


