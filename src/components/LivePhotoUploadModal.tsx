import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  Scale, 
  Percent, 
  Coins, 
  ShieldCheck,
  SwitchCamera,
  AlertCircle,
  FileImage,
  Trash2,
  ArrowRight,
  Info,
  HelpCircle,
  Lock,
  EyeOff,
  Sun
} from 'lucide-react';
import { ExchangeScrapData } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { apiUrl } from '../utils/api';

interface LivePhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrapValued: (data: ExchangeScrapData) => void;
  targetProductName?: string;
}

export const LivePhotoUploadModal: React.FC<LivePhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onScrapValued,
  targetProductName,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [rawSnappedImage, setRawSnappedImage] = useState<string | null>(null);
  const [isLightingBoosted, setIsLightingBoosted] = useState<boolean>(false);
  
  // Imitation / Rold Gold Scrap Parameters
  const [description, setDescription] = useState<string>('Old Broken Imitation Bangles & Chain');
  const [gramsInput, setGramsInput] = useState<string>('');
  const [metalType, setMetalType] = useState<string>('Micro-Plated Rold Gold (1-Gram Polish Finish)');
  const [isAppraising, setIsAppraising] = useState<boolean>(false);
  const [valuationResult, setValuationResult] = useState<ExchangeScrapData | null>(null);
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingCameraRef = useRef<boolean>(false);

  // Metal Rate Constants: Strictly Imitation / Rold Gold Scrap (₹0.30 to ₹0.35 per gram)
  const METAL_RATES: Record<string, { rate: number; label: string; purity: string; desc: string }> = {
    'Micro-Plated Rold Gold (1-Gram Polish Finish)': { 
      rate: 0.35, 
      label: 'Micro-Plated Rold Gold (1-Gram Polish Finish)', 
      purity: '22K Micro Plated Polish',
      desc: 'High-durability micro-gold plated necklaces, bangles, bridal pieces' 
    },
    'Mixed Broken Imitation Ornaments': { 
      rate: 0.33, 
      label: 'Mixed Broken Imitation Ornaments', 
      purity: 'Imitation Mixed',
      desc: 'Assorted broken chains, earrings, temple sets, loose stones' 
    },
    'Brass & Copper Core Imitation': { 
      rate: 0.32, 
      label: 'Brass & Copper Core Imitation', 
      purity: 'Imitation Core',
      desc: 'Traditional heavy brass/copper base ornaments' 
    },
    'Fashion / Alloy Core Scrap': { 
      rate: 0.30, 
      label: 'Fashion / Alloy Core Scrap', 
      purity: 'Alloy Core',
      desc: 'Modern zinc-alloy and lightweight costume jewelry' 
    },
  };

  // Stop and Release Camera Hardware
  const stopCamera = () => {
    isStartingCameraRef.current = false;
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
          track.enabled = false;
        } catch (e) {
          console.warn('Error stopping camera track:', e);
        }
      });
      streamRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
          track.enabled = false;
        } catch (e) {
          console.warn('Error stopping state track:', e);
        }
      });
    }

    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const currentSrc = videoRef.current.srcObject as MediaStream;
        if (currentSrc && currentSrc.getTracks) {
          currentSrc.getTracks().forEach((track) => {
            track.stop();
            track.enabled = false;
          });
        }
      } catch (e) {
        console.warn('Error releasing video srcObject:', e);
      }
      videoRef.current.srcObject = null;
    }

    setStream(null);
  };

  // Start Camera Stream Safely
  const startCamera = async () => {
    setCameraError(null);
    stopCamera();
    isStartingCameraRef.current = true;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      if (!isStartingCameraRef.current || !isOpen || activeTab !== 'camera' || Boolean(capturedImage)) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      isStartingCameraRef.current = false;
      console.warn('Camera access error:', err);
      setCameraError('Unable to open live camera feed. Please check camera permissions or upload a photo.');
    }
  };

  // Manage Camera on Lifecycle & Tab changes
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, capturedImage]);

  // Turn off camera when page loses visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
      } else if (isOpen && activeTab === 'camera' && !capturedImage) {
        startCamera();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopCamera();
    };
  }, [isOpen, activeTab, capturedImage]);

  if (!isOpen) return null;

  // Clean numeric weight in grams
  const numericGrams = gramsInput === '' ? 0 : Math.max(0, parseFloat(gramsInput) || 0);

  // Calculation of potential value
  const currentRateObj = METAL_RATES[metalType] || METAL_RATES['Micro-Plated Rold Gold (1-Gram Polish Finish)'];
  const grossEstimated = numericGrams * currentRateObj.rate;
  const wastageValue = grossEstimated * 0.10;
  const netEstimated = numericGrams > 0 ? Math.max(1, Math.round(grossEstimated - wastageValue)) : 0;

  // Snap Photo from Video Stream with Intelligent Auto-Lighting
  const handleSnapPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      triggerHaptic('light');
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        // Capture raw frame first
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const rawDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setRawSnappedImage(rawDataUrl);

        // Measure average scene luminance across frame
        let avgLuminance = 128;
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;
          let totalLuminance = 0;
          let sampleCount = 0;
          for (let i = 0; i < d.length; i += 40) {
            totalLuminance += d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
            sampleCount++;
          }
          avgLuminance = totalLuminance / Math.max(1, sampleCount);
        } catch (e) {
          console.warn('Luminance check skipped', e);
        }

        // If scene is slightly dim (standard household/indoor ambient room light),
        // automatically boost exposure & contrast so gold luster, stones, and links stand out brightly for AI
        if (avgLuminance < 115) {
          ctx.filter = 'brightness(1.28) contrast(1.16) saturate(1.10)';
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.filter = 'none';
          setIsLightingBoosted(true);
        } else {
          setIsLightingBoosted(false);
        }

        const finalDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setCapturedImage(finalDataUrl);
        setValuationResult(null);
        setRejectionError(null);
        setIsVerified(false);
        stopCamera();
      }
    }
  };

  // Toggle or re-boost lighting and contrast on the current snapshot
  const handleToggleLightingBoost = () => {
    if (!capturedImage) return;
    triggerHaptic('light');

    if (isLightingBoosted && rawSnappedImage) {
      setCapturedImage(rawSnappedImage);
      setIsLightingBoosted(false);
      setValuationResult(null);
      setRejectionError(null);
      setIsVerified(false);
    } else {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.filter = 'brightness(1.32) contrast(1.18) saturate(1.12)';
          ctx.drawImage(img, 0, 0);
          const boostedUrl = canvas.toDataURL('image/jpeg', 0.88);
          setCapturedImage(boostedUrl);
          setIsLightingBoosted(true);
          setValuationResult(null);
          setRejectionError(null);
        }
      };
      img.src = rawSnappedImage || capturedImage;
    }
  };

  // Switch between front and rear cameras
  const toggleFacingMode = () => {
    triggerHaptic('light');
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerHaptic('light');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedImage(result);
        setRawSnappedImage(result);
        setIsLightingBoosted(false);
        setValuationResult(null);
        setRejectionError(null);
        setIsVerified(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      triggerHaptic('light');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedImage(result);
        setRawSnappedImage(result);
        setIsLightingBoosted(false);
        setValuationResult(null);
        setRejectionError(null);
        setIsVerified(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Request AI verification first. Weight is collected only after the image passes verification.
  const handleAppraise = async (): Promise<boolean> => {
    if (!capturedImage) {
      setRejectionError('Please snap or upload a clear image of your old imitation jewellery before verification.');
      return false;
    }

    setIsAppraising(true);
    setRejectionError(null);
    setValuationResult(null);
    triggerHaptic('light');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch(apiUrl('/api/appraise-scrap'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          imageBase64: capturedImage,
          metalType,
          description,
        }),
      });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok || data?.isRejected || data?.verified === false || data?.isJewellery === false) {
        setRejectionError(data?.message || 'This image could not be verified as eligible imitation jewellery. Please upload a clear jewellery image.');
        return false;
      }

      setRejectionError(null);
      triggerHaptic('success');
      return true;
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Appraisal verification failed:', err?.message || err);
      setRejectionError('Verification could not be completed. Please try again with a clear jewellery image.');
      return false;
    } finally {
      setIsAppraising(false);
    }
  };

  const calculateVerifiedValuation = () => {
    if (!capturedImage || rejectionError || !isVerified) {
      setRejectionError('Please complete successful jewellery image verification before calculating an exchange estimate.');
      return;
    }
    if (numericGrams <= 0) {
      setRejectionError('Enter the verified jewellery weight in grams to calculate the exchange estimate.');
      return;
    }
    const verifiedGross = Math.round(numericGrams * currentRateObj.rate * 100) / 100;
    const verifiedWastage = Math.round(verifiedGross * 0.10 * 100) / 100;
    const verifiedNet = Math.max(1, Math.round(verifiedGross - verifiedWastage));
    setValuationResult({
      id: `EX-${Date.now().toString().slice(-4)}`,
      description: description || 'Old Imitation Scrap Jewellery',
      metalType,
      grams: numericGrams,
      grossCredit: verifiedGross,
      netCredit: verifiedNet,
      livePhotoUrl: capturedImage,
      voucherCode: `RG-TRADE-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      status: 'Applied',
      notes: 'Image verified as eligible jewellery. Final weight and eligibility remain subject to physical verification where applicable.',
    });
    triggerHaptic('success');
  };

  const handleApplyVoucher = () => {
    if (!valuationResult || valuationResult.isRejected || rejectionError) {
      triggerHaptic('warning');
      setRejectionError('AI Photo Verification must pass before applying trade-in discount voucher to your cart.');
      return;
    }

    triggerHaptic('success');
    stopCamera();
    onScrapValued(valuationResult);
    onClose();
  };

  const handleRetakePhoto = () => {
    triggerHaptic('light');
    setCapturedImage(null);
    setRawSnappedImage(null);
    setIsLightingBoosted(false);
    setValuationResult(null);
    setRejectionError(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-3.5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm flex items-center gap-1.5">
                <span>Imitation &amp; Rold Gold Scrap Exchange</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-sm border border-amber-500/30">Instant Discount</span>
              </h3>
              <p className="text-xs text-stone-400">Photo verification required · Doorstep scale verification</p>
            </div>
          </div>
          <button 
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar bg-stone-950/40">

          {/* Verification Process Notice */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-stone-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-300">AI Gemmological Verification: </strong>
              To unlock exchange valuation, attach a clear photo of your old scrap imitation jewellery. Non-jewellery items will be rejected.
            </div>
          </div>

          {/* Rejection Alert Banner if Non-Jewellery Uploaded */}
          {rejectionError && (
            <div className={`rounded-2xl p-4 text-xs space-y-2 animate-in fade-in border ${
              false 
                ? 'bg-amber-950/90 border-amber-500/80 text-amber-200' 
                : 'bg-red-950/90 border-red-500/60 text-red-200'
            }`}>
              <div className="font-bold flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className={`w-4 h-4 shrink-0 ${false ? 'text-amber-400' : 'text-red-400'}`} />
                  <span className={false ? 'text-amber-300 font-bold' : 'text-red-300'}>
                    {false ? 'Doorstep Executive Verification Unlocked' : 'Jewellery Photo Verification Failed'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                  Attempt {3/3
                </span>
              </div>
              <p className={`text-[11.5px] leading-relaxed ${false ? 'text-amber-200/90' : 'text-red-200/90'}`}>
                {false 
                  ? 'Automatic verification was unsuccessful. Please upload a clear image of imitation/rold gold jewellery. Valuation remains locked until the image is successfully verified.'
                  : rejectionError}
              </p>
              <div className="pt-1 flex items-center gap-2 flex-wrap">
                {false && (
                  <div className="text-[11px] text-amber-200/80 px-1">
                    Upload a valid imitation/rold gold jewellery image to continue. Failed AI verification cannot unlock an exchange voucher.
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRetakePhoto}
                  className="bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Retake / Upload Other Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* Photo Capture / Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Scrap Photo (Mandatory Verification)</span>
                {capturedImage && !rejectionError && valuationResult && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded-sm font-bold">✓ Verified</span>
                )}
              </span>
              
              {!capturedImage && (
                <div className="flex bg-stone-800 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('camera');
                      startCamera();
                    }}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'camera' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
                    }`}
                  >
                    Live Camera
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('upload');
                      stopCamera();
                    }}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'upload' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              )}
            </div>

            {/* Stage: Live Camera vs Captured Image vs File Upload */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 min-h-[160px] max-h-[200px] flex items-center justify-center">
              {capturedImage ? (
                <div className="relative w-full h-44 group">
                  <img
                    src={capturedImage}
                    alt="Captured Scrap Jewellery"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Real-time AI Scanning Laser Effect when appraising */}
                  {isAppraising && (
                    <div className="absolute inset-0 bg-amber-500/15 flex flex-col items-center justify-center backdrop-blur-xs">
                      <div className="w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-[0_0_15px_#f59e0b] animate-pulse" />
                      <div className="bg-black/85 border border-amber-500/50 px-3 py-1.5 rounded-xl text-amber-300 font-bold text-xs flex items-center gap-2 mt-2 shadow-2xl">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>AI Gemmologist Analyzing Jewellery...</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-between p-3 pointer-events-auto">
                    <span className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg backdrop-blur-md ${
                      rejectionError
                        ? 'bg-red-950/80 text-red-300 border border-red-500/50'
                        : valuationResult
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                    }`}>
                      {rejectionError ? (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Verification Notice
                        </>
                      ) : valuationResult ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Jewellery
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {isLightingBoosted ? 'Auto-Lighting Boosted ✨' : 'Photo Attached'}
                        </>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleToggleLightingBoost}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-xs border transition-all ${
                          isLightingBoosted 
                            ? 'bg-amber-500/25 text-amber-300 border-amber-500/50' 
                            : 'bg-stone-900/80 text-stone-300 border-stone-700 hover:text-white'
                        }`}
                        title="Toggle lighting and contrast boost"
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isLightingBoosted ? 'Boosted ✨' : 'Boost Light'}</span>
                      </button>
                      <button
                        onClick={handleRetakePhoto}
                        className="bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 backdrop-blur-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Retake
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'camera' ? (
                <div className="relative w-full h-44 bg-black flex items-center justify-center">
                  {cameraError ? (
                    <div className="text-center p-4 space-y-2">
                      <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                      <p className="text-xs text-stone-400">{cameraError}</p>
                      <button
                        onClick={() => {
                          setActiveTab('upload');
                          fileInputRef.current?.click();
                        }}
                        className="bg-amber-500 text-stone-950 font-bold text-xs px-3 py-1.5 rounded-lg"
                      >
                        Upload Photo Instead
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="absolute inset-0 border-2 border-dashed border-amber-400/40 rounded-2xl pointer-events-none m-2"></div>
                      
                      {/* Live Camera Auto-Lighting Status Tag */}
                      <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-md z-10 pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Lighting: Auto-Optimized</span>
                      </div>
                      
                      {/* Camera Controls Overlay */}
                      <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-3">
                        <button
                          onClick={toggleFacingMode}
                          className="w-8 h-8 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 flex items-center justify-center backdrop-blur-xs hover:bg-stone-800"
                          title="Switch Camera"
                        >
                          <SwitchCamera className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleSnapPhoto}
                          className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Snap Photo</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-44 p-4 border-2 border-dashed border-stone-800 hover:border-amber-500/60 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-1.5 bg-stone-950"
                >
                  <Upload className="w-6 h-6 text-amber-400" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-stone-200">Tap to upload scrap jewellery picture</p>
                    <p className="text-[10px] text-stone-500">Supports JPG, PNG, WEBP (Broken sets, necklaces, bangles)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Scrap Specifications */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">2. Scrap Details &amp; Weight</span>
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showExplanation ? 'Hide Gram Guide' : 'What is 1-Gram vs 200g/300g?'}</span>
              </button>
            </div>

            {/* Explanatory Help Card */}
            {showExplanation && (
              <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-500/40 rounded-2xl p-3.5 space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Gram Weight &amp; "1-Gram Polish" Explained</span>
                </div>
                <div className="space-y-1.5 text-[11.5px] text-stone-300 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>
                      <strong className="text-stone-100">"1-Gram Polish" is the finish type:</strong> Micro-gold electroplated brass/copper imitation jewellery.
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>
                      <strong className="text-stone-100">Weight (50g, 200g, etc.):</strong> Scale weight of old broken jewellery to recycle.
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>
                      <strong className="text-stone-100">Example Payouts:</strong> 
                      <span className="text-emerald-300 font-bold ml-1">50g = ₹16 OFF</span> · 
                      <span className="text-emerald-300 font-bold ml-1">200g = ₹63 OFF</span> · 
                      <span className="text-emerald-300 font-bold ml-1">300g = ₹95 OFF</span>.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-stone-300 block text-[11px] font-semibold">Scrap Metal Category &amp; Polish</label>
              <select
                value={metalType}
                onChange={(e) => {
                  setMetalType(e.target.value);
                  setValuationResult(null);
                }}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-hidden focus:border-amber-500 font-medium"
              >
                {Object.keys(METAL_RATES).map((key) => (
                  <option key={key} value={key}>
                    {METAL_RATES[key].label} · ₹{METAL_RATES[key].rate.toFixed(2)}/g
                  </option>
                ))}
              </select>
              <p className="text-[10.5px] text-stone-400">
                {currentRateObj.desc}
              </p>
            </div>

            {/* Estimated Weight Input */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-stone-300 text-[11px] font-semibold flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enter Scrap Weight (Grams):</span>
                </label>
                <span className="text-[11px] text-amber-300 font-mono font-bold">
                  {numericGrams} g ({numericGrams >= 1000 ? `${(numericGrams / 1000).toFixed(2)} kg` : `${numericGrams} grams`})
                </span>
              </div>

              <div className="flex items-center gap-2 bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 focus-within:border-amber-500 transition-colors">
                <input
                  type="text"
                  inputMode="decimal"
                  value={gramsInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                      setGramsInput(val);
                      setValuationResult(null);
                      if (rejectionError) setRejectionError(null);
                    }
                  }}
                  placeholder="Enter weight (e.g. 50, 100, 200, 500)"
                  className="w-full bg-transparent text-sm font-bold text-stone-100 placeholder-stone-600 focus:outline-hidden"
                />
                <span className="text-amber-400 font-bold text-xs">Grams (g)</span>
              </div>

              {/* Quick Select Weight Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-stone-400 font-semibold mr-1">Quick Select:</span>
                {[
                  { label: '25g', val: '25' },
                  { label: '50g', val: '50' },
                  { label: '100g', val: '100' },
                  { label: '200g', val: '200' },
                  { label: '300g', val: '300' },
                  { label: '500g', val: '500' },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setGramsInput(chip.val);
                      setValuationResult(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      gramsInput === chip.val
                        ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-xs'
                        : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-amber-500/50 hover:text-white'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-stone-300 block mb-1 text-[11px] font-semibold">Description of Old Items (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setValuationResult(null);
                }}
                placeholder="e.g. 4 broken bangles, 2 old rold gold necklaces, loose earrings"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* STRICT VALUATION STATE CONTAINER */}
            {!valuationResult ? (
              <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800 space-y-2.5 text-xs text-center">
                <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-200 text-xs">
                    {rejectionError
                      ? 'Valuation Locked (Verification Failed)'
                      : !capturedImage
                      ? 'Exchange Valuation Locked: Photo Required'
                      : 'Photo Attached: AI Verification Required'}
                  </h4>
                  <p className="text-[11px] text-stone-400 max-w-xs mx-auto leading-relaxed">
                    {rejectionError
                      ? 'The uploaded photo was rejected as non-jewellery. Valuation cannot be generated.'
                      : !capturedImage
                      ? 'Snap or upload a photo of your old scrap jewellery to run AI Gemmological verification and unlock your cart cash discount.'
                      : 'Click "AI Camera Verification" below to verify authentic jewellery and calculate your certified trade-in discount.'}
                  </p>
                </div>
              </div>
            ) : (
              /* Verified Calculation Breakdown (Only visible when verified) */
              <div className="bg-stone-950 rounded-2xl p-3.5 border border-emerald-500/40 space-y-2 text-xs animate-in fade-in">
                <div className="font-bold text-[11px] text-emerald-300 uppercase tracking-wide flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Real-time Calculation</span>
                  </span>
                  <span className="text-stone-400 font-normal">10% melting deduction</span>
                </div>
                
                <div className="space-y-1 pt-1 border-t border-stone-800/80">
                  <div className="flex justify-between text-stone-400">
                    <span>Gross Scrap Value ({valuationResult.grams}g &times; ₹{currentRateObj.rate.toFixed(2)}/g):</span>
                    <span className="text-stone-200 font-medium font-mono">₹{valuationResult.grossCredit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>10% Wastage / Refining Allowance:</span>
                    <span className="text-red-400 font-medium font-mono">-₹{(valuationResult.grossCredit * 0.10).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-stone-800 pt-2 flex justify-between items-baseline font-bold">
                    <div>
                      <span className="text-emerald-400 block text-xs">Net Cash Discount on Cart:</span>
                      <span className="text-[10px] text-stone-500 font-normal">Physical scale verified at doorstep by Concierge</span>
                    </div>
                    <span className="text-xl text-emerald-300 font-mono">₹{valuationResult.netCredit.toLocaleString('en-IN')} OFF</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* AI Appraisal Results (Certified Badge) */}
          {valuationResult && (
            <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AI Gemmologist Certified Valuation</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-md border border-emerald-500/30">
                  {valuationResult.voucherCode}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {valuationResult.notes}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-emerald-500/30">
                <div>
                  <span className="text-[10px] text-emerald-400 block uppercase font-semibold">Deduction on Cart Bill</span>
                  <span className="text-xl font-extrabold text-emerald-300">₹{valuationResult.netCredit.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={handleApplyVoucher}
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Apply Voucher to Cart &rarr;
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions: Strictly Context-Aware (No unverified discount button) */}
        <div className="bg-stone-950 px-4 py-3.5 border-t border-stone-800 flex flex-col gap-2.5">
          {valuationResult ? (
            /* State 1: Verified - Can Apply */
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 block uppercase font-semibold">Certified Trade-in Credit:</span>
                  <span className="text-lg font-extrabold text-emerald-400">₹{valuationResult.netCredit.toLocaleString('en-IN')} OFF CART</span>
                </div>
                <span className="text-[10.5px] text-stone-400 font-mono">
                  {valuationResult.grams}g @ ₹{currentRateObj.rate.toFixed(2)}/g
                </span>
              </div>
              <button
                type="button"
                onClick={handleApplyVoucher}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-stone-950" />
                <span>Apply Verified ₹{valuationResult.netCredit.toLocaleString('en-IN')} Discount to Cart &rarr;</span>
              </button>
            </div>
          ) : rejectionError ? (
            /* State 2: Verification Notice - Offer Doorstep Verification immediately */
            <div className="flex flex-col gap-2">
              <div className="text-center py-1.5 px-3 bg-amber-950/40 border border-amber-500/30 rounded-xl">
                <span className="text-xs text-amber-200 font-medium block">
                  {rejectionError}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setRejectionError('Please verify the jewellery image successfully before any exchange value can be calculated.')}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md hover:brightness-110"
                >
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>Image verification required before exchange</span>
                </button>
                <button
                  type="button"
                  onClick={handleRetakePhoto}
                  className="bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-medium text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Retake</span>
                </button>
              </div>
              <p className="text-[10.5px] text-stone-400 text-center">
                ✨ Concierge executive will verify metal purity and calibrate weight on digital scale at doorstep collection.
              </p>
            </div>
          ) : capturedImage ? (
            /* State 3: Photo Attached, Needs Verification */
            <div className="flex flex-col gap-2">
              <div className="text-center py-0.5">
                <span className="text-xs text-amber-300 font-semibold block">
                  Photo attached {isLightingBoosted ? '(Auto-Lighting Boosted ✨)' : ''}. AI verification ready.
                </span>
              </div>
              <button
                type="button"
                onClick={handleAppraise}
                disabled={isAppraising}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 disabled:opacity-50 font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {isAppraising ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                    <span>Verifying Photo with AI Gemmologist...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-stone-950" />
                    <span>Verify Jewellery Image with AI &rarr;</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setRejectionError('Doorstep collection cannot unlock an exchange voucher before successful image verification.')}
                className="text-[11px] text-stone-400 hover:text-amber-300 py-1 transition-colors flex items-center justify-center gap-1"
              >
                <span>Image verification is required before entering weight or calculating an estimate.</span>
              </button>
            </div>
          ) : (
            /* State 4: No Photo Attached Yet */
            <div className="flex flex-col gap-2">
              <div className="text-center py-0.5">
                <span className="text-xs text-stone-400 font-medium block">📸 Please snap or upload a photo of your scrap jewellery to start.</span>
              </div>
              {activeTab === 'camera' ? (
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4 text-stone-950" />
                  <span>Snap Photo to Verify</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4 text-stone-950" />
                  <span>Upload Photo from Device</span>
                </button>
              )}
            </div>
          )}

          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="text-[11px] text-stone-400 hover:text-stone-200 underline font-medium"
            >
              Skip Scrap Exchange (Continue Regular Checkout)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
