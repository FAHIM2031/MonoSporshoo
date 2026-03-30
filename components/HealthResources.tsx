
import React, { useState } from 'react';
import * as gemini from '../services/gemini';

type ResourceStage = 'main' | 'articles' | 'books' | 'podcast' | 'tips' | 'reader';

interface Article {
  title: string;
  category: string;
}

interface Book {
  title: string;
  author: string;
  description: string;
  pdfUrl: string;
}

interface Podcast {
  title: string;
  channel: string;
  url: string;
  thumbnail: string;
}

interface Tip {
  title: string;
  description: string;
  icon: string;
}

const BOOKS: Book[] = [
  { title: "The Body Keeps the Score", author: "Bessel van der Kolk", description: "Brain, mind, and body in the healing of trauma.", pdfUrl: "https://www.academia.edu/40998345/The_Body_Keeps_the_Score_Brain_Mind_and_Body_in_the_Healing_of_Trauma" },
  { title: "Feeling Good", author: "David D. Burns", description: "The new mood therapy for depression.", pdfUrl: "https://cdn.bookey.app/files/pdf/book/en/feeling-good.pdf" },
  { title: "Man's Search for Meaning", author: "Viktor Frankl", description: "Finding meaning in the midst of suffering.", pdfUrl: "https://www.stgregoriosudaipur.ac.in/pdf/fiction/632ecf70b27a5-man-s-search-for-meaning.pdf" },
  { title: "Daring Greatly", author: "Brené Brown", description: "How the courage to be vulnerable transforms the way we live.", pdfUrl: "https://www.scribd.com/document/994970702/Day-46-Daring-Greatly" },
  { title: "Quiet", author: "Susan Cain", description: "The power of introverts in a world that can't stop talking.", pdfUrl: "https://dl.icdst.org/pdfs/files4/cad861e978996747a1a43ae25805507d.pdf" },
  { title: "Maybe You Should Talk to Someone", author: "Lori Gottlieb", description: "A therapist, her therapist, and our lives revealed.", pdfUrl: "https://www.scribd.com/document/877983805/Maybe-You-Should-Talk-to-Someone-PDF" },
  { title: "Atomic Habits", author: "James Clear", description: "An easy & proven way to build good habits & break bad ones.", pdfUrl: "https://dn790007.ca.archive.org/0/items/atomic-habits-pdfdrive/Atomic%20habits%20%28%20PDFDrive%20%29.pdf" },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", description: "A counterintuitive approach to living a good life.", pdfUrl: "https://dokumen.pub/download/the-subtle-art-of-not-giving-a-fk-firstnbsped-9780062457714.html" },
  { title: "The Happiness Trap", author: "Russ Harris", description: "How to stop struggling and start living.", pdfUrl: "https://cabct.hr/wp-content/uploads/2016/10/The-Happiness-Trap-Harris-R1.pdf" },
  { title: "Lost Connections", author: "Johann Hari", description: "Uncovering the real causes of depression.", pdfUrl: "https://api.pageplace.de/preview/DT0400.9781526634085_A40654585/preview-9781526634085_A40654585.pdf" },
  { title: "The Power of Now", author: "Eckhart Tolle", description: "A guide to spiritual enlightenment.", pdfUrl: "https://www.alohabdonline.com/wp-content/uploads/2020/05/The-Power-of-Now.pdf" },
  { title: "Mindset", author: "Carol S. Dweck", description: "The new psychology of success.", pdfUrl: "https://icrrd.com/public/media/01-11-2020-205951Mindset%20by%20Carol%20S.%20Dweck.pdf" },
  { title: "Reasons to Stay Alive", author: "Matt Haig", description: "A moving, funny and joyous exploration of how to live better.", pdfUrl: "https://cdn.bookey.app/files/pdf/book/en/reasons-to-stay-alive.pdf" },
  { title: "The Four Agreements", author: "Don Miguel Ruiz", description: "A practical guide to personal freedom.", pdfUrl: "https://s3.amazonaws.com/kajabi-storefronts-production/sites/2147554771/themes/2150676493/downloads/B5RxqerUQHCWgCz9LQLF_The-four-agreements.pdf" },
  { title: "10% Happier", author: "Dan Harris", description: "How I tamed the voice in my head.", pdfUrl: "https://icrrd.com/public/media/15-05-2021-13031510-percent-Happier-Dan-Harris.pdf" },
  { title: "Self-Compassion", author: "Kristin Neff", description: "The proven power of being kind to yourself.", pdfUrl: "https://www.cci.health.wa.gov.au/~/media/CCI/Consumer-Modules/Building-Self-Compassion/Building-Self-Compassion---01---Understanding-Self-Compassion.pdf" },
  { title: "The Noonday Demon", author: "Andrew Solomon", description: "An atlas of depression.", pdfUrl: "https://cdn.bookey.app/files/pdf/book/en/the-noonday-demon.pdf" },
  { title: "First, We Make the Beast Beautiful", author: "Sarah Wilson", description: "A new story about anxiety.", pdfUrl: "https://all4pdfs.com/download/4868367-first-we-make-the-beast-beautiful" },
  { title: "The Upward Spiral", author: "Alex Korb", description: "Using neuroscience to reverse the course of depression.", pdfUrl: "https://cdn.bookey.app/files/pdf/book/en/the-upward-spiral.pdf" },
  { title: "Unwinding Anxiety", author: "Judson Brewer", description: "New science shows how to break the cycles of worry.", pdfUrl: "https://todaytelemedicine.com/wp-content/uploads/2023/12/UNWIND1.pdf" },
];

