import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

const PhotoUploader: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files);

            // create new URLs for the new files
            const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));

            // append to existing state
            setSelectedFiles(prev => [...prev, ...filesArray]);
            setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
    };

    useEffect(() => {
        return () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    return (
    <div className="flex flex-col gap-2">
        <button
            type="button"
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={() => fileInputRef.current?.click()}
        >
            Select Photos
        </button>

        <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            hidden
            multiple
            onChange={handleFileChange}
        />

        {previewUrls.length > 0 && (
            <div className="flex gap-2 flex-wrap">
            {previewUrls.map((url, i) => (
                <img
                key={i}
                src={url}
                alt={`Preview ${i}`}
                className="object-cover rounded border"
                style={{ width: 100, height: 'auto' }}
                />
            ))}
            </div>
        )}
    </div>
    );
};

export default PhotoUploader;