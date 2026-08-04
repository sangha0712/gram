import React, { useState, useRef } from 'react';
import { X, ImagePlus, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { processMedia } from '../utils';

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const { addPost, currentUser } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [type, setType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setIsProcessing(true);
    try {
      const { url, type: mediaType } = await processMedia(selected);
      setFile(selected);
      setPreviewUrl(url);
      setType(mediaType);
    } catch (err) {
      alert("Failed to process file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = () => {
    if (!previewUrl) return;

    try {
      addPost({
        userId: currentUser.id,
        type,
        mediaUrl: previewUrl,
        caption
      });
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to create post. Storage quota exceeded?");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="border-b px-4 py-3 flex items-center justify-between font-semibold">
          <div className="w-20"></div>
          <div className="text-[15px]">새 게시물 만들기</div>
          <div className="w-20 flex justify-end items-center gap-3">
            {previewUrl && (
              <button onClick={handleShare} className="text-blue-500 hover:text-blue-700 text-[15px] font-semibold transition-colors">
                공유하기
              </button>
            )}
            <button onClick={onClose} className="text-gray-600 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
          {!previewUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
              {isProcessing ? (
                <Loader2 className="w-20 h-20 text-gray-300 animate-spin mb-6" />
              ) : (
                <ImagePlus className="w-20 h-20 text-gray-300 mb-6" />
              )}
              <h2 className="text-xl font-light mb-6 text-gray-800">여기에 사진과 동영상을 끌어다 놓으세요</h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
                disabled={isProcessing}
              >
                컴퓨터에서 선택
              </button>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <>
              <div className="flex-1 bg-black flex items-center justify-center min-h-[300px]">
                {type === 'video' ? (
                  <video src={previewUrl} controls className="w-full max-h-[60vh] object-contain" />
                ) : (
                  <img referrerPolicy="no-referrer" src={previewUrl} alt="Preview" className="w-full max-h-[60vh] object-contain" />
                )}
              </div>
              <div className="w-full md:w-[340px] border-l flex flex-col bg-white">
                <div className="p-4 flex items-center gap-3">
                  <img referrerPolicy="no-referrer" src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                  <span className="font-semibold text-sm">{currentUser.username}</span>
                </div>
                <textarea
                  placeholder="문구 입력..."
                  className="w-full p-4 outline-none resize-none flex-1 text-sm leading-relaxed"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={2200}
                />
                <div className="p-3 text-xs text-gray-300 text-right border-t">
                  {caption.length}/2200
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
