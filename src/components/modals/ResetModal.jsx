import React, { useState, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ResetModal = ({ isOpen, onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState(false);
    const inputRef = useRef(null);
    const correctWord = 'DELETE';

    const isConfirmValid = confirmText.toUpperCase() === correctWord;

    const handleClose = () => {
        setConfirmText('');
        setError(false);
        onClose();
    };

    const handleInputChange = (e) => {
        const val = e.target.value.toUpperCase();
        if (val.length <= correctWord.length) {
            setConfirmText(val);
            setError(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isConfirmValid) {
            setConfirmText('');
            setError(false);
            onConfirm();
        } else {
            setError(true);
        }
    };

    const handleSlotClick = () => {
        inputRef.current?.focus();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}></div>
            <div className="relative bg-stone-900 border-4 border-red-600 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-600/20 p-4 rounded-full mb-4 border-2 border-red-600">
                        <AlertTriangle size={48} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-red-400 uppercase tracking-wider mb-4">Delete Progress?</h2>
                    <p className="text-stone-300 mb-4">Are you sure you want to delete all progress for this profile? <span className="text-red-400 font-bold">This action is irreversible!</span></p>
                    <p className="text-stone-400 mb-4">Type <span className="text-red-400 font-bold">DELETE</span> to confirm:</p>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="relative w-full flex justify-center mb-4" onClick={handleSlotClick}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={confirmText}
                                onChange={handleInputChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                autoFocus
                                maxLength={correctWord.length}
                            />
                            <div className={`flex gap-1 justify-center cursor-pointer ${error ? 'animate-shake' : ''}`}>
                                {correctWord.split('').map((char, i) => (
                                    <div
                                        key={i}
                                        className={`w-10 h-12 border-b-4 flex items-center justify-center text-2xl font-mono font-bold text-white bg-black/20 rounded-t ${
                                            error ? 'border-red-500 bg-red-900/30' : (
                                                i < confirmText.length ? 'border-green-500' : 'border-gray-600'
                                            )
                                        }`}
                                    >
                                        {confirmText[i] || ''}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm mb-4">Please type DELETE to confirm.</p>}
                        <div className="flex gap-4 w-full">
                            <button type="button" onClick={handleClose} className="flex-1 bg-stone-700 hover:bg-stone-600 text-white py-3 px-6 rounded-lg font-bold uppercase tracking-wider transition-all border-2 border-stone-500">
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={!isConfirmValid}
                                className={`flex-1 py-3 px-6 rounded-lg font-bold uppercase tracking-wider transition-all border-2 ${
                                    isConfirmValid 
                                        ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 cursor-pointer' 
                                        : 'bg-stone-800 text-stone-500 border-stone-600 cursor-not-allowed'
                                }`}
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetModal;