const PODCASTS: Podcast[] = [
  { title: "The Huberman Lab Podcast", channel: "Andrew Huberman", url: "https://www.youtube.com/watch?v=9G2MRFs4vac", thumbnail: "https://img.youtube.com/vi/9G2MRFs4vac/mqdefault.jpg" },
  { title: "On Purpose with Jay Shetty", channel: "Jay Shetty", url: "https://www.youtube.com/watch?v=i-dx24RB-cQ", thumbnail: "https://img.youtube.com/vi/i-dx24RB-cQ/mqdefault.jpg" },
  { title: "The School of Greatness", channel: "Lewis Howes", url: "https://www.youtube.com/watch?v=Q42MvjyJE1g", thumbnail: "https://img.youtube.com/vi/Q42MvjyJE1g/mqdefault.jpg" },
  { title: "The Diary Of A CEO", channel: "Steven Bartlett", url: "https://www.youtube.com/watch?v=Xm_PHZXGe-w", thumbnail: "https://img.youtube.com/vi/Xm_PHZXGe-w/mqdefault.jpg" },
  { title: "The Mel Robbins Podcast", channel: "Mel Robbins", url: "https://www.youtube.com/watch?v=qVIdfSLFfSM", thumbnail: "https://img.youtube.com/vi/qVIdfSLFfSM/mqdefault.jpg" },
  { title: "Impact Theory", channel: "Tom Bilyeu", url: "https://www.youtube.com/watch?v=L44XBd1JA50", thumbnail: "https://img.youtube.com/vi/L44XBd1JA50/mqdefault.jpg" },
  { title: "The Rich Roll Podcast", channel: "Rich Roll", url: "https://www.youtube.com/watch?v=ilrstCbOBog", thumbnail: "https://img.youtube.com/vi/ilrstCbOBog/mqdefault.jpg" },
  { title: "Ten Percent Happier", channel: "Dan Harris", url: "https://www.youtube.com/watch?v=Zlx0fKOksDc", thumbnail: "https://img.youtube.com/vi/Zlx0fKOksDc/mqdefault.jpg" },
  { title: "Where Should We Begin?", channel: "Esther Perel", url: "https://www.youtube.com/watch?v=yp7JxIpsb6c", thumbnail: "https://img.youtube.com/vi/yp7JxIpsb6c/mqdefault.jpg" },
  { title: "The Happiness Lab", channel: "Dr. Laurie Santos", url: "https://www.youtube.com/watch?v=w6Tm-E-EHWg", thumbnail: "https://img.youtube.com/vi/w6Tm-E-EHWg/mqdefault.jpg" },
  { title: "Mental Illness Happy Hour", channel: "Paul Gilmartin", url: "https://www.youtube.com/watch?v=7NvgqQKvvIs", thumbnail: "https://img.youtube.com/vi/7NvgqQKvvIs/mqdefault.jpg" },
  { title: "The Psychology Podcast", channel: "Scott Barry Kaufman", url: "https://www.youtube.com/watch?v=Xsui79YFS6U", thumbnail: "https://img.youtube.com/vi/Xsui79YFS6U/mqdefault.jpg" },
  { title: "Therapy for Black Girls", channel: "Dr. Joy Harden Bradford", url: "https://www.youtube.com/watch?v=HObAk7BP114", thumbnail: "https://img.youtube.com/vi/HObAk7BP114/mqdefault.jpg" },
  { title: "The Savvy Psychologist", channel: "Dr. Jade Wu", url: "https://www.youtube.com/watch?v=IdHoieysu5Y", thumbnail: "https://img.youtube.com/vi/IdHoieysu5Y/mqdefault.jpg" },
  { title: "Checking In with Michelle Williams", channel: "Michelle Williams", url: "https://www.youtube.com/watch?v=QDQwAvs61Io", thumbnail: "https://img.youtube.com/vi/QDQwAvs61Io/mqdefault.jpg" },
  { title: "The Daily Stoic", channel: "Ryan Holiday", url: "https://www.youtube.com/watch?v=Occwcvy3yD8", thumbnail: "https://img.youtube.com/vi/Occwcvy3yD8/mqdefault.jpg" },
  { title: "Modern Wisdom", channel: "Chris Williamson", url: "https://www.youtube.com/watch?v=x1dXuS541wk", thumbnail: "https://img.youtube.com/vi/x1dXuS541wk/mqdefault.jpg" },
  { title: "Mindset Mentor", channel: "Rob Dial", url: "https://www.youtube.com/watch?v=Q9gdbHooXkg", thumbnail: "https://img.youtube.com/vi/Q9gdbHooXkg/mqdefault.jpg" },
  { title: "The Minimalists Podcast", channel: "The Minimalists", url: "https://www.youtube.com/watch?v=jv2jXqSNGWM", thumbnail: "https://img.youtube.com/vi/jv2jXqSNGWM/mqdefault.jpg" },
  { title: "Deep Questions", channel: "Cal Newport", url: "https://www.youtube.com/watch?v=LejRmFRxXbY", thumbnail: "https://img.youtube.com/vi/LejRmFRxXbY/mqdefault.jpg" },
];


