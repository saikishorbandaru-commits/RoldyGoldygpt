import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Phone, 
  KeyRound, 
  User, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialPhone?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialPhone = ''
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [phone, setPhone] = useState<string>(initialPhone || '9876543210');
  const [otp, setOtp] = useState<string>('8421');
  const [fullName, setFullName] = useState<string>('Meera Sharma');
  const [email, setEmail] = useState<string>('meera.sharma@example.com');
  const [pincode, setPincode] = useState<string>('500101');
  const [locality, setLocality] = useState<string>('Banjara Hills, Hyderabad');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    triggerHaptic('light');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setErrorMsg('Please enter the 4-digit OTP');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);
    triggerHaptic('success');

    setTimeout(() => {
      setIsVerifying(false);
      // If user profile is already prefilled, finish or ask for name
      if (fullName) {
        completeAuth();
      } else {
        setStep('register');
      }
    }, 600);
  };

  const completeAuth = () => {
    const user: UserProfile = {
      name: fullName.trim() || 'Valued Jewellery Connoisseur',
      phone: `+91 ${phone}`,
      email: email.trim() || 'customer@roldygoldy.com',
      pincode: pincode.trim() || '500101',
      address: locality.trim() || 'Hyderabad Flagship Concierge Zone',
      savedAddresses: [
        {
          id: 'addr-1',
          tag: 'Home',
          recipientName: fullName.trim() || 'Meera Sharma',
          phone: `+91 ${phone}`,
          fullAddress: `${locality}, ${pincode}`,
          pincode: pincode,
          isDefault: true
        }
      ]
    };
    triggerHaptic('success');
    onLoginSuccess(user);
    onClose();
  };

  const handleGuestContinue = () => {
    triggerHaptic('light');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rg-sheet border border-amber-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 font-bold shadow-md">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-100 text-sm">
                ROLDY GOLDY PRIVILEGE
              </h3>
              <p className="text-[11px] text-stone-400">
                {step === 'phone' ? 'Login or Create New Account' : step === 'otp' ? 'Instant OTP Verification' : 'Welcome to Luxury Concierge'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full rg-sheet border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Step 1: Mobile Phone */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-serif font-bold text-stone-200 text-base">
                  Sign in with Mobile Number
                </h4>
                <p className="text-xs text-stone-400">
                  Access 20-min doorstep home trial, scrap exchange valuation, and master jeweller bargaining.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mobile Number</span>
                </label>
                <div className="flex items-center rounded-xl bg-stone-950 border border-stone-800 focus-within:border-amber-500 px-3 py-2.5">
                  <span className="text-stone-400 text-xs font-bold mr-2 pr-2 border-r border-stone-800">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full bg-transparent text-sm text-stone-100 font-mono tracking-wider focus:outline-none placeholder:text-stone-600"
                    autoFocus
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/60">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-stone-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Get OTP Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Guest / Skip Option */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleGuestContinue}
                  className="text-xs text-stone-400 hover:text-amber-300 transition-colors underline"
                >
                  Skip &amp; Explore Boutique as Guest
                </button>
              </div>
            </form>
          )}

          {/* Step 2: 4-digit OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-serif font-bold text-stone-200 text-base">
                  Verify 4-Digit Security Code
                </h4>
                <p className="text-xs text-stone-400">
                  We sent a code to <span className="text-amber-300 font-bold font-mono">+91 {phone}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5 justify-center">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enter 4-digit OTP</span>
                </label>
                <div className="flex justify-center gap-3 py-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-40 text-center tracking-[0.6em] text-2xl font-mono font-extrabold bg-stone-950 border border-amber-500/60 text-amber-300 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoFocus
                  />
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setOtp('8421')}
                    className="text-[11px] text-amber-400/90 hover:text-amber-300 underline"
                  >
                    Auto-fill demo code: 8421
                  </button>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/60 text-center">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-stone-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Proceed</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="hover:text-stone-200"
                >
                  Change number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setOtp('8421');
                  }}
                  className="text-amber-400 hover:underline"
                >
                  Resend SMS
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Registration Profile Details */}
          {step === 'register' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-serif font-bold text-stone-200 text-base">
                  Complete Your Profile
                </h4>
                <p className="text-xs text-stone-400">
                  Enjoy personalized 20-min home trial delivery and doorstep scrap exchange.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Meera Sharma"
                    className="w-full rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 px-3 py-2 text-xs text-stone-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Delivery Pincode</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="500101"
                    className="w-full rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">
                    Locality / Address
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Banjara Hills, Hyderabad"
                    className="w-full rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 px-3 py-2 text-xs text-stone-100 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={completeAuth}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-stone-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Enter Roldy Goldy Boutique</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Security Assurance footer */}
          <div className="pt-2 border-t border-stone-800/80 flex items-center justify-center gap-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted · Verified Artisan Guild Partner</span>
          </div>

        </div>

      </div>
    </div>
  );
};
