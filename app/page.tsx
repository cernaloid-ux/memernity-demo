'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { supabase } from './supabase'
import {
  Bookmark,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Flame,
  Heart,
  ImageIcon,
  LayoutGrid,
  Mail,
  MapPin,
  Mic,
  Moon,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Share2,
  SquareUser,
  Sun,
  User,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react'

// --- ДАННЫЕ БИОГРАФИИ (ДЕМО MAX) ---
const TAGS = ['Бизнесмен', 'Спортсмен', 'Архитектор', 'Дизайнер', 'Инвестор', 'Отец']

const FACTS = [
  { icon: SquareUser, label: 'Основатель:', value: 'Boiar House' },
  { icon: Zap, label: 'Спорт:', value: 'Ультрамарафонец, переплыл Босфор' },
  { icon: Users, label: 'Отец:', value: 'Марка и Софии' },
  { icon: Heart, label: 'Женат на:', value: 'Анне (Вместе 35 лет)' },
]

const NAV = [
  { icon: BookOpen, label: 'Биография' },
  { icon: ImageIcon, label: 'Медиа' },
  { icon: Mail, label: 'Комментарии' },
]

const TAG_DETAILS: Record<string, {title: string, desc: string, img: string}> = {
  'Бизнесмен': { title: 'Империя Boiar House', desc: 'В 2004 году амбиции Виктора обрели форму — появилась корпорация Boiar House. Его философия была бескомпромиссной: никакого визуального мусора, только премиальный минимализм. В кризис 2008 года он рискнул всем личным имуществом, чтобы достроить объекты. Железное слово сделало его имя символом абсолютной надежности в бизнесе.', img: '/images/business-1.png' },
  'Спортсмен': { title: 'За гранью возможного', desc: 'Бизнеса ему всегда было мало. Чтобы доказать, что разум сильнее тела, Виктор пробежал сложнейший 130-километровый ультрамарафон. А в 54 года он бросил вызов водной стихии и переплыл Босфор. Дисциплина в спорте стала фундаментом его жизненных побед.', img: '/images/sport-1.png' },
  'Архитектор': { title: 'Визионер чистых линий', desc: 'Всё началось с вычерчивания фасадов на последней парте в школе. Позже, на архитектурном факультете, Виктор сформировался как строгий функционалист. Он видел идеальную форму в отсутствии лишних деталей, заставляя подрядчиков молчать лишь одним взглядом.', img: '/images/cover-building.png' },
  'Дизайнер': { title: 'Эстетика минимализма', desc: 'Встреча с Анной, художником-реставратором, изменила его видение. Она научила железного визионера видеть тепло в холодном камне. С тех пор каждый его проект стал симбиозом бескомпромиссного функционализма и живой, дышащей эстетики.', img: '/images/business-2.png' },
  'Инвестор': { title: 'Репутация как актив', desc: 'Виктор инвестировал не только в бетон и стекло, но и в доверие. Его главным правилом было: "Ошибка — это плата за обучение". Он никогда не позволял потерям парализовать себя, делал выводы и строил дальше, инвестируя в долгосрочное наследие.', img: '/images/business-3.png' },
  'Отец': { title: 'Главный проект жизни', desc: 'Для конкурентов он был железным боссом, а для детей — папой, который часами собирал конструктор на ковре и тайком приносил шоколад. "Я построил Boiar House, но мой главный проект — это вы", — написал он в своем письме Марку и Софии.', img: '/images/family-1.png' }
}

const BIO_SECTIONS = [
  { title: 'Детство и первые шаги (1965–1983)', content: 'Всё началось в 1965 году в типичных панельных дворах. Возможно, именно тесные серые стены воспитали в Викторе тягу к свободе и чистым линиям. Он не был обычным отличником — брал от школы только то, что считал нужным. Пока другие мечтали стать космонавтами, он сидел на последней парте и вычерчивал идеальные фасады зданий.' },
  { title: 'Юность и Анна (1984–1995)', content: 'Конец восьмидесятых, архитектурный факультет. Виктор — строгий функционалист. И именно там он встретил Анну, художника-реставратора. Она была хаосом и цветом, его абсолютной противоположностью. Анна научила его видеть тепло в холодном камне и стала его главным балансом.' },
  { title: 'Рождение легенды (1996–2010)', content: 'В 2004 году амбиции Виктора обрели форму и появилась корпорация Boiar House. Философия была бескомпромиссной: никакого визуального мусора, только премиальный минимализм. Легендой он стал в кризис 2008 года. Когда рынок рухнул, Виктор заложил всё личное имущество, чтобы достроить объекты.' },
  { title: 'Код победителя (2011–2020)', content: 'Его успех был выкован из сверхчеловеческой дисциплины. 100-часовая рабочая неделя, короткий сон и железный ритуал — каждый вечер записывать достижения дня. Но бизнеса ему было мало. Чтобы доказать, что разум сильнее тела, он пробежал сложнейший 130-километровый ультрамарафон.' },
  { title: 'Наследие (2021–2025)', content: 'Виктора не стало в сентябре 2025 года. Но он оставил после себя не только миллионы квадратов стекла и бетона, он оставил код победителя. Его сын Марк перенял управление компанией, а сотни людей до сих пор спрашивают себя: «как бы поступил Виктор?». Он всегда говорил, что идеальная форма не нуждается в лишних деталей.' }
]

const MEDIA_DATA = {
  'Семья': { covers: ['/images/family-1.png', '/images/family-2.png', '/images/family-3.png'], photos: ['/images/family-1.png', '/images/family-2.png', '/images/family-3.png', '/images/family-4.png', '/images/family-5.png'], videos: ['/images/family-video-1.png', '/images/family-video-2.png', '/images/family-video-3.png', '/images/family-video-4.png', '/images/family-video-5.png'], film: '/images/family-film.png' },
  'Спорт': { covers: ['/images/sport-1.png', '/images/sport-2.png'], photos: ['/images/sport-1.png', '/images/sport-2.png'], videos: [], film: null },
  'Бизнес': { covers: ['/images/business-1.png', '/images/business-2.png', '/images/business-3.png'], photos: ['/images/business-1.png', '/images/business-2.png', '/images/business-3.png'], videos: [], film: null }
}

const LETTER_TEXT = "Если вы читаете это, значит, меня больше нет рядом. Но мои мысли и мои принципы всегда останутся с вами. Я построил «Boiar House», но мой главный проект — это вы. Я не хочу учить вас жить, но хочу оставить правила, которые спасали меня, когда казалось, что всё рушится:\n\n1. Мир вам ничего не должен.\nВсё, что вы хотите получить, придется взять своим трудом. Не ждите идеальных условий, их не существует. Действуйте в шторм.\n\n2. Уважайте дисциплину больше мотивации.\nМотивация гаснет при первом же дожде. Дисциплина — это двигатель. Когда опускаются руки — просто делайте следующий шаг. Тренируйте волю так же, как мышцы.\n\n3. Фильтруйте свое окружение.\nВы — это среднее арифметическое пяти людей, с которыми проводите больше всего времени. Окружайте себя теми, кто заставляет тянуться вверх.\n\n4. Ошибайтесь быстро, исправляйте мгновенно.\nЯ терял миллионы из-за плохих решений. Ошибка — это просто плата за обучение. Никогда не позволяйте ошибке парализовать вас. Сделайте выводы и стройте дальше.\n\n5. Берегите свое имя.\nДеньги можно заработать, потерять и заработать снова. Репутация создается десятилетиями, а рушится за один день из-за одного нечестного поступка. Будьте людьми слова.\n\nИ самое главное: не пытайтесь прожить мою жизнь или оправдать мои ожидания. Постройте свою собственную империю. Я всегда буду гордиться вами."

const INITIAL_COMMENTS = [
  { id: 1, author: 'Anna Averin', date: '12.04.2026', role: 'Жена', avatar: '/images/AvatarcaJena.png', text: 'Мы построили столько всего, но моим любимым местом всегда была наша кухня по воскресеньям. Эспрессо, джаз на фоне и ты, отложивший свои чертежи. Мир запомнит тебя как великого архитектора, а я - как свою главную опору. С днем рождения, Витя. Люблю бесконечно.', reactions: { infinity: 128, heart: 45, fire: 17 }, audio: '00:12', category: 'Семья' },
  { id: 2, author: 'Marc Averin', date: '18.05.2026', role: 'Сын', avatar: '/images/AvatarcaSina.png', text: 'Ты всегда говорил, что репутация важнее денег, а дисциплина бьет талант. Я помню каждое твое слово, пап. Сегодня на стройке нового музея мы завершили фасад — всё по твоим чертежам. Boiar House в надежных руках. Скучаю каждый день.', reactions: { infinity: 89, heart: 41, fire: 36 }, audio: null, category: 'Семья' },
  { id: 3, author: 'Sofia Averin', date: '02.06.2026', role: 'Дочь', avatar: '/images/AvatarcaDoci.png', text: 'Для конкурентов ты был железным боссом, а для меня — папой, который тайком от мамы приносил шоколад, когда я плакала из-за оценок. Спасибо за то, что научил ничего не бояться и всегда держать спину прямо. Ты мой герой!', reactions: { infinity: 20, heart: 94, fire: 11 }, audio: '00:41', category: 'Семья' }
]

// --- КОМПОНЕНТЫ ---
function RoundButton({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/70 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 shadow-sm transition-all duration-300 hover:bg-white dark:hover:bg-neutral-700 active:scale-90 ${className}`}>
      {children}
    </button>
  )
}

function BioCard({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <section className="mt-4 overflow-hidden rounded-[60px] bg-white/60 dark:bg-neutral-800/80 shadow-sm transition-colors duration-300 hover:bg-white/80 dark:hover:bg-neutral-800">
      <div className="flex w-full cursor-pointer items-center justify-between gap-4 px-7 py-6 active:scale-[0.98] transition-transform" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-xl font-bold leading-snug text-balance dark:text-white">{title}</span>
        <div className="flex shrink-0 items-center gap-2">
          {isOpen && (
            <button type="button" onClick={(e) => { e.stopPropagation() }} className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-neutral-700 text-neutral-700 dark:text-white shadow-sm transition-all hover:bg-neutral-100 dark:hover:bg-neutral-600 active:scale-90 animate-scale-in">
              <Volume2 className="h-5 w-5" strokeWidth={2.5} />
            </button>
          )}
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors hover:bg-neutral-300 dark:hover:bg-white/20">
            <ChevronDown className={`h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
          </button>
        </div>
      </div>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-7 pb-8 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{content}</p>
        </div>
      </div>
    </section>
  )
}

function PlayIconOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800/60 pl-1 backdrop-blur-sm shadow-lg animate-scale-in">
        <Play className="h-6 w-6 fill-white text-white" />
      </div>
    </div>
  )
}