const TIPS: Tip[] = [
  { title: "Morning Sunlight", description: "Try to get 10-15 minutes of sunlight within an hour of waking up to regulate your circadian rhythm.", icon: "☀️" },
  { title: "Digital Detox", description: "Set a 'no-screen' rule for at least 30 minutes before bed to improve sleep quality.", icon: "📱" },
  { title: "Stay Hydrated", description: "Dehydration can affect your mood and energy levels. Aim for 8 glasses of water a day.", icon: "💧" },
  { title: "Mindful Breathing", description: "Practice 4-7-8 breathing when feeling stressed: inhale for 4, hold for 7, exhale for 8.", icon: "🌬️" },
  { title: "Gratitude Journal", description: "Write down three things you're grateful for every evening before sleep.", icon: "📓" },
  { title: "Move Your Body", description: "Even a 10-minute walk can significantly boost your endorphins and mood.", icon: "🚶" },
  { title: "Social Connection", description: "Reach out to one friend or family member today just to say hello.", icon: "📞" },
  { title: "Limit Caffeine", description: "Try to avoid caffeine after 2 PM to ensure it doesn't interfere with your sleep.", icon: "☕" },
  { title: "Clean Your Space", description: "A decluttered environment often leads to a decluttered mind. Spend 5 minutes tidying up.", icon: "🧹" },
  { title: "Practice Saying No", description: "Protect your energy by setting boundaries and declining tasks that overwhelm you.", icon: "🙅" },
  { title: "Eat Whole Foods", description: "Focus on nutrition that fuels your brain, like leafy greens, nuts, and berries.", icon: "🥗" },
  { title: "Listen to Music", description: "Create a 'mood-boost' playlist with songs that make you feel happy and energized.", icon: "🎵" },
  { title: "Learn Something New", description: "Spend 15 minutes learning a new skill or reading about a topic that interests you.", icon: "🧠" },
  { title: "Get Enough Sleep", description: "Prioritize 7-9 hours of quality sleep every night for cognitive and emotional health.", icon: "😴" },
  { title: "Limit News Intake", description: "Stay informed but avoid constant scrolling through negative news cycles.", icon: "📰" },
  { title: "Spend Time in Nature", description: "Visit a park or forest. Nature has a profound calming effect on the nervous system.", icon: "🌳" },
  { title: "Practice Self-Kindness", description: "Talk to yourself the way you would talk to a dear friend.", icon: "💖" },
  { title: "Take Regular Breaks", description: "Use the Pomodoro technique: work for 25 minutes, then take a 5-minute break.", icon: "⏲️" },
  { title: "Engage in a Hobby", description: "Dedicate time to something you do purely for joy, like painting, gardening, or gaming.", icon: "🎨" },
  { title: "Reflect on Your Day", description: "Take 5 minutes at the end of the day to acknowledge your accomplishments, no matter how small.", icon: "✨" },
];

