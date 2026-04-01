import React from 'react';
import { 
  Facebook, Instagram, Linkedin, MessageCircle, ArrowRight, Heart, Brain, Sparkles, 
  ShieldCheck, BookOpen, Users, Lightbulb, UserPlus, Stethoscope, Home, Info, 
  AlertTriangle, UserCheck, TrendingUp, Moon, Coffee, Workflow, Activity, Smile
} from 'lucide-react';

interface FrontPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const FrontPage: React.FC<FrontPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="min-h-screen bg-[#fdfbe6] font-sans text-gray-800">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
  <img
    src="/images/mono.png"
    alt="MonoSporsho Logo"
    className="h-10 w-auto object-contain"
  />
</div>

          <div>
            <h1 className="text-2xl font-black text-[#7c69f0] leading-none">MonoSporsho</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Mental Health & Wellness</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-3">
            {/* <button className="px-4 py-1.5 bg-[#a7c7f4] text-gray-800 text-sm font-bold rounded-lg hover:bg-[#96b6e3] transition">About us</button> */}
            <button onClick={onLogin} className="px-4 py-1.5 bg-[#a7c7f4] text-gray-800 text-sm font-bold rounded-lg hover:bg-[#96b6e3] transition">Login</button>
            <button onClick={onSignup} className="px-4 py-1.5 bg-[#a7c7f4] text-gray-800 text-sm font-bold rounded-lg hover:bg-[#96b6e3] transition">Signup</button>
          </div>
          <p className="max-w-md text-right text-[15px] font-bold text-[#1e3a8a] leading-tight">
            We are here to monitor your emotional well-being and manage stress in a private and accessible way. Track. Reflect. Heal.
          </p>
        </div>
      </header>
 <div className="flex-1 h-[2px] bg-gray-400"></div>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-5xl md:text-7xl font-black text-[#b91c1c] tracking-tighter">MonoSporsho</h2>
            <p className="text-xl md:text-3xl font-bold text-[#1e3a8a]">A safe space for your mind</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-8 h-8 bg-[#1877f2] rounded-full flex items-center justify-center text-white">
                <Facebook size={16} fill="currentColor" />
              </div>
              <span className="font-medium text-base text-gray-700 group-hover:text-[#1877f2] transition">mono.facebook.com</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-8 h-8 bg-[#25d366] rounded-full flex items-center justify-center text-white">
                <MessageCircle size={16} fill="currentColor" />
              </div>
              <span className="font-medium text-base text-gray-700 group-hover:text-[#25d366] transition">mono.whatsapp.com</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full flex items-center justify-center text-white">
                <Instagram size={16} />
              </div>
              <span className="font-medium text-base text-gray-700 group-hover:text-[#ee2a7b] transition">mono.instagram.com</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-[#fbdcdc] rounded-t-full flex items-center justify-center p-12">
            <div className="relative w-full h-full flex items-center justify-center">
              <Heart size={200} className="text-[#b91c1c] opacity-20 absolute" fill="#b91c1c" />
              <Brain size={120} className="text-[#b91c1c] relative z-10" />
              <Sparkles size={40} className="text-[#f4a7a7] absolute top-10 right-10 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#f4a7a7] rounded-full opacity-20 blur-xl"></div>
        </div>
      </section>

      {/* Motive Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-[#b91c1c] text-center mb-10 tracking-tight">Our motive for mental health</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Sound Mind", desc: "By combining science and empathy, it supports mental clarity, balance and emotional well-being", img:"/images/soundMind1.png", color: "#fbdcdc" },
              { title: "Inspiration", desc: "It helps users find meaning even in small progress and keep moving forward", img:"/images/inspiration1.png", color: "#fbdcdc" },
              { title: "Self-love", desc: "Daily affirmations and gentle practices help rebuild a healthy relationship with oneself", img:"/images/selfLove.png", color: "#fbdcdc" },
              { title: "Confidence", desc: "By recognizing growth, achievements, and emotional strength, the app boosts self-belief", img:"/images/confidence.png", color: "#fbdcdc" }
            ].map((item, i) => (
              <div key={i} className="bg-[#fbdcdc] p-6 rounded-2xl space-y-4 flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 flex items-center justify-center">
  <img 
  src={item.img} 
  alt={item.title} 
  className="w-24 h-24 object-contain"
/>
</div>
                <h3 className="text-xl font-black text-[#b91c1c]">{item.title}</h3>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-12 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 relative">
          {/* Hourglass Background Shape */}
          <div className="absolute left-0 top-0 w-24 h-full opacity-10 pointer-events-none hidden md:block">
            <div className="w-full h-1/2 bg-[#f4a7a7]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>
            <div className="w-full h-1/2 bg-[#f4a7a7]" style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)' }}></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-[#b91c1c] tracking-tight relative z-10">How does it work?</h2>
          <div className="space-y-6 relative z-10">
            {[
              "collect and store your mental health records",
              "provide motivational contents and positive affirmations",
              "display progress dashboard of emotional well-being",
              "provide daily inspirational notifications",
              "make sure to upgrade your mental health"
            ].map((step, i) => (
              <div key={i} className="flex items-center space-x-6 group">
                <div className="w-10 h-10 bg-white border-2 border-gray-800 rounded-full flex items-center justify-center text-xl font-black shrink-0 group-hover:bg-gray-800 group-hover:text-white transition shadow-sm">
                  {i + 1}
                </div>
                <p className="text-lg font-bold text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px]">
          <div className="relative w-full h-full flex items-center justify-center">
            <Workflow size={180} className="text-[#a7c7f4] opacity-40 absolute" />
            <Activity size={100} className="text-[#7c69f0] relative z-10" />
            <ShieldCheck size={40} className="text-[#25d366] absolute bottom-10 right-10" />
          </div>
        </div>
      </section>

      {/* Library Section */}
      <section className="bg-[#fdfbe6] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-2 mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-[#b91c1c] tracking-tight">Our mental Health Library</h2>
          <p className="text-lg font-bold text-gray-600">Explore and visit a rich library of credible and accurate mental health insights</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Mental health conditions", icon: Stethoscope, color: "#fbdcdc" },
            { title: "What keeps a family together?", icon: Home, color: "#eef3e8" },
            { title: "What is mental health?", icon: Info, color: "#fdfbe6" },
            { title: "The effects of trauma", icon: AlertTriangle, color: "#fbdcdc" },
            { title: "Woman Empowerment", icon: UserCheck, color: "#eef3e8" },
            { title: "Empathy and self growth", icon: TrendingUp, color: "#fdfbe6" },
            { title: "Facing Luteal phase", icon: Moon, color: "#fbdcdc" },
            { title: "Self-care strategies", icon: Coffee, color: "#eef3e8" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 flex items-center justify-center bg-gray-50 group-hover:bg-white transition">
                <item.icon size={64} className="text-[#b91c1c] opacity-60 group-hover:opacity-100 transition-all group-hover:scale-110" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <h3 className="font-bold text-gray-800 text-sm text-center">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fdfbe6] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="bg-[#fbdcdc] p-8 md:p-12 rounded-[2.5rem] grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-gray-900">Why you will choose us?</h3>
              <p className="text-base font-medium text-gray-700 leading-relaxed">
                Emotional, psychological, and social well-being is a right for everyone. We respond to mental health challenges by providing education, care, and empowerment. With reliable information, inclusive services, and compassionate communities, we help people build self-understanding, genuine connections, and better well-being.
              </p>
              <div className="pt-2">
                <p className="text-lg font-black text-[#b91c1c]">Made with ❤️ by MonoSporsho.com</p>
                <p className="text-xs text-gray-600 font-medium">We address mental health challenges by educating, supporting, and empowering individuals.</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-black text-gray-900">Company</h3>
              <ul className="space-y-2 text-base font-bold text-gray-600">
                <li className="hover:text-[#b91c1c] cursor-pointer transition">About Us</li>
                <li className="hover:text-[#b91c1c] cursor-pointer transition">Our Vision</li>
                <li className="hover:text-[#b91c1c] cursor-pointer transition">Leadership</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-black text-gray-900">Resources</h3>
              <ul className="space-y-2 text-base font-bold text-gray-600">
                <li className="hover:text-[#b91c1c] cursor-pointer transition">Library</li>
                <li className="hover:text-[#b91c1c] cursor-pointer transition">Perspectives</li>
                <li className="hover:text-[#b91c1c] cursor-pointer transition">Tools</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex flex-col items-center space-y-1">
            <h4 className="text-lg font-black text-[#7c69f0]">MonoSporsho</h4>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Mental Health & Wellness</p>
          </div>
          
          <div className="flex justify-center space-x-5">
            <Facebook className="text-gray-800 hover:text-[#1877f2] cursor-pointer transition" size={28} fill="currentColor" />
            <Instagram className="text-gray-800 hover:text-[#ee2a7b] cursor-pointer transition" size={28} />
            <Linkedin className="text-gray-800 hover:text-[#0a66c2] cursor-pointer transition" size={28} fill="currentColor" />
            <MessageCircle className="text-gray-800 hover:text-[#25d366] cursor-pointer transition" size={28} fill="currentColor" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-500">All Rights Reserved. Copyright <span className="text-[#25d366]">©MonoSporsho.com</span> 2026.</p>
            <p className="text-[10px] font-medium text-gray-400">
              For information about the terms governing the use of our website and how we handle data, please refer to our <span className="text-[#25d366] cursor-pointer hover:underline">Terms of Use</span> and <span className="text-[#25d366] cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FrontPage;