function AudioPlayer({ time }: { time: string }) {
  return (
    <div className="mt-2 flex items-center gap-3 rounded-[40px] bg-white/60 dark:bg-neutral-800/80 p-4 pr-6 shadow-sm transition-transform active:scale-[0.98]">
      <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-300 dark:bg-white/20 text-white pl-1 transition-all hover:bg-neutral-400 dark:hover:bg-white/30 active:scale-90">
        <Play className="h-6 w-6 fill-neutral-600 dark:fill-white text-neutral-600 dark:text-white" />
      </button>
      <div className="flex flex-1 items-center gap-1.5 opacity-50">
        {[3, 5, 8, 4, 6, 9, 3, 5, 8, 4].map((h, i) => (
          <div key={i} className="w-1.5 rounded-full bg-neutral-600 dark:bg-neutral-300 transition-all duration-300" style={{ height: `${h * 4}px` }} />
        ))}
      </div>
      <span className="text-[14px] font-bold text-neutral-500 dark:text-neutral-400">{time}</span>
    </div>
  )
}

// --- ОСНОВНОЙ ЭКРАН (ВИТРИНА) ---
export default function Page() {
  // === СИСТЕМНЫЕ СТЕЙТЫ (ТОЛЬКО ДЛЯ ТЕСТА ВХОДА) ===
  const [user, setUser] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setIsProfileOpen(false)
  }
  // ===================================

  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const [active, setActive] = useState('Биография')
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof MEDIA_DATA | null>(null)
  const [mediaSubTab, setMediaSubTab] = useState<'Фото' | 'Видео' | 'Фильм'>('Фото')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLetterOpen, setIsLetterOpen] = useState(false)
  const [commentFilter, setCommentFilter] = useState('Все')
  const [userReactions, setUserReactions] = useState<Record<number, string>>({})
  const [activeReactionAnim, setActiveReactionAnim] = useState<string | null>(null)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const lastScrollY = useRef(0)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentY = e.currentTarget.scrollTop
    if (currentY <= 0) { setIsScrollingDown(false); lastScrollY.current = currentY; return }
    const diff = currentY - lastScrollY.current
    if (Math.abs(diff) > 5) { setIsScrollingDown(diff > 0); lastScrollY.current = currentY }
  }

  useEffect(() => {
    if (selectedCategory || selectedTag || isProfileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [selectedCategory, selectedTag, isProfileOpen])

  const handleReaction = (commentId: number, type: 'infinity' | 'heart' | 'fire') => {
    if (userReactions[commentId] === type) {
      setUserReactions(prev => { const n = {...prev}; delete n[commentId]; return n; })
    } else {
      setUserReactions(prev => ({...prev, [commentId]: type}))
      const reactionKey = `${commentId}-${type}`
      setActiveReactionAnim(reactionKey)
      setTimeout(() => setActiveReactionAnim(null), 800)
    }
  }

  const renderReactionIcon = (type: string) => {
    if (type === 'infinity') return <img src="/images/LogoInfinityMemernity.svg" alt="infinity" className="h-4 w-4 dark:invert" />
    if (type === 'heart') return <Heart className="h-4 w-4 text-neutral-800 dark:text-white" strokeWidth={2.5} />
    if (type === 'fire') return <Flame className="h-4 w-4 text-neutral-800 dark:text-white" strokeWidth={2.5} />
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div 
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-b from-neutral-300 via-neutral-200 to-neutral-300 dark:from-neutral-950 dark:via-[#1A1A1A] dark:to-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dropBounce { 0% { transform: scale(0); opacity: 0; border-radius: 100px; } 40% { transform: scale(1.1); opacity: 1; border-radius: 40px; } 70% { transform: scale(0.95); opacity: 1; border-radius: 40px; } 100% { transform: scale(1); opacity: 1; border-radius: 40px; } }
          .animate-drop-bounce { animation: dropBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: center bottom; }

          @keyframes fadeBlurIn { 0% { opacity: 0; filter: blur(8px); transform: translateY(15px); } 100% { opacity: 1; filter: blur(0); transform: translateY(0); } }
          .animate-fade-blur { animation: fadeBlurIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

          @keyframes scaleIn { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
          .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }

          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

          @keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
          .animate-slideDown { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

          @keyframes firework { 
            0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0px) scale(0.5); opacity: 1; } 
            100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-45px) scale(1.2); opacity: 0; } 
          }
          .animate-firework { 
            animation: firework 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; 
          }

          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[290px] bg-gradient-to-t from-[#494949] dark:from-black to-transparent transition-colors duration-500" />

        {/* ================= ПОПАП ЛИЧНОГО КАБИНЕТА ================= */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-start">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsProfileOpen(false)} />
            
            <div className="animate-slideDown relative flex w-full flex-col overflow-hidden rounded-b-[50px] bg-[#EAEAEA] dark:bg-neutral-900 shadow-2xl pt-14 pb-8 px-6">
              <button 
                className="absolute right-5 top-12 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-black/40 text-neutral-800 dark:text-white shadow-sm backdrop-blur-md transition-all active:scale-90 hover:bg-white dark:hover:bg-black/60 animate-scale-in"
                onClick={() => setIsProfileOpen(false)}
              >
                <X className="h-6 w-6" strokeWidth={2.5} />
              </button>

              <h2 className="text-2xl font-bold tracking-tight mb-6 dark:text-white">Личный кабинет</h2>

              {user ? (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 rounded-3xl bg-white/50 dark:bg-white/5 p-4 border border-white/40 dark:border-white/10 shadow-sm">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 text-xl font-bold">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Аккаунт создателя</span>
                      <span className="truncate text-lg font-bold dark:text-white">{user.email}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white/50 dark:bg-white/5 p-5 border border-white/40 dark:border-white/10 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Ваш аккаунт</span>
                      <span className="rounded-full bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 text-xs font-bold uppercase tracking-wider">Подключен</span>
                    </div>
                    
                    <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                      Вы находитесь на странице идеального демо-профиля тарифа Max. Для создания и редактирования реальных мемориалов перейдите в панель управления.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <button className="flex items-center justify-between rounded-2xl bg-white/50 dark:bg-white/5 p-4 text-left font-bold transition-colors hover:bg-white/80 dark:hover:bg-white/10 border border-white/40 dark:border-white/10 shadow-sm">
                      <span className="dark:text-white text-neutral-800">Управление страницами близких</span>
                      <ChevronRight className="h-5 w-5 text-neutral-400" />
                    </button>
                    <button 
                      onClick={signOut}
                      className="flex items-center justify-center rounded-2xl bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400 transition-colors hover:bg-red-500/20"
                    >
                      Выйти из аккаунта
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center gap-5 py-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/50 dark:bg-white/10 mb-2 shadow-inner border border-white/40 dark:border-white/5">
                    <User className="h-10 w-10 text-neutral-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">Вход для авторов</h3>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Войдите в систему, чтобы протестировать связь с базой данных и посмотреть панель управления.
                    </p>
                  </div>
                  <button 
                    onClick={signInWithGoogle}
                    className="w-full rounded-2xl bg-neutral-800 dark:bg-white py-4 text-[16px] font-bold text-white dark:text-black transition-transform hover:scale-[1.02] active:scale-95 shadow-xl mt-4"
                  >
                    Продолжить с Google
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ============================================================== */}

        <div className="relative flex-1 overflow-y-auto pb-[350px] no-scrollbar" onScroll={handleScroll}>
          <header className="relative z-30 flex items-center justify-between px-4 pt-14">
            <div>
              <div className="flex items-center active:scale-95 transition-transform cursor-pointer">
                <img src="/images/logo.png" alt="Memernity" className="h-6 w-auto object-contain dark:invert transition-all" />
              </div>
              <div className="mt-0.5 flex items-center gap-1 pl-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                <SquareUser className="h-3 w-3" strokeWidth={3} />
                <span>Demo Profile</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-400/70 dark:bg-neutral-800 text-white shadow-sm transition-transform active:scale-90 border border-transparent dark:border-white/10 hover:bg-neutral-500/70 dark:hover:bg-neutral-700"
            >
              <User className="h-6 w-6" strokeWidth={3} />
            </button>
          </header>

          <div key={active} className="relative z-10 px-4 animate-fade-blur">
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RoundButton><MapPin className="h-4 w-4" strokeWidth={3} /></RoundButton>
                <RoundButton><Bookmark className="h-4 w-4" strokeWidth={3} /></RoundButton>
                <RoundButton onClick={() => setIsDarkMode(!isDarkMode)}>
                  {isDarkMode ? <Sun className="h-4 w-4 text-yellow-400" strokeWidth={3} /> : <Moon className="h-4 w-4 text-sky-600" strokeWidth={3} />}
                </RoundButton>
              </div>
              <div className="flex items-center gap-2">
                <RoundButton><Pencil className="h-4 w-4" strokeWidth={3} /></RoundButton>
                <RoundButton className="!bg-sky-100 dark:!bg-sky-900/40">
                  <img src="/images/LogoInfinityMemernity.svg" className="h-4 w-4 object-contain opacity-80 dark:invert" alt="Infinity" />
                </RoundButton>
              </div>
            </div>

            {active === 'Биография' && (
              <>
                <section className="mt-4 overflow-hidden rounded-[60px] bg-white/60 dark:bg-neutral-800/80 shadow-sm transition-all hover:scale-[1.01] duration-300">
                  <div className="relative h-44 w-full">
                    <Image src="/images/cover-building.png" alt="Boiar House" fill className="object-cover" priority />
                    <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-4 ring-white/40 dark:ring-black/40 shadow-lg">
                      <Image src="/images/portrait.png" alt="Victor Averin" fill className="object-cover" priority />
                    </div>
                  </div>
                  <div className="px-5 pb-8 pt-4 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Victor Averin</h1>
                    <p className="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-300">12.04.1965 — 08.09.2025</p>
                    <div className="mt-5 flex flex-wrap justify-center gap-[9px]">
                      {TAGS.map((tag) => (
                        <span 
                          key={tag} 
                          onClick={() => setSelectedTag(tag)}
                          className="rounded-full bg-neutral-200/80 dark:bg-white/10 px-4 py-2 text-[20px] font-normal text-neutral-700 dark:text-neutral-200 transition-all hover:bg-neutral-300 dark:hover:bg-white/20 active:scale-95 cursor-pointer shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="mt-4 w-full rounded-[60px] bg-white/60 dark:bg-neutral-800/80 py-6 pl-[59px] pr-6 shadow-sm transition-colors hover:bg-white/80 dark:hover:bg-neutral-800">
                  <h2 className="text-[20px] font-bold">Основное:</h2>
                  <ul className="mt-3 space-y-2">
                    {FACTS.map(({ icon: Icon, label, value }) => (
                      <li key={label} className="flex items-start gap-2 text-[17px] font-semibold text-neutral-800 dark:text-neutral-200">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-400" strokeWidth={3} />
                        <span className="leading-snug">
                          <span className="dark:text-white">{label}</span> {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {BIO_SECTIONS.map((section, index) => (
                  <BioCard key={index} title={section.title} content={section.content} />
                ))}
              </>
            )}

            {active === 'Медиа' && (
              <>
                <section className="mt-4 flex items-center gap-5 rounded-[60px] bg-white/60 dark:bg-neutral-800/80 p-5 shadow-sm transition-all hover:scale-[1.01] duration-300">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-white/40 dark:ring-black/40">
                    <Image src="/images/portrait.png" alt="Victor Averin" fill className="object-cover" priority />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-[22px] font-bold tracking-tight">Victor Averin</h1>
                    <p className="mt-0.5 text-[13px] font-bold text-neutral-800 dark:text-neutral-400">12.04.1965 — 08.09.2025</p>
                  </div>
                </section>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['Семья', 'Спорт', 'Бизнес'] as const).map((cat) => (
                    <div key={cat} className="group">
                      <h2 
                        className="flex cursor-pointer items-center text-[24px] font-bold pl-2 transition-transform active:scale-95 w-max"
                        onClick={() => { setSelectedCategory(cat); setMediaSubTab('Фото'); }}
                      >
                        {cat} <ChevronRight className="ml-1 h-7 w-7 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                      </h2>
                      <div 
                        className="mt-3 flex cursor-pointer flex-col gap-2 rounded-[40px] bg-white/50 dark:bg-neutral-800/80 p-3 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/60 dark:hover:bg-neutral-800 active:scale-[0.98]"
                        onClick={() => { setSelectedCategory(cat); setMediaSubTab('Фото'); }}
                      >
                        <div className="relative w-full aspect-video rounded-[30px] overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                           {MEDIA_DATA[cat].covers[0] && <img src={MEDIA_DATA[cat].covers[0]} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />}
                        </div>
                        {MEDIA_DATA[cat].covers.length > 1 && (
                          <div className="flex gap-2">
                            <div className={`relative flex-1 rounded-[30px] overflow-hidden bg-neutral-200 dark:bg-neutral-900 ${MEDIA_DATA[cat].covers.length > 2 ? 'aspect-square' : 'aspect-video'}`}>
                              {MEDIA_DATA[cat].covers[1] && <img src={MEDIA_DATA[cat].covers[1]} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />}
                            </div>
                            {MEDIA_DATA[cat].covers[2] && (
                              <div className="relative aspect-square flex-1 rounded-[30px] overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                                <img src={MEDIA_DATA[cat].covers[2]} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {active === 'Комментарии' && (
              <>
                <section className="mt-4 flex items-center gap-5 px-2">
                  <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full ring-4 ring-white/40 dark:ring-black/40">
                    <Image src="/images/portrait.png" alt="Victor Averin" fill className="object-cover" priority />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-[22px] font-bold tracking-tight">Victor Averin</h1>
                    <p className="mt-0.5 text-[13px] font-bold text-neutral-800 dark:text-neutral-400">12.04.1965 — 08.09.2025</p>
                  </div>
                </section>

                <div className="my-6 h-px w-full bg-neutral-400/30 dark:bg-white/10" />

                <section className="mt-4 overflow-hidden rounded-[40px] bg-white/60 dark:bg-neutral-800/80 shadow-sm transition-colors duration-300 hover:bg-white/80 dark:hover:bg-neutral-800">
                  <div className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 active:scale-[0.98] transition-transform" onClick={() => setIsLetterOpen(!isLetterOpen)}>
                    <div className="flex flex-col">
                      <span className="text-[19px] font-bold leading-snug">Письмо Марку и Софии</span>
                      <span className="mt-0.5 text-[14px] font-medium text-neutral-600 dark:text-neutral-400">Открыто 31.02.2026.</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {isLetterOpen && (
                        <button type="button" onClick={(e) => { e.stopPropagation() }} className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-neutral-700 text-neutral-700 dark:text-white shadow-sm transition-all hover:bg-neutral-100 dark:hover:bg-neutral-600 active:scale-90 animate-scale-in">
                          <Volume2 className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                      )}
                      <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/80 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors hover:bg-neutral-300 dark:hover:bg-white/20">
                        <ChevronDown className={`h-6 w-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isLetterOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                  <div className={`grid transition-all duration-500 ease-in-out ${isLetterOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-7 text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                        {LETTER_TEXT}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="my-6 h-px w-full bg-neutral-400/30 dark:bg-white/10" />

                <div className="flex gap-2">
                  {['Все', 'Семья', 'Друзья'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setCommentFilter(f)}
                      className={`rounded-full px-5 py-2 text-[16px] font-bold transition-all duration-300 active:scale-90 ${commentFilter === f ? 'bg-neutral-500 dark:bg-white text-white dark:text-black shadow-sm' : 'bg-white/50 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-white/70 dark:hover:bg-neutral-800'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-6">
                  {commentFilter === 'Друзья' ? (
                    <p className="mt-4 text-center text-lg font-bold text-neutral-500 dark:text-neutral-400 animate-fade-in">Нет комментариев.</p>
                  ) : (
                    INITIAL_COMMENTS.map((comment, i) => (
                      <div key={comment.id} className="flex flex-col animate-fade-blur" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex items-center justify-between mb-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-full shadow-sm ring-2 ring-white/20 dark:ring-black/20">
                              <img src={comment.avatar} alt={comment.author} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[18px] font-bold leading-tight">{comment.author}</span>
                              <span className="text-[12px] font-bold text-neutral-800 dark:text-neutral-400">{comment.date}</span>
                            </div>
                          </div>
                          <span className="rounded-full bg-white/60 dark:bg-white/10 px-4 py-1 text-[13px] font-bold text-neutral-700 dark:text-neutral-300 shadow-sm cursor-default">
                            {comment.role}
                          </span>
                        </div>

                        <div className="rounded-[40px] bg-white/60 dark:bg-neutral-800/80 p-6 shadow-sm transition-transform hover:scale-[1.01] duration-300">
                          <p className="text-[16px] leading-relaxed text-neutral-800 dark:text-neutral-200">
                            {comment.text}
                          </p>
                          
                          <div className="relative mt-4 flex w-max items-center rounded-full bg-white/50 dark:bg-white/10 p-1 shadow-sm border border-white/40 dark:border-white/10">
                            {userReactions[comment.id] && (
                              <div
                                className="absolute inset-y-1 w-[68px] rounded-full bg-white dark:bg-neutral-700 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                style={{
                                  transform: `translateX(${['infinity', 'heart', 'fire'].indexOf(userReactions[comment.id]) * 100}%)`
                                }}
                              />
                            )}

                            {(['infinity', 'heart', 'fire'] as const).map((type) => {
                              const isSelected = userReactions[comment.id] === type
                              const baseCount = comment.reactions[type]
                              const displayCount = baseCount + (isSelected ? 1 : 0)

                              return (
                                <button 
                                  key={type}
                                  onClick={() => handleReaction(comment.id, type)}
                                  className="relative z-10 w-[68px] flex items-center justify-center gap-1.5 py-1.5 transition-transform active:scale-90"
                                >
                                  {activeReactionAnim === `${comment.id}-${type}` && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      {[0, 60, 120, 180, 240, 300].map(angle => (
                                        <span key={angle} className="absolute animate-firework" style={{ '--angle': `${angle}deg` } as React.CSSProperties}>
                                          {renderReactionIcon(type)}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <div className="z-10 flex items-center justify-center">{renderReactionIcon(type)}</div>
                                  <span className="z-10 text-[13px] font-bold dark:text-white">{displayCount}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {comment.audio && <AudioPlayer time={comment.audio} />}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <nav className={`fixed inset-x-4 bottom-6 z-40 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isScrollingDown ? 'translate-y-[150%]' : 'translate-y-0'} pointer-events-none`}>
          <div className="pointer-events-auto relative flex items-center justify-between rounded-[40px] bg-white/40 dark:bg-neutral-800/40 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl border border-white/50 dark:border-white/10 mx-auto max-w-[500px] animate-drop-bounce">
            <div className="absolute inset-y-1.5 inset-x-1.5 z-0 pointer-events-none">
              <div
                className="h-full w-1/3 rounded-[32px] bg-neutral-500/70 dark:bg-white/20 border border-white/40 dark:border-white/10 shadow-md transition-transform duration-500"
                style={{ transform: `translateX(${NAV.findIndex(n => n.label === active) * 100}%)`, transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
            </div>
            {NAV.map(({ icon: Icon, label }) => {
              const isActive = active === label
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setActive(label); setSelectedCategory(null); }}
                  className={`relative z-10 flex flex-1 flex-col items-center gap-1 rounded-full py-2.5 text-xs font-bold transition-all duration-300 active:scale-90 ${isActive ? 'text-white' : 'text-neutral-800 dark:text-neutral-400'}`}
                >
                  <Icon className="h-[26px] w-[26px]" strokeWidth={2.5} />
                  {label}
                </button>
              )
            })}
          </div>
        </nav>

        {active === 'Комментарии' && (
          <nav className={`fixed inset-x-0 bottom-8 z-40 flex justify-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none ${isScrollingDown ? 'translate-y-0' : 'translate-y-[150%]'}`}>
            <div className="pointer-events-auto flex items-center gap-2 rounded-[40px] bg-white/40 dark:bg-neutral-800/40 p-[6px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl border border-white/50 dark:border-white/10">
              <button className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/90 dark:bg-white/20 text-neutral-600 dark:text-white shadow-sm transition-all duration-300 hover:bg-white dark:hover:bg-white/30 active:scale-90">
                <Plus className="h-7 w-7" strokeWidth={3} />
              </button>
              <button className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/90 dark:bg-white/20 text-neutral-600 dark:text-white shadow-sm transition-all duration-300 hover:bg-white dark:hover:bg-white/30 active:scale-90">
                <Mic className="h-7 w-7" strokeWidth={2.5} />
              </button>
            </div>
          </nav>
        )}

        {selectedTag && TAG_DETAILS[selectedTag] && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedTag(null)} />
            <div className="animate-slideUp relative flex max-h-[85%] w-full flex-col overflow-hidden rounded-t-[60px] bg-[#EAEAEA] dark:bg-neutral-900 shadow-2xl">
              <button 
                className="absolute right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-black/40 text-neutral-800 dark:text-white shadow-sm backdrop-blur-md transition-all active:scale-90 hover:bg-white dark:hover:bg-black/60 animate-scale-in"
                onClick={() => setSelectedTag(null)}
              >
                <X className="h-6 w-6" strokeWidth={2.5} />
              </button>
              
              <div className="flex-1 overflow-y-auto pb-12 no-scrollbar">
                <div className="relative w-full h-[300px] bg-neutral-300 dark:bg-neutral-800">
                  <img src={TAG_DETAILS[selectedTag].img} alt={selectedTag} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#EAEAEA] dark:from-neutral-900 to-transparent" />
                </div>
                <div className="px-7 pt-4 relative z-10 -mt-10">
                  <span className="inline-block rounded-full bg-white/80 dark:bg-white/10 px-4 py-1.5 text-sm font-bold text-neutral-700 dark:text-neutral-300 shadow-sm mb-3 backdrop-blur-md border border-white/40 dark:border-white/10">
                    {selectedTag}
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight mb-4 dark:text-white">{TAG_DETAILS[selectedTag].title}</h2>
                  <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-300">
                    {TAG_DETAILS[selectedTag].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCategory(null)} />

            <div className="animate-slideUp relative flex h-[92%] w-full flex-col overflow-hidden rounded-t-[60px] bg-[#EAEAEA] dark:bg-neutral-900 shadow-2xl">
              <button 
                className="absolute right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-black/40 text-neutral-800 dark:text-white shadow-sm backdrop-blur-md transition-all active:scale-90 hover:bg-white dark:hover:bg-black/60 animate-scale-in"
                onClick={() => setSelectedCategory(null)}
              >
                <X className="h-6 w-6" strokeWidth={2.5} />
              </button>

              {mediaSubTab === 'Фильм' ? (
                <div className="absolute inset-0 bg-neutral-400 dark:bg-neutral-800 z-40 animate-fade-in">
                  {MEDIA_DATA[selectedCategory].film && (
                    <img src={MEDIA_DATA[selectedCategory].film!} alt="Film cover" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                  <div className="absolute left-5 top-5 flex items-center gap-3 z-50">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-black/40 text-neutral-800 dark:text-white backdrop-blur-md transition-all active:scale-90 hover:bg-white dark:hover:bg-black/60 animate-scale-in" style={{animationDelay: '100ms'}}><Share2 className="h-5 w-5" strokeWidth={2.5} /></button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-black/40 text-neutral-800 dark:text-white backdrop-blur-md transition-all active:scale-90 hover:bg-white dark:hover:bg-black/60 animate-scale-in" style={{animationDelay: '200ms'}}><RotateCcw className="h-5 w-5" strokeWidth={2.5} /></button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-black/40 text-neutral-800 dark:text-white backdrop-blur-md transition-all active:scale-90 hover:bg-white dark:hover:bg-black/60 animate-scale-in" style={{animationDelay: '300ms'}}><VolumeX className="h-5 w-5" strokeWidth={2.5} /></button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-4 pb-32 pt-20 no-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(mediaSubTab === 'Фото' ? MEDIA_DATA[selectedCategory].photos : MEDIA_DATA[selectedCategory].videos).map((imgPath, index) => {
                      const isWide = index === 0 || index > 2;
                      return (
                        <div 
                          key={index} 
                          className={`relative w-full ${isWide ? 'aspect-video col-span-2 md:col-span-1' : 'aspect-square col-span-1'} overflow-hidden rounded-[30px] bg-neutral-300 dark:bg-neutral-800 animate-fade-blur`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {imgPath && <img src={imgPath} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />}
                          {mediaSubTab === 'Видео' && <PlayIconOverlay />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="absolute bottom-8 inset-x-4 z-50 flex items-center gap-2 animate-drop-bounce" style={{ animationDelay: '200ms' }}>
                <div className="relative flex flex-1 items-center justify-between rounded-[30px] bg-white/40 dark:bg-neutral-800/40 p-[5px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl border border-white/50 dark:border-white/10">
                  <div className="absolute inset-y-[5px] inset-x-[5px] z-0 pointer-events-none">
                    <div
                      className="h-full w-[calc(100%/3)] rounded-[25px] bg-neutral-500/70 dark:bg-white/20 border border-white/40 dark:border-white/10 shadow-sm transition-transform duration-500"
                      style={{ transform: `translateX(${['Фото', 'Видео', 'Фильм'].indexOf(mediaSubTab) * 100}%)`, transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    />
                  </div>
                  {['Фото', 'Видео', 'Фильм'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setMediaSubTab(tab as any)}
                      className={`relative z-10 flex-1 rounded-[25px] py-3 text-[16px] font-bold transition-all duration-300 active:scale-95 ${mediaSubTab === tab ? 'text-white' : 'text-neutral-800 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-white/40 dark:bg-neutral-800/40 text-neutral-700 dark:text-white shadow-lg backdrop-blur-xl border border-white/50 dark:border-white/10 transition-all duration-300 hover:bg-white/60 dark:hover:bg-neutral-700/60 active:scale-90">
                  <LayoutGrid className="h-7 w-7" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}