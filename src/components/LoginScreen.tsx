import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  Phone, 
  User, 
  Mail, 
  MapPin, 
  ArrowRight, 
  RotateCw, 
  CheckCircle2, 
  HelpCircle,
  Truck,
  Gem,
} from 'lucide-react';
import { UserProfile } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onExploreAsGuest: () => void;
  initialPhone?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onExploreAsGuest,
  initialPhone = '',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState<string>(initialPhone);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [pincode, setPincode] = useState<string>('534001');
  const [address, setAddress] = useState<string>('');
  
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [mockGeneratedOtp, setMockGeneratedOtp] = useState<string>('4812');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      triggerHaptic('warning');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full name to register your patron vault.');
      triggerHaptic('warning');
      return;
    }

    triggerHaptic('medium');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generated = Math.floor(1000 + Math.random() * 9000).toString();
      setMockGeneratedOtp(generated);
      setOtpStep(true);
      triggerHaptic('success');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (otp.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code.');
      triggerHaptic('warning');
      return;
    }

    triggerHaptic('medium');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Construct user profile
      const userProfile: UserProfile = {
        name: name.trim() || 'Sai Kishor',
        phone: phone.trim().startsWith('+91') ? phone.trim() : `+91 ${phone.trim()}`,
        email: email.trim() || 'b.saikishor365@gmail.com',
        address: address.trim() || 'Boutique Residence, Main Bazaar',
        pincode: pincode.trim() || '534001',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };

      triggerHaptic('success');
      onLoginSuccess(userProfile);
    }, 500);
  };

  const handleQuickDemoFill = () => {
    triggerHaptic('light');
    setPhone('9848022338');
    setName('Sai Kishor');
    setEmail('b.saikishor365@gmail.com');
    setPincode('534001');
    setAddress('Boutique Residence, Main Bazaar, Eluru');
    setErrorMsg(null);
  };

  return (
    <div className="rg-approved-auth fixed inset-0 z-50 min-h-screen w-full rg-page text-stone-100 flex flex-col justify-between overflow-y-auto font-sans">
      {/* Ambient Luxury Background Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-lg mx-auto px-6 pt-6 pb-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent font-serif uppercase">
              RoldyGoldy
            </h1>
            <p className="text-[10px] text-stone-400 tracking-widest uppercase">Premium imitation jewellery</p>
          </div>
        </div>
      </header>

      {/* Central Login & Registration Form Card */}
      <main className="w-full max-w-md mx-auto px-5 py-4 z-10 flex-1 flex flex-col justify-center">
        <div className="rg-surface rounded-[28px] p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
          
          {/* Headline & Value Proposition */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Secure Mobile Access</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-stone-100">
              {mode === 'login' ? 'Welcome to RoldyGoldy' : 'Create your account'}
            </h2>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              Trial@Home starts from ₹49/- only · Instant Old Gold & Scrap Exchange
            </p>
          </div>

          {/* Mode Switch Tabs */}
          {!otpStep && (
            <div className="grid grid-cols-2 p-1 bg-stone-950 border border-stone-800 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                New Registration
              </button>
            </div>
          )}

          {/* Error Message Box */}
          {errorMsg && (
            <div className="bg-red-950/60 border border-red-500/40 text-red-300 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Input Mobile & Details */}
          {!otpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sai Kishor"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-stone-100 outline-none text-xs"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mobile Number *</span>
                </label>
                <div className="flex gap-2">
                  <span className="bg-stone-950 border border-stone-800 text-stone-400 px-3 py-2.5 rounded-xl font-mono text-xs flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    className="flex-1 bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-stone-100 outline-none font-mono text-xs tracking-wider"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>Email (Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-stone-100 outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Delivery PIN *</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 534001"
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-stone-100 outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Doorstep Delivery Address (Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat, Landmark, Street"
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-stone-100 outline-none text-xs"
                    />
                  </div>
                </>
              )}

              {/* Quick Auto-Fill Demo Button */}
              <div className="flex justify-between items-center pt-1 text-[11px]">
                <span className="text-stone-500">Fast preview testing?</span>
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Quick demo fill
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-stone-950 font-bold py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Get Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span>Sent to +91 {phone}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(false);
                      setOtp('');
                    }}
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    Change
                  </button>
                </div>
                <div className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>A verification code has been sent to your registered mobile number.</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-300 font-semibold block text-center">
                  Enter 4-Digit OTP Code
                </label>
                <div className="flex justify-center gap-3">
                  <input
                    type="text"
                    maxLength={4}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-36 bg-stone-950 border-2 border-amber-500/50 focus:border-amber-400 rounded-2xl py-3 text-center text-xl font-mono tracking-widest text-amber-300 outline-none shadow-inner"
                  />
                </div>
                {/* One click fill OTP button */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setOtp(mockGeneratedOtp)}
                    className="text-[11px] text-stone-400 hover:text-amber-300 underline"
                  >
                    Demo OTP ({mockGeneratedOtp})
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-stone-950 font-bold py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify &amp; Continue</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Guest Exploration Alternative */}
          <div className="pt-2 border-t border-stone-800 text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onExploreAsGuest();
              }}
              className="text-stone-400 hover:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto py-1"
            >
              <span>Explore as Guest</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
            </button>
            <p className="text-[10px] text-stone-500">
              Explore the catalogue before signing in. Sign in when a feature requires your mobile verification.
            </p>
          </div>

        </div>

        {/* Value Assurance Badges */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10.5px] text-stone-400">
          <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl p-2 flex flex-col items-center gap-1">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-stone-300">Trial Starts ₹49/-</span>
            <span className="text-[9.5px] text-stone-500">100% Credited</span>
          </div>
          <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl p-2 flex flex-col items-center gap-1">
            <Gem className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-stone-300">24K Micro Gold</span>
            <span className="text-[9.5px] text-stone-500">BIS Hallmarked</span>
          </div>
          <div className="bg-stone-900/50 border border-stone-800/80 rounded-xl p-2 flex flex-col items-center gap-1">
            <Truck className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-stone-300">Insured Delivery</span>
            <span className="text-[9.5px] text-stone-500">Sanitized Valet</span>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-lg mx-auto px-6 py-4 text-center text-[10.5px] text-stone-500 z-10">
        <p>© 2026 RoldyGoldy Boutique · Eluru &amp; Machilipatnam Guild Heritage</p>
      </footer>
    </div>
  );
};
