import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

interface PhotoUploaderProps {
  onChange: (files: File[], urls: string[]) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onChange }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const filesArray = Array.from(event.target.files);
        const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));

        // Compute new state arrays
        const updatedFiles = [...selectedFiles, ...filesArray];
        const updatedUrls = [...previewUrls, ...newPreviewUrls];

        setSelectedFiles(updatedFiles);
        setPreviewUrls(updatedUrls);

        // send correct updated arrays to parent
        onChange(updatedFiles, updatedUrls);
    };

    useEffect(() => {
        return () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    return (
    <div>
        <div className="mb-4">
            <button
                type="button"
                className="block bg-gray-600 text-white px-4 py-2 rounded"
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
        </div>

        {previewUrls.length > 0 && (
            <div className="flex gap-4 flex-wrap">
            {previewUrls.map((url, i) => (
                <div key={i} className="w-[100px] h-[100px] flex-shrink-0">
                <img
                    src={url}
                    alt={`Preview ${i}`}
                    className="object-cover rounded border"
                    style={{ width: 100, height: 100 }}
                />
                </div>
            ))}
            </div>
        )}
    </div>
    );
};

export default PhotoUploader;