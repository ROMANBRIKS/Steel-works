import React, { useState, useEffect } from 'react';
import { auth, db, storage, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../hooks/useAuth';
import { LogIn, LogOut, Upload, Trash2, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('banner');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'images');
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setStatus({ type: null, message: '' });

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Ignore "popup closed by user" errors as they are expected user actions
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Login popup closed by user.");
      } else {
        console.error("Login failed:", error);
        setStatus({ type: 'error', message: `Login failed: ${error.message}` });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showEmbedModal, setShowEmbedModal] = useState<{ open: boolean, code: string }>({ open: false, code: '' });

  const addLog = (msg: string) => {
    console.log(`[AdminLog] ${msg}`);
    setDebugLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const compressImage = (file: File): Promise<{ dataUrl: string, width: number, height: number, sizeKB: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_WIDTH) {
            if (width > height) {
              height = (height / width) * MAX_WIDTH;
              width = MAX_WIDTH;
            } else {
              width = (width / height) * MAX_WIDTH;
              height = MAX_WIDTH;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const sizeKB = Math.round((dataUrl.length * 3/4) / 1024);
          resolve({ dataUrl, width: Math.round(width), height: Math.round(height), sizeKB });
        };
        img.onerror = () => reject(new Error('Image load error'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    // Check for large files (e.g. > 15MB)
    const MAX_SIZE = 15 * 1024 * 1024; 
    const oversizedFiles = Array.from(files).filter((f: File) => f.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      setStatus({ 
        type: 'error', 
        message: `Some files are too large (max 15MB). Please resize: ${oversizedFiles.map((f: File) => f.name).join(', ')}` 
      });
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length, percent: 0 });
    setStatus({ type: null, message: 'Starting upload process...' });
    addLog(`Starting batch upload of ${files.length} files`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(prev => ({ ...prev, current: i + 1, percent: 0 }));
      setStatus({ type: null, message: `Processing ${file.name}...` });
      addLog(`Processing: ${file.name}`);

      try {
        addLog(`Compressing...`);
        const { dataUrl, width, height, sizeKB } = await compressImage(file);
        addLog(`Compressed to ${width}x${height} (${sizeKB} KB)`);
        
        const storageRef = ref(storage, `images/${Date.now()}_${i}_${file.name}`);
        
        addLog(`Uploading to Cloud...`);
        setUploadProgress(prev => ({ ...prev, percent: 30 }));

        await uploadString(storageRef, dataUrl, 'data_url');
        
        addLog(`Storage success!`);
        setUploadProgress(prev => ({ ...prev, percent: 80 }));

        const downloadUrl = await getDownloadURL(storageRef);

        // Save to Firestore
        const docData = {
          url: downloadUrl,
          category,
          title: files.length === 1 ? title : (title ? `${title} (${i + 1})` : `Image ${i + 1}`),
          createdAt: serverTimestamp(),
          uploadedBy: user.uid,
          storagePath: storageRef.fullPath,
          base64: dataUrl // Store Base64 for the "Get Embed Code" feature
        };

        await addDoc(collection(db, 'images'), docData);
        addLog(`Success: ${file.name} is live.`);
        setUploadProgress(prev => ({ ...prev, percent: 100 }));
      } catch (error: any) {
        addLog(`FAILED: ${error.message}`);
        setStatus({ type: 'error', message: `Upload failed: ${error.message}` });
        setUploading(false);
        return;
      }
    }

    setStatus({ 
      type: 'success', 
      message: files.length === 1 ? 'Image uploaded successfully!' : `Successfully uploaded ${files.length} images!` 
    });
    setTitle('');
    setUploading(false);
    setUploadProgress({ current: 0, total: 0, percent: 0 });
    if (e.target) e.target.value = '';
    addLog(`Batch complete.`);
  };

  const handleDelete = async (image: any) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      // Delete from Storage
      if (image.storagePath) {
        const storageRef = ref(storage, image.storagePath);
        await deleteObject(storageRef);
      }
      // Delete from Firestore
      await deleteDoc(doc(db, 'images', image.id));
      setStatus({ type: 'success', message: 'Image deleted successfully!' });
    } catch (error) {
      console.error("Delete failed:", error);
      setStatus({ type: 'error', message: 'Failed to delete image.' });
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <ImageIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-gray-600 mb-6">Please log in with your authorized email to manage website content.</p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex items-center justify-center w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-red-500">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">Your account ({user.email}) is not authorized for admin access.</p>
          <button
            onClick={handleLogout}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign out and try another account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your cinematic banner and project galleries.</p>
            <p className="text-[10px] text-orange-600 font-bold mt-1 uppercase tracking-wider">
              Note: If using Brave Browser, disable "Shields" to allow database connection.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Local Folder Mode
                </h3>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  To use local images instead of Cloud Storage:
                </p>
                <ol className="text-[10px] text-blue-700 list-decimal ml-4 mt-2 space-y-1">
                  <li>Upload images to the <strong>public/assets/images/[category]</strong> folders in the file explorer.</li>
                  <li>Open <strong>src/constants/localImages.ts</strong>.</li>
                  <li>Add the filenames (e.g., 'photo.jpg') to the matching category list.</li>
                </ol>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload New Image
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="banner">Cinematic Banner</option>
                    <option value="gates">Main Gates</option>
                    <option value="steel-structures">Steel Structures</option>
                    <option value="underground-tanks">Underground Tanks</option>
                    <option value="surface-tanks">Surface Tanks</option>
                    <option value="filling-station-canopies">Fill Station Canopies</option>
                    <option value="billboard-frames">Billboard Frames</option>
                    <option value="bugler-proof">Bugler Proof</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Modern Sliding Gate"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      uploading ? 'bg-gray-50 border-gray-200' : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center w-full px-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress.percent}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-blue-600">
                          File {uploadProgress.current}/{uploadProgress.total} • {uploadProgress.percent}%
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-blue-400 mb-2" />
                        <span className="text-sm text-gray-600 font-medium text-center px-4">
                          Click to upload one or more images
                        </span>
                      </>
                    )}
                  </label>
                </div>

                <AnimatePresence>
                  {status.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                        status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      addLog("Testing connection...");
                      try {
                        // Test Firestore
                        const testDoc = doc(db, 'test', 'connection');
                        await getDoc(testDoc);
                        addLog("Firestore: SUCCESS");

                        // Test Storage
                        addLog("Testing Storage...");
                        const storageTestRef = ref(storage, 'test/connection.txt');
                        await uploadString(storageTestRef, 'test', 'raw');
                        addLog("Storage: SUCCESS");

                        setStatus({ type: 'success', message: 'All systems healthy.' });
                      } catch (e: any) {
                        addLog(`FAILED - ${e.message}`);
                        if (e.message.includes('permission')) {
                          addLog("Note: Permission error means connection IS working.");
                          setStatus({ type: 'success', message: 'Connection is working (Permission check passed).' });
                        } else {
                          setStatus({ 
                            type: 'error', 
                            message: 'Connection failed. Please ensure Brave Shields are OFF and you have a stable signal.' 
                          });
                        }
                      }
                    }}
                    className="flex-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-blue-600 transition-colors py-1 border border-gray-100 rounded bg-gray-50"
                  >
                    Test Connection
                  </button>
                  {debugLogs.length > 0 && (
                    <button
                      onClick={() => setDebugLogs([])}
                      className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 transition-colors py-1 px-2"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>

                {/* Debug Logs */}
                {debugLogs.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-900 rounded-lg font-mono text-[10px] text-gray-400 overflow-hidden">
                    <p className="text-blue-400 mb-1 uppercase tracking-widest font-bold">System Logs</p>
                    {debugLogs.map((log, idx) => (
                      <div key={idx} className="truncate">{log}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Current Images</h2>
              
              {images.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No images uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-48 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-3 flex items-center justify-between bg-white">
                        <div>
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                            {img.title || 'Untitled'}
                          </p>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {img.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {img.base64 && (
                            <button
                              onClick={() => {
                                const varName = 'img_' + (img.title || 'image').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                                const code = `// Embedded image: ${img.title || 'Untitled'}\nconst ${varName} = "${img.base64}";`;
                                setShowEmbedModal({ open: true, code });
                              }}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="Get Embed Code"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(img)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embed Code Modal */}
      <AnimatePresence>
        {showEmbedModal.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">📋 Embed Code</h3>
                <button 
                  onClick={() => setShowEmbedModal({ open: false, code: '' })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Copy this code to permanently include this image in your source files.
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs font-mono mb-6 whitespace-pre-wrap break-all max-h-60">
                {showEmbedModal.code}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(showEmbedModal.code);
                  alert('Code copied to clipboard!');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all"
              >
                Copy to Clipboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
