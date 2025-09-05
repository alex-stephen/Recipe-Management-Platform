import React, { useState, ChangeEvent, useRef } from 'react';
import Image from "next/image";

interface PhotoUploaderProps {
  onChange: (files: File[], base64s: string[]) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [base64Urls, setBase64Urls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const filesArray = Array.from(event.target.files);
    const newBase64Urls: string[] = [];

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          newBase64Urls.push(reader.result as string);

          // When all files have been read, update state
          if (newBase64Urls.length === filesArray.length) {
            const updatedFiles = [...selectedFiles, ...filesArray];
            const updatedBase64s = [...base64Urls, ...newBase64Urls];

            setSelectedFiles(updatedFiles);
            setBase64Urls(updatedBase64s);

            onChange(updatedFiles, updatedBase64s);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

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

            {base64Urls.length > 0 && (
                <div className="flex gap-4 flex-wrap">
                {base64Urls.map((url, i) => (
                    <div key={i} className="w-[100px] h-[100px] flex-shrink-0">
                    <Image
                        src={url}
                        alt={`Preview ${i}`}
                        fill
                        className="w-30 h-30 object-cover rounded border"
                    />
                    </div>
                ))}
                </div>
            )}
        </div>
    );
};

export default PhotoUploader;