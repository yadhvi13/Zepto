import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { sfx } from '../utils/sfx';
import zeptoLogo from '../assets/zepto.png';

export default function Auth({ onLoginSuccess, soundEnabled }) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone'); // phone -> otp -> success
  const [otpVal, setOtpVal] = useState(['', '', '', '']);
  const [serverOtp, setServerOtp] = useState('');
  const [smsNotification, setSmsNotification] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Resend code countdown timer
  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle phone submission
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      if (soundEnabled) sfx.play('remove');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    if (soundEnabled) sfx.play('click');

    try {
      const formattedPhone = `+91${phone}`; // Seed prefix
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone })
      });

      const data = await res.json();
      if (res.ok) {
        setServerOtp(data.demoOtp);
        setStep('otp');
        setTimer(30);
        setLoading(false);
        if (soundEnabled) sfx.play('bell');

        // Trigger SMS simulated notification alert after 1.2s
        setTimeout(() => {
          if (soundEnabled) sfx.play('bubble');
          setSmsNotification({
            sender: 'OTP Gateway',
            text: `Zepto Verification Code: ${data.demoOtp}. Valid for 5 minutes.`
          });
        }, 1200);
      } else {
        setErrorMsg(data.message || 'OTP delivery failed. Try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to reach backend server. Running mock connection...');
      
      // Local mock login fallback
      const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setServerOtp(mockOtp);
      setStep('otp');
      setTimer(30);
      setLoading(false);
      setTimeout(() => {
        setSmsNotification({
          sender: 'OTP Gateway (Demo Mode)',
          text: `Zepto Verification Code: ${mockOtp}. Valid for 5 minutes.`
        });
      }, 1000);
    }
  };

  // Handle OTP digit inputs
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // numbers only
    
    const newOtp = [...otpVal];
    newOtp[index] = value.slice(-1); // keep last digit
    setOtpVal(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  // Backspacing support
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpVal[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Resend OTP trigger
  const handleResend = () => {
    setOtpVal(['', '', '', '']);
    setErrorMsg('');
    setSmsNotification(null);
    handleSendOtp({ preventDefault: () => {} });
  };

  // Submit OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otpVal.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please input all 4 digits.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const formattedPhone = `+91${phone}`;
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, otp: enteredOtp })
      });

      const data = await res.json();
      if (res.ok) {
        if (soundEnabled) sfx.play('success');
        setStep('success');
        setLoading(false);

        // Notify parent context after 1.5s success animation
        setTimeout(() => {
          onLoginSuccess(data.token, data.user);
        }, 1500);
      } else {
        setErrorMsg(data.message || 'OTP verification failed. Please try again.');
        setLoading(false);
        if (soundEnabled) sfx.play('remove');
      }
    } catch (err) {
      console.error(err);
      // Mock validation fallback
      if (enteredOtp === serverOtp) {
        if (soundEnabled) sfx.play('success');
        setStep('success');
        setLoading(false);
        setTimeout(() => {
          onLoginSuccess('mock_token_abc123', {
            phone: `+91${phone}`,
            cart: []
          });
        }, 1500);
      } else {
        setErrorMsg('Incorrect OTP. Check your simulated push notification code.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAD7B5]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 select-none animate-fade-in">
      
      {/* Simulated SMS Push notification banner */}
      {smsNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-sm bg-white/90 backdrop-blur-md border border-slate-200/50 p-3.5 rounded-2xl shadow-2xl flex items-start gap-3 z-55 animate-slide-in">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left flex-grow">
            <h5 className="text-xs font-black text-slate-900">{smsNotification.sender}</h5>
            <p className="text-[11px] text-slate-700 font-semibold mt-0.5 leading-snug">{smsNotification.text}</p>
          </div>
          <button 
            onClick={() => setSmsNotification(null)}
            className="text-[10px] text-rose-500 hover:text-rose-700 font-extrabold cursor-pointer shrink-0 mt-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/30 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Abstract design elements */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-primary/10 blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-pink-accent/10 blur-xl pointer-events-none"></div>

        {step === 'phone' && (
          /* Phone Input screen */
          <div>
            <div className="flex flex-col items-center text-center mt-4 mb-8">
              {/* Zepto Logo Image */}
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/50 shadow-md flex items-center justify-center mb-4 p-2">
                <img src={zeptoLogo} alt="Zepto Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-xs font-bold text-accent-violet rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5 text-pink-accent animate-pulse" />
                <span>MERN Fullstack Sync Active</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Welcome to zepto<span className="text-primary">AI</span></h2>
              <p className="text-xs text-slate-655 font-semibold mt-1">Verify your phone to start ordering and sync your fridge.</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex gap-2.5 items-start text-left text-xs text-rose-700 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">Mobile Phone Number</label>
                <div className="flex gap-2.5">
                  <div className="px-3.5 py-3 rounded-xl bg-white/40 border border-slate-200 text-slate-800 text-sm font-extrabold flex items-center justify-center shadow-sm">
                    +91
                  </div>
                  <div className="relative flex-grow">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="tel"
                      pattern="[0-9]{10}"
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-bold focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-pink-accent hover:opacity-95 text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send Verification Code'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          /* OTP Input screen */
          <div>
            <div className="flex flex-col items-center text-center mt-4 mb-8">
              <h2 className="text-2xl font-black text-slate-900">Enter Verification Code</h2>
              <p className="text-xs text-slate-655 font-semibold mt-1">We sent a 4-digit verification code to +91 {phone}</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex gap-2.5 items-start text-left text-xs text-rose-700 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-between gap-3 max-w-xs mx-auto">
                {otpVal.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    pattern="[0-9]"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-14 h-14 text-center rounded-xl bg-white/40 border border-slate-200 text-slate-900 text-lg font-black focus:outline-none focus:border-primary/50 focus:bg-white/80 shadow-sm"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otpVal.join('').length < 4}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-pink-accent hover:opacity-95 text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <span className="text-xs text-slate-400 font-semibold">Resend code in {timer}s</span>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleResend}
                    className="text-xs text-accent-violet hover:underline font-extrabold cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {step === 'success' && (
          /* Successful Login screen */
          <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Verification Successful</h3>
            <p className="text-xs text-slate-550 font-semibold">Creating secure MERN session. Syncing grocery data...</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200/50 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold">
          <ShieldCheck className="w-4 h-4 text-accent-violet" />
          <span>Secured with standard TLS &bull; OTP Verification</span>
        </div>

      </div>
    </div>
  );
}