const ARTICLES: Article[] = [
  { title: "Understanding Mental Health", category: "Basics" },
  { title: "Breaking the Stigma Around Mental Illness", category: "Society" },
  { title: "Managing Anxiety in Daily Life", category: "Anxiety" },
  { title: "Coping with Depression", category: "Depression" },
  { title: "The Impact of Stress on the Body and Mind", category: "Stress" },
  { title: "Student Mental Health in the Digital Age", category: "Education" },
  { title: "Workplace Burnout and Recovery", category: "Work" },
  { title: "The Importance of Self-Care", category: "Self-Care" },
  { title: "Mindfulness for Emotional Balance", category: "Mindfulness" },
  { title: "Sleep and Psychological Well-Being", category: "Sleep" },
];

const HealthResources: React.FC = () => {
  const [stage, setStage] = useState<ResourceStage>('main');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showHelpline, setShowHelpline] = useState(false);

  const helplines = [
    {
      name: "Kaan Pete Roi",
      desc: "Bangladesh’s first and only emotional support and suicide prevention helpline, staffed by trained volunteers.",
      phone: "+880 9612 119911",
      services: "Confidential listening, crisis support, suicide prevention, and emotional aid.",
      icon: "📞"
    },
    {
      name: "Moner Bondhu",
      desc: "Offers online and in-person mental health counseling, including 24/7 hotline, video counseling via WhatsApp and Skype, and a dedicated app.",
      phone: "01776632344",
      services: "Personalized counseling, corporate support, well-being tools, and media programs like Amar Moner Kotha.",
      icon: "🤝"
    },
    {
      name: "SAJIDA Foundation (SHOJON)",
      desc: "Provides affordable mental health care, including primary care, counseling, and psychiatric support.",
      phone: "09606119900",
      hours: "10:00 AM – 10:00 PM daily",
      services: "Accessible via mobile; includes para-counselors and referrals to psychologists/psychiatrists",
      icon: "🏥"
    }
  ];

  const resources = [
    { id: 'articles', title: 'Articles', subtitle: 'Learn & understand', icon: '📖', color: 'bg-[#f0d8d8]' },
    { id: 'books', title: 'Books', subtitle: 'Deep dive into wellness', icon: '📚', color: 'bg-[#f0d8d8]' },
    { id: 'podcast', title: 'Podcast', subtitle: 'Listen & grow', icon: '🎙️', color: 'bg-[#f0d8d8]' },
    { id: 'tips', title: 'Tips', subtitle: 'Daily mental care', icon: '💡', color: 'bg-[#f0d8d8]' },
  ];

  const handleResourceClick = (id: string) => {
    if (id === 'articles') {
      setStage('articles');
    } else if (id === 'books') {
      setStage('books');
    } else if (id === 'podcast') {
      setStage('podcast');
    } else if (id === 'tips') {
      setStage('tips');
    }
  };

  const handleArticleClick = async (article: Article) => {
    setSelectedArticle(article);
    setStage('reader');
    setLoading(true);
    setGeneratedContent('');

    try {
      const ai = gemini.getAI();
      const prompt = `Write a detailed and comprehensive article about "${article.title}". 
      The article should be approximately 200 lines of text. 
      Use clear subheadings (at least 8-10), detailed bullet points, and thorough explanations for each section. 
      Include:
      1. Introduction and definition.
      2. Historical context.
      3. Scientific/Psychological background.
      4. Common symptoms and signs.
      5. Impact on daily life (work, relationships, health).
      6. Practical coping strategies (at least 8 detailed tips).
      7. Long-term management techniques.
      8. When to seek professional help.
      9. Supportive messages and encouragement.
      10. Conclusion.
      
      Format it with clear line breaks and aim for a length of 200 lines.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setGeneratedContent(response.text || "Could not generate content at this time.");
    } catch (error) {
      console.error("Content generation failed:", error);
      setGeneratedContent("Failed to load the detailed article. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (stage === 'reader') setStage('articles');
    else if (stage === 'articles' || stage === 'books' || stage === 'podcast' || stage === 'tips') setStage('main');
  };

  if (stage === 'tips') {
    return (
      <div className="w-full max-w-4xl animate-fade-in space-y-8">
        <button onClick={goBack} className="text-gray-500 font-bold flex items-center hover:text-gray-800 transition">
          <span className="mr-2">←</span> Back to Resources
        </button>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-gray-900">Daily Mental Care Tips</h2>
            <span className="bg-[#f0d8d8] px-4 py-1 rounded-full text-xs font-black text-gray-700 uppercase tracking-widest">20 Daily Tips</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TIPS.map((tip, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition flex items-start space-x-6 group"
              >
                <div className="text-4xl bg-[#f0d8d8] p-4 rounded-2xl group-hover:scale-110 transition">
                  {tip.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-[#f4a7a7] transition">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'podcast') {
    return (
      <div className="w-full max-w-4xl animate-fade-in space-y-8">
        <button onClick={goBack} className="text-gray-500 font-bold flex items-center hover:text-gray-800 transition">
          <span className="mr-2">←</span> Back to Resources
        </button>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-gray-900">Mental Health Podcasts</h2>
            <span className="bg-[#f0d8d8] px-4 py-1 rounded-full text-xs font-black text-gray-700 uppercase tracking-widest">20 Podcasts Available</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PODCASTS.map((podcast, idx) => (
              <a 
                key={idx} 
                href={podcast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={podcast.thumbnail} 
                    alt={podcast.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                      <span className="text-red-600 text-xl ml-1">▶</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-black text-gray-900 leading-tight group-hover:text-[#f4a7a7] transition line-clamp-2">{podcast.title}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{podcast.channel}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'books') {
    return (
      <div className="w-full max-w-4xl animate-fade-in space-y-8">
        <button onClick={goBack} className="text-gray-500 font-bold flex items-center hover:text-gray-800 transition">
          <span className="mr-2">←</span> Back to Resources
        </button>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-gray-900">Mental Health Books</h2>
            <span className="bg-[#f0d8d8] px-4 py-1 rounded-full text-xs font-black text-gray-700 uppercase tracking-widest">20 Books Available</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BOOKS.map((book, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-[#f4a7a7] transition">{book.title}</h3>
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="text-sm font-bold text-gray-400">by {book.author}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{book.description}</p>
                </div>
                <a 
                  href={book.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#f0d8d8] text-gray-900 py-3 rounded-2xl font-black text-center hover:bg-[#ebc7c7] transition flex items-center justify-center space-x-2"
                >
                  <span>Download PDF</span>
                  <span className="text-xs">📥</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'articles') {
    return (
      <div className="w-full max-w-4xl animate-fade-in space-y-8">
        <button onClick={goBack} className="text-gray-500 font-bold flex items-center hover:text-gray-800 transition">
          <span className="mr-2">←</span> Back to Resources
        </button>
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Articles</h2>
          <div className="grid grid-cols-1 gap-4">
            {ARTICLES.map((art, idx) => (
              <div 
                key={idx} 
                onClick={() => handleArticleClick(art)}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 font-black text-lg">{idx + 1}.</span>
                  <span className="text-lg font-bold text-gray-800 group-hover:text-[#f4a7a7] transition">{art.title}</span>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'reader' && selectedArticle) {
    return (
      <div className="w-full max-w-4xl animate-fade-in space-y-8">
        <button onClick={goBack} className="text-gray-500 font-bold flex items-center hover:text-gray-800 transition">
          <span className="mr-2">←</span> Back to Articles
        </button>
        <article className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-8 min-h-[600px]">
          <div className="space-y-2">
            <span className="text-[#f4a7a7] font-black text-[10px] uppercase tracking-widest">{selectedArticle.category}</span>
            <h1 className="text-4xl font-black text-gray-900 leading-tight">{selectedArticle.title}</h1>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-[#f4a7a7] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-bold animate-pulse">Generating detailed 200-line article...</p>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
              {generatedContent}
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl animate-fade-in space-y-12">
      <div className="space-y-12 flex flex-col items-center">
        <div className="w-full">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Mental Health Resources</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {resources.map((res, idx) => (
            <div 
              key={idx}
              onClick={() => handleResourceClick(res.id)}
              className={`${res.color} p-8 rounded-[2rem] shadow-sm hover:shadow-md transition cursor-pointer flex flex-col space-y-2 group`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition">{res.icon}</span>
                <h3 className="text-2xl font-black text-gray-900">{res.title}</h3>
              </div>
              <p className="text-gray-600 font-bold ml-9">{res.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-6 pt-10">
          <p className="text-gray-900 font-bold text-xl">Need immediate support?</p>
          <button 
            onClick={() => setShowHelpline(true)}
            className="bg-white border border-gray-300 text-gray-900 px-12 py-4 rounded-3xl font-bold shadow-sm hover:bg-gray-50 transition active:scale-95"
          >
            View Help & Helpline
          </button>
        </div>
      </div>

      {/* Helpline Modal */}
      {showHelpline && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowHelpline(false)}
          />
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#f0d8d8]/20">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Emergency Helplines</h3>
                <p className="text-gray-500 font-bold text-sm">Bangladesh Mental Health Support</p>
              </div>
              <button 
                onClick={() => setShowHelpline(false)}
                className="w-10 h-10 rounded-full hover:bg-white transition flex items-center justify-center text-gray-400 hover:text-gray-900 font-black"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {helplines.map((h, i) => (
                <div key={i} className="space-y-4 p-6 rounded-[2rem] bg-gray-50 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{h.icon}</span>
                    <h4 className="text-xl font-black text-gray-900">{h.name}</h4>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium italic">
                    {h.desc}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-gray-100">
                      <span className="text-[#f4a7a7] font-black">📞</span>
                      <a href={`tel:${h.phone.replace(/\s+/g, '')}`} className="text-lg font-black text-gray-900 hover:text-[#f4a7a7] transition">
                        {h.phone}
                      </a>
                    </div>
                    {h.hours && (
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-gray-100">
                        <span className="text-[#f4a7a7] font-black">⏰</span>
                        <span className="text-sm font-bold text-gray-700">{h.hours}</span>
                      </div>
                    )}
                    <div className="flex items-start space-x-3 bg-white p-3 rounded-2xl border border-gray-100">
                      <span className="text-[#f4a7a7] font-black">✨</span>
                      <div className="text-xs font-bold text-gray-500 leading-relaxed">
                        <span className="uppercase tracking-widest block mb-1">Services</span>
                        {h.services}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 border-t border-gray-100 bg-gray-50 text-center">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                If you are in immediate danger, please contact local emergency services.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthResources;
