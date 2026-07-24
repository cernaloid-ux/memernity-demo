'use client'

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { supabase } from '../supabase'
import {
  Bookmark,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Flame,
  Heart,
  ImageIcon,
  LayoutGrid,
  Grid3x3,
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
  Check,
  Send,
  Wand2,
  ImagePlus,
  FileEdit,
  Settings,
  HardDrive,
  HelpCircle,
  LogOut,
  QrCode,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  Briefcase,
  GraduationCap,
  Home,
  Globe,
  Plane,
  Music,
  Camera,
  Coffee,
  Car,
  Dumbbell,
  Gamepad,
  Palette,
  Book,
  Trophy,
  TreePine,
  Anchor,
  Award,
  Bike,
  Binoculars,
  Code,
  Compass,
  Crosshair,
  Crown,
  Film,
  Hammer,
  Key,
  Laptop,
  Library,
  Medal,
  Mountain,
  Paintbrush,
  Rocket,
  Shield,
  Shirt,
  Sparkles,
  Star,
  Target,
  Tent,
  Wrench,
  Utensils,
  Video,
  Watch,
  Navigation,
  Copy,
  Lightbulb,
  SkipForward,
  RefreshCw
} from 'lucide-react'

// --- БИБЛИОТЕКА ИКОНОК ---
const ICON_LIBRARY: Record<string, React.ElementType> = {
  SquareUser, Zap, Users, Heart, Bookmark, Briefcase, GraduationCap, Home, Globe, Plane, Music, Camera, Coffee, Car, Dumbbell, Gamepad, Palette, Book, Trophy, TreePine, Anchor, Award, Bike, Binoculars, Code, Compass, Crosshair, Crown, Film, Hammer, Key, Laptop, Library, Medal, Mountain, Paintbrush, Rocket, Shield, Shirt, Sparkles, Star, Target, Tent, Wrench, Utensils, Video, Watch, Lightbulb, SkipForward
}

// --- СПИСОК РОЛЕЙ ДЛЯ КОММЕНТАРИЕВ ---
const ROLES_DATA = [
  { label: 'Муж', cat: 'Семья' }, { label: 'Жена', cat: 'Семья' },
  { label: 'Сын', cat: 'Семья' }, { label: 'Дочь', cat: 'Семья' },
  { label: 'Отец', cat: 'Семья' }, { label: 'Мать', cat: 'Семья' },
  { label: 'Брат', cat: 'Семья' }, { label: 'Сестра', cat: 'Семья' },
  { label: 'Бабушка', cat: 'Семья' }, { label: 'Дедушка', cat: 'Семья' },
  { label: 'Крестный(ая)', cat: 'Семья' }, { label: 'Родственник', cat: 'Семья' },
  { label: 'Друг', cat: 'Друзья' }, { label: 'Подруга', cat: 'Друзья' },
  { label: 'Партнер', cat: 'Друзья' }, { label: 'Коллега', cat: 'Друзья' },
  { label: 'Знакомый', cat: 'Друзья' }
]

// --- КОМПОНЕНТЫ ---
function RoundButton({
  children,
  className = '',
  onClick,
  id
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  id?: string
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/70 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 shadow-sm transition-all duration-500 hover:bg-white dark:hover:bg-neutral-700 active:scale-90 ${className}`}
    >
      {children}
    </button>
  )
}

function PlayIconOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-colors duration-500">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800/60 pl-1 backdrop-blur-sm shadow-lg animate-scale-in transition-colors duration-500">
        <Play className="h-6 w-6 fill-white text-white" strokeWidth={2.5} />
      </div>
    </div>
  )
}

function ExpandableCard({
  title,
  subtitle,
  content,
  isNew,
  onSpeak,
  isSpeaking,
}: {
  title: string
  subtitle?: string
  content: string
  isNew?: boolean
  onSpeak?: () => void
  isSpeaking?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className={`mt-4 overflow-hidden rounded-[40px] bg-white/60 dark:bg-neutral-800/80 shadow-sm transition-colors duration-500 hover:bg-white/80 dark:hover:bg-neutral-800 ${isNew ? 'animate-slideUp' : ''}`}>
      <div
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 active:scale-[0.98] transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col">
          <span className="text-[19px] font-bold leading-snug dark:text-white transition-colors duration-500">
            {title}
          </span>
          {subtitle && (
            <span className="mt-0.5 text-[14px] font-medium text-neutral-600 dark:text-neutral-400 transition-colors duration-500">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isOpen && onSpeak && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSpeak(); }}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors duration-500 hover:bg-neutral-100 dark:hover:bg-neutral-600 active:scale-90 animate-scale-in ${
                isSpeaking ? 'bg-[#007AFF] text-white animate-pulse' : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-white'
              }`}
            >
              {isSpeaking ? <VolumeX className="h-5 w-5" strokeWidth={2.5} /> : <Volume2 className="h-5 w-5" strokeWidth={2.5} />}
            </button>
          )}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/80 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors duration-500 hover:bg-neutral-300 dark:hover:bg-white/20"
          >
            <ChevronDown
              className={`h-6 w-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isOpen ? 'rotate-180' : ''
              }`}
              strokeWidth={3}
            />
          </button>
        </div>
      </div>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-7 text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap transition-colors duration-500">
            {content}
          </p>
        </div>
      </div>
    </section>
  )
}

// --- МОДАЛКА КЛАДБИЩА (iOS Apple Maps Style) ---
function CemeteryModal({ cemeteryInfo, setCemeteryInfo, onClose, onSave, isOwner, showToast, uploadFileToSupabase }: {
  cemeteryInfo: any,
  setCemeteryInfo: (v: any) => void,
  onClose: () => void,
  onSave: (v: any) => Promise<void>,
  isOwner: boolean,
  showToast: (msg: string) => void,
  uploadFileToSupabase: (file: File, pathPrefix: string) => Promise<string | null>,
}) {
  const [isEditingCem, setIsEditingCem] = useState(false)
  const [draft, setDraft] = useState(cemeteryInfo)
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null)
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEmpty = !cemeteryInfo.name && !cemeteryInfo.sector

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    showToast('Загрузка фото...')
    const url = await uploadFileToSupabase(file, 'cemetery')
    if (url) {
      const updated = { ...cemeteryInfo, photoUrl: url }
      setCemeteryInfo(updated)
      setDraft(updated)
      await onSave(updated)
      showToast('Фотография сохранена')
    }
  }

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=47.0105&longitude=28.8638&current=temperature_2m,weather_code')
      .then(r => r.json())
      .then(d => setWeather({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code }))
      .catch(() => {})
  }, [])

  const weatherLabel = (code: number, temp: number) => {
    if (code === 0) return `☀️ +${temp}°C, ясно, Кишинёв`
    if (code <= 3) return `🌤️ +${temp}°C, облачно, Кишинёв`
    if (code <= 49) return `🌫️ +${temp}°C, туман, Кишинёв`
    if (code <= 69) return `🌧️ +${temp}°C, дождь, Кишинёв`
    if (code <= 79) return `❄️ +${temp}°C, снег, Кишинёв`
    if (code <= 99) return `⛈️ +${temp}°C, гроза, Кишинёв`
    return `🌡️ +${temp}°C, Кишинёв`
  }

  const handleDraftChange = (field: string, value: string) => {
    setDraft({ ...draft, [field]: value })
  }

  const handleAutofill = () => {
    const n = draft.name.toLowerCase()
    let schedule = 'Ежедневно 08:00 – 17:00'
    let transit = 'Уточняйте городские маршруты'

    if (n.includes('дойна') || n.includes('лазаря')) {
      schedule = 'Ежедневно 07:00 – 18:00'
      transit = 'Автобусы: 27, 28, 38, маршрутки 134, 162'
    } else if (n.includes('армянское') || n.includes('центральное')) {
      transit = 'Троллейбусы: 2, 3, 9, 10, 24, автобусы 9, 11'
    }

    setDraft({ ...draft, schedule, transit })
  }

  const handleSave = async () => {
    await onSave(draft)
    setIsEditingCem(false)
  }

  const handleCancel = () => {
    setDraft(cemeteryInfo)
    setIsEditingCem(false)
  }

  return (
    <div className="fixed inset-0 z-[90] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[32px] animate-slideUp z-10 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Грейпер */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        </div>

        <div className="px-5 pb-10 pt-2">
          {/* Шапка */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[12px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-0.5">Место упокоения</p>
              <h3 className="text-[22px] font-bold dark:text-white leading-tight">{cemeteryInfo.name || 'Не указано'}</h3>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isOwner && !isEditingCem && (
                <button onClick={() => { setDraft(cemeteryInfo); setIsEditingCem(true); }} className="flex items-center gap-1.5 bg-[#007AFF]/10 text-[#007AFF] rounded-full px-3 py-1.5 text-[13px] font-bold active:scale-90 transition-all">
                  <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} /> Изменить
                </button>
              )}
              {isEditingCem && (
                <>
                  <button onClick={handleCancel} className="text-[13px] font-bold text-neutral-500 px-3 py-1.5 rounded-full bg-neutral-200 dark:bg-white/10 active:scale-90">Отмена</button>
                  <button onClick={handleSave} className="text-[13px] font-bold text-white px-3 py-1.5 rounded-full bg-[#007AFF] active:scale-90">Готово</button>
                </>
              )}
              <button onClick={onClose} className="p-1.5 bg-neutral-200 dark:bg-white/10 rounded-full active:scale-90">
                <X className="w-4 h-4 dark:text-white" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Empty State */}
          {isEmpty && !isEditingCem ? (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-16 h-16 bg-neutral-200 dark:bg-white/10 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-neutral-400" strokeWidth={2} />
              </div>
              <p className="text-[16px] font-bold text-neutral-600 dark:text-neutral-300">Место упокоения ещё не указано</p>
              {isOwner && (
                <button onClick={() => { setDraft(cemeteryInfo); setIsEditingCem(true); }} className="flex items-center gap-2 bg-[#007AFF] text-white rounded-2xl px-6 py-3 text-[15px] font-bold shadow-lg active:scale-95 transition-all">
                  <MapPin className="w-4 h-4" strokeWidth={2.5} /> Добавить информацию
                </button>
              )}
            </div>
          ) : isEditingCem ? (
            // Форма редактирования
            <div className="flex flex-col gap-3 mb-5">
              <button onClick={handleAutofill} className="flex items-center justify-center gap-2 bg-[#007AFF]/10 text-[#007AFF] rounded-[16px] py-3 text-[14px] font-bold active:scale-95 transition-all">
                <RefreshCw className="w-4 h-4" /> ✨ Подтянуть данные кладбища
              </button>
              
              <div className="bg-white dark:bg-white/10 rounded-[16px] p-3 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Фотография места</p>
                  <p className="text-[13px] text-neutral-600 dark:text-neutral-300">{draft.photoUrl ? 'Фото загружено' : 'Фото не выбрано'}</p>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[13px] font-bold active:scale-95 text-[#007AFF]">
                  {draft.photoUrl ? 'Изменить' : 'Загрузить'}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </div>

              {[
                { field: 'name', label: 'Название кладбища', placeholder: 'Кладбище «Святого Лазаря» (Дойна)' },
                { field: 'sector', label: 'Сектор / Квартал / Место', placeholder: 'Сектор 12, Квартал 4, Место 12' },
                { field: 'schedule', label: 'Часы работы', placeholder: 'Ежедневно 07:00 – 18:00' },
                { field: 'note', label: 'Полезно знать (заметка)', placeholder: '' },
                { field: 'transit', label: 'Транспорт', placeholder: 'Автобусы...' },
              ].map(({ field, label, placeholder }) => (
                <div key={field} className="bg-white dark:bg-white/10 rounded-[16px] p-3 shadow-sm">
                  <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1">{label}</p>
                  <input
                    value={(draft as any)[field]}
                    onChange={(e) => handleDraftChange(field, e.target.value)}
                    className="w-full bg-transparent text-[15px] dark:text-white outline-none"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Три кнопки действия */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button onClick={() => window.open(`https://maps.apple.com/?q=${encodeURIComponent(cemeteryInfo.name)}`, '_blank')} className="flex flex-col items-center gap-2 bg-white dark:bg-white/10 rounded-[20px] py-4 px-2 shadow-sm active:scale-95 transition-all">
                  <div className="w-11 h-11 bg-[#007AFF]/10 rounded-full flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-[#007AFF]" strokeWidth={2} />
                  </div>
                  <span className="text-[12px] font-bold text-neutral-700 dark:text-neutral-200">Добраться</span>
                </button>

                <button onClick={() => {
                  const routeUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cemeteryInfo.name + ' ' + (cemeteryInfo.sector || ''))}`;
                  navigator.clipboard.writeText(routeUrl);
                  showToast('Умная ссылка на маршрут скопирована!');
                }} className="flex flex-col items-center gap-2 bg-white dark:bg-white/10 rounded-[20px] py-4 px-2 shadow-sm active:scale-95 transition-all">
                  <div className="w-11 h-11 bg-[#007AFF]/10 rounded-full flex items-center justify-center">
                    <Copy className="w-5 h-5 text-[#007AFF]" strokeWidth={2} />
                  </div>
                  <span className="text-[12px] font-bold text-neutral-700 dark:text-neutral-200">Копировать</span>
                </button>

                <button onClick={() => {
                  if (cemeteryInfo.photoUrl) {
                    setFullscreenPhoto(cemeteryInfo.photoUrl);
                  } else if (isOwner) {
                    fileInputRef.current?.click();
                  } else {
                    showToast('Фотография не загружена');
                  }
                }} className="flex flex-col items-center gap-2 bg-white dark:bg-white/10 rounded-[20px] py-4 px-2 shadow-sm active:scale-95 transition-all relative">
                  <div className="w-11 h-11 bg-[#007AFF]/10 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-[#007AFF]" strokeWidth={2} />
                  </div>
                  <span className="text-[12px] font-bold text-neutral-700 dark:text-neutral-200">Фотография</span>
                  {!cemeteryInfo.photoUrl && isOwner && (
                     <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"><Pencil className="w-3 h-3 text-[#007AFF]" /></div>
                  )}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </div>

              {/* Блоки информации */}
              <div className="flex flex-col gap-3 mb-4">
                {cemeteryInfo.note && (
                  <div className="bg-white dark:bg-white/10 rounded-[20px] p-4 shadow-sm">
                    <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2">Полезно знать</p>
                    <p className="text-[15px] text-neutral-800 dark:text-neutral-200 leading-relaxed">{cemeteryInfo.note}</p>
                  </div>
                )}
                <div className="bg-white dark:bg-white/10 rounded-[20px] p-4 shadow-sm">
                  <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2">Локация</p>
                  {cemeteryInfo.sector && <p className="text-[15px] font-bold text-neutral-800 dark:text-neutral-200">{cemeteryInfo.sector}</p>}
                  {cemeteryInfo.schedule && <p className="text-[14px] text-neutral-600 dark:text-neutral-400 mt-1">{cemeteryInfo.schedule}</p>}
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
                    {weather ? weatherLabel(weather.code, weather.temp) : '⏳ Загрузка погоды...'}
                  </p>
                  {cemeteryInfo.transit && <p className="text-[13px] text-[#007AFF] mt-2 font-medium">{cemeteryInfo.transit}</p>}
                </div>
              </div>

              {/* Кнопки навигации */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.open(`https://maps.apple.com/?q=${encodeURIComponent(cemeteryInfo.name)}`, '_blank')}
                  className="flex items-center justify-center gap-2.5 bg-white dark:bg-white/10 rounded-[20px] py-4 shadow-sm active:scale-95 transition-all"
                >
                  <img src="/images/AppleMaps.ico.png" alt="Apple Maps" className="w-6 h-6 object-contain" />
                  <span className="text-[14px] font-bold text-neutral-800 dark:text-neutral-100">Apple Maps</span>
                </button>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cemeteryInfo.name)}`, '_blank')}
                  className="flex items-center justify-center gap-2.5 bg-white dark:bg-white/10 rounded-[20px] py-4 shadow-sm active:scale-95 transition-all"
                >
                  <img src="/images/GoogleMaps.ico.png" alt="Google Maps" className="w-6 h-6 object-contain" />
                  <span className="text-[14px] font-bold text-neutral-800 dark:text-neutral-100">Google Maps</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* FULLSCREEN PHOTO */}
      {fullscreenPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col backdrop-blur-xl">
          <div className="flex justify-between items-center p-6">
            <h3 className="text-white font-bold tracking-widest text-[14px] uppercase">Фотография места</h3>
            <button onClick={() => setFullscreenPhoto(null)} className="p-3 bg-white/10 rounded-full active:scale-90 transition-colors hover:bg-white/20">
              <X className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
             <img src={fullscreenPhoto} alt="Cemetery" className="max-w-full max-h-full object-contain rounded-[20px] shadow-2xl" />
          </div>
          {isOwner && (
             <div className="p-6 flex justify-center pb-12">
               <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white/10 text-white rounded-[20px] px-6 py-4 text-[15px] font-bold shadow-lg active:scale-95 transition-all hover:bg-white/20">
                 <Camera className="w-5 h-5" strokeWidth={2.5} /> Обновить фотографию
               </button>
             </div>
          )}
        </div>
      )}
    </div>
  )
}

// --- ОСНОВНОЙ ЭКРАН ---
export default function Page() {
  const params = useParams()
  const profileId = params?.id as string || 'demo-profile'

  // === СИСТЕМНЫЕ СТЕЙТЫ АВТОРИЗАЦИИ ===
  const [user, setUser] = useState<any>(null)
  const [owner, setOwner] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [active, setActive] = useState('Биография')

  // === СТЕЙТЫ РЕДАКТИРОВАНИЯ И БЭКАП ===
  const [isEditing, setIsEditing] = useState(false)
  const [backupData, setBackupData] = useState<any>(null)
  
  // POPUPS
  const [showCancelAlert, setShowCancelAlert] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<string | null>(null)
  const [factToDelete, setFactToDelete] = useState<number | null>(null)
  const [bioSectionToDelete, setBioSectionToDelete] = useState<string | null>(null)
  const [letterToDelete, setLetterToDelete] = useState(false)

  const [profileName, setProfileName] = useState('')
  const [profileDates, setProfileDates] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')

  // === СУПЕР-ТЕГИ ===
  const [tags, setTags] = useState<any[]>([])
  const [viewingTag, setViewingTag] = useState<any | null>(null)
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editTagData, setEditTagData] = useState<any>({})

  // === ДАННЫЕ БИОГРАФИИ ===
  const [facts, setFacts] = useState<any[]>([])
  const [editingFactId, setEditingFactId] = useState<number | null>(null)

  const [bioSections, setBioSections] = useState<any[]>([])
  
  // ПИСЬМО ПОТОМКАМ
  const [showLetter, setShowLetter] = useState(true)
  const [letterIsNew, setLetterIsNew] = useState(false)
  const [letterText, setLetterText] = useState('')

  // === МЕДИА ===
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [mediaSubTab, setMediaSubTab] = useState<'Фото' | 'Видео' | 'Фильм'>('Фото')
  const [mediaViewMode, setMediaViewMode] = useState<'masonry' | 'grid'>('masonry')
  
  const [mediaCategories, setMediaCategories] = useState<any[]>([])
  
  const [photoToDelete, setPhotoToDelete] = useState<{catId: string, type: 'photos' | 'videos', index: number} | null>(null)
  const [catToDelete, setCatToDelete] = useState<string | null>(null)

  // Drag and Drop (Сортировка фото)
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)

  const [fsData, setFsData] = useState<{url: string, index: number, list: string[]} | null>(null)
  const [fsZoom, setFsZoom] = useState(1)
  const [fsRotation, setFsRotation] = useState(0)

  // === КОММЕНТАРИИ ===
  const [comments, setComments] = useState<any[]>([])
  const [commentFilter, setCommentFilter] = useState('Все')
  const [userReactions, setUserReactions] = useState<Record<number, string>>({})
  const [activeReactionAnim, setActiveReactionAnim] = useState<string | null>(null)
  
  const [showNewCommentPopup, setShowNewCommentPopup] = useState(false)
  const [newCommentData, setNewCommentData] = useState({ author: '', role: '', category: '', text: '', avatar: '' })
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null)

  // === ИИ ШТОРКИ ===
  const [showAiSheet, setShowAiSheet] = useState(false)
  const [showAiChat, setShowAiChat] = useState(false)
  const [showPhotoRestore, setShowPhotoRestore] = useState(false)
  const [showTextFix, setShowTextFix] = useState(false)
  const [showCemeteryModal, setShowCemeteryModal] = useState(false)
  const [isEditingCemetery, setIsEditingCemetery] = useState(false)
  const [cemeteryDraft, setCemeteryDraft] = useState({ name: '', sector: '', schedule: '', note: '', transit: '' })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  // === ДАННЫЕ ПРОФИЛЯ (ДОП) ===
  const [bgColor, setBgColor] = useState('#E5E5E5')
  const [cemeteryInfo, setCemeteryInfo] = useState({
    name: '',
    sector: '',
    schedule: '',
    note: '',
    transit: ''
  })

  // === TTS ===
  const [ttsSectionId, setTtsSectionId] = useState<string | null>(null)

  const speakText = (text: string, id: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    if (ttsSectionId === id) {
      window.speechSynthesis.cancel()
      setTtsSectionId(null)
      return
    }
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'ru-RU'
    utt.rate = 0.95
    utt.onend = () => setTtsSectionId(null)
    utt.onerror = () => setTtsSectionId(null)
    setTtsSectionId(id)
    window.speechSynthesis.speak(utt)
  }

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const handleShare = async () => {
    const shareData = {
      title: `Память о ${profileName}`,
      text: `Страница памяти и биография ${profileName} на Memernity`,
      url: window.location.href,
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href)
      showToast('Ссылка скопирована')
    }
  }

  // === SUPABASE ===
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', profileId).single();
      if (data) {
        if (data.profile_name) setProfileName(data.profile_name);
        if (data.bio_sections) setBioSections(data.bio_sections);
        if (data.tags) setTags(data.tags);
        if (data.facts) setFacts(data.facts);
        if (data.letter_text) setLetterText(data.letter_text);
        if (data.profile_image) setAvatarUrl(data.profile_image);
        if (data.cover_image) setCoverUrl(data.cover_image);
        if (data.media_categories) setMediaCategories(data.media_categories);
        if (data.bg_color) setBgColor(data.bg_color);
        if (data.cemetery_info) setCemeteryInfo(data.cemetery_info);
      }
    };
    fetchProfile();
  }, [profileId]);

  const saveProfileToDb = async (updatedData: any = {}) => {
    const { error } = await supabase.from('profiles').upsert({
      id: profileId,
      profile_name: updatedData.profileName ?? profileName,
      profile_image: updatedData.avatarUrl ?? avatarUrl,
      cover_image: updatedData.coverUrl ?? coverUrl,
      bio_sections: updatedData.bioSections ?? bioSections,
      tags: updatedData.tags ?? tags,
      facts: updatedData.facts ?? facts,
      letter_text: updatedData.letterText ?? letterText,
      media_categories: updatedData.mediaCategories ?? mediaCategories,
      bg_color: updatedData.bgColor ?? bgColor,
      cemetery_info: updatedData.cemeteryInfo ?? cemeteryInfo,
    });
    
    if (error) console.error("Ошибка сохранения:", error.message || error);
  };
  
  const CHAT_KEY = `chat_history_${profileId}`

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
    api: '/api/chat',
    body: {
      profileContext: {
        profileName,
        facts,
        tags,
        bioSections,
        comments,
      }
    },
    onFinish: () => {
      // сохраняем историю после каждого завершённого ответа
    },
  })
  const [isInitializing, setIsInitializing] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Авторазмер textarea
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  // Голосовой ввод (Web Speech API)
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Голосовой ввод не поддерживается в этом браузере.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'ru-RU'
    recognition.interimResults = false
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + (prev ? ' ' : '') + transcript)
      // Триггерим авторесайз
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
      })
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const [isFixingText, setIsFixingText] = useState(false)
  const [fixedData, setFixedData] = useState<any>(null)

  const handleFixText = async () => {
    setIsFixingText(true)
    try {
      const res = await fetch('/api/fix-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileName, bioSections, tags, facts, letterText })
      })
      const data = await res.json()
      setFixedData(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsFixingText(false)
    }
  }

  const [selectedPhotoForRestore, setSelectedPhotoForRestore] = useState<string | null>(null)
  const [isRestoringPhoto, setIsRestoringPhoto] = useState(false)
  const [photoRestoreSuccess, setPhotoRestoreSuccess] = useState(false)

  const handlePhotoRestoreSubmit = async () => {
    setIsRestoringPhoto(true)
    try {
      await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, photoUrl: selectedPhotoForRestore })
      });
      setIsRestoringPhoto(false)
      setPhotoRestoreSuccess(true)
    } catch (e) {
      console.error(e)
      setIsRestoringPhoto(false)
    }
  }

  useEffect(() => {
    if (!showPhotoRestore) {
      setSelectedPhotoForRestore(null)
      setIsRestoringPhoto(false)
      setPhotoRestoreSuccess(false)
    }
  }, [showPhotoRestore])

  useEffect(() => {
    if (!showTextFix) {
      setFixedData(null)
    }
  }, [showTextFix])
  // === Синхронизация истории чата с localStorage ===
  // Восстанавливаем историю при монтировании
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
          setIsInitializing(false)
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Сохраняем историю при каждом изменении messages
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(CHAT_KEY, JSON.stringify(messages))
      } catch {}
    }
  }, [messages, CHAT_KEY])

  // Автоскролл вниз при новых сообщениях или открытии чата
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, showAiChat])

  // === ИИ ЧАТ: инициализация приветствия ===
  useEffect(() => {
    if (showAiChat) {
      // Если история уже есть (восстановлена из localStorage) — не добавляем приветствие
      if (messages.length > 0) {
        setIsInitializing(false)
        return
      }
      setIsInitializing(true)
      const t = setTimeout(() => {
        // Приветствие добавляется локально — без вызова API
        setMessages([{
          id: 'greeting-1',
          role: 'assistant',
          content: 'Здравствуйте! Я Memernity Intelligence. Чтобы создать красивую историю жизни, мне нужно задать вам несколько вопросов. Расскажите, как звали этого человека и кем он вам приходился?'
        }])
        setIsInitializing(false)
      }, 1500)
      return () => clearTimeout(t)
    } else {
      // При закрытии — НЕ очищаем историю (она сохранена в localStorage)
      setIsInitializing(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAiChat])

  // === ЛАЗЕРНЫЙ ГАЙД ===
  const [showGuide, setShowGuide] = useState(false)
  const [guideStep, setGuideStep] = useState(0)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, w: 0, h: 0, r: 0 })

  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const lastScrollY = useRef(0)

  const GUIDE_STEPS = [
    { targetId: 'guide-target-0', title: 'Местоположение', desc: 'Укажите точную геолокацию для навигации к месту памяти.' },
    { targetId: 'guide-target-1', title: 'Оформление', desc: 'Настройте световую или темную тему профиля под настроение.' },
    { targetId: 'guide-target-2', title: 'Режим редактирования', desc: 'Нажмите сюда, чтобы добавлять факты, загружать фото и менять иконки тегов.' },
    { targetId: 'guide-target-3', title: 'Memernity Intelligence', desc: 'Наш ИИ-помощник поможет написать красивую историю и восстановить старые фото.' },
    { targetId: 'guide-target-4', title: 'Навигация', desc: 'Переключайтесь между биографией, галереей и комментариями.' }
  ]

  // === УМНОЕ ХРАНИЛИЩЕ (ДИНАМИКА) ===
  const calculateStorage = () => {
    let sizeMB = 0.5 
    mediaCategories.forEach(cat => { sizeMB += cat.photos.length * 1.5; sizeMB += cat.covers.length * 1.0; })
    tags.forEach(tag => { if (tag.img) sizeMB += 1.0; })
    if (avatarUrl && !avatarUrl.includes('/images/')) sizeMB += 2.0
    if (coverUrl && !coverUrl.includes('/images/')) sizeMB += 3.0
    return Math.min(sizeMB, 30).toFixed(1)
  }
  const usedStorage = calculateStorage()
  const storagePercentage = Math.min((Number(usedStorage) / 30) * 100, 100)

  // === СЕТЕВАЯ ЛОГИКА (SUPABASE) ===
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (profileId && profileId !== 'demo-profile') {
        const { data } = await supabase.from('memorials').select('owner_id').eq('id', profileId).single()
        if (data) setOwner(data.owner_id)
      } else {
        setOwner(session?.user?.id || 'demo-owner')
      }
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [profileId])

  const claimMemorial = async () => {
    if (!user) {
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } })
      return
    }
    const { error } = await supabase.from('memorials').insert({ id: profileId, owner_id: user.id })
    if (!error) {
      setOwner(user.id)
      setShowGuide(true)
      setGuideStep(0)
    } else {
      alert(`Ошибка привязки: ${error.message}`)
    }
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsProfileOpen(false)
    setIsEditing(false)
    window.location.reload() 
  }

  const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  const isOwner = owner === user?.id || profileId === 'demo-profile'

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentY = e.currentTarget.scrollTop
    if (currentY <= 0) { setIsScrollingDown(false); lastScrollY.current = currentY; return }
    const diff = currentY - lastScrollY.current
    if (Math.abs(diff) > 5) { setIsScrollingDown(diff > 0); lastScrollY.current = currentY }
  }

  const updateSpotlight = () => {
    if (!showGuide) return
    const el = document.getElementById(GUIDE_STEPS[guideStep]?.targetId)
    if (el) {
      const rect = el.getBoundingClientRect()
      setSpotlight({ x: rect.left - 8, y: rect.top - 8, w: rect.width + 16, h: rect.height + 16, r: 24 })
    }
  }

  useLayoutEffect(() => {
    updateSpotlight()
    window.addEventListener('resize', updateSpotlight)
    return () => window.removeEventListener('resize', updateSpotlight)
  }, [guideStep, showGuide])

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDarkMode])

  useEffect(() => {
    if (selectedCategoryId || viewingTag || showNewCommentPopup || showAiChat || showPhotoRestore || showTextFix || fsData || photoToDelete || catToDelete || showCancelAlert || commentToDelete !== null || tagToDelete || factToDelete !== null || bioSectionToDelete || letterToDelete || isProfileOpen || showAuthPopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedCategoryId, viewingTag, showNewCommentPopup, showAiChat, showPhotoRestore, showTextFix, fsData, photoToDelete, catToDelete, showCancelAlert, commentToDelete, tagToDelete, factToDelete, bioSectionToDelete, letterToDelete, isProfileOpen, showAuthPopup])

  // === ФУНКЦИИ РЕДАКТИРОВАНИЯ И БЭКАПА ===
  const handleEditToggle = async () => {
    if (!isEditing) {
      setBackupData({
        profileName,
        profileDates,
        avatarUrl,
        coverUrl,
        tags: JSON.parse(JSON.stringify(tags)),
        facts: JSON.parse(JSON.stringify(facts)),
        bioSections: JSON.parse(JSON.stringify(bioSections)),
        mediaCategories: JSON.parse(JSON.stringify(mediaCategories)),
        letterText,
        showLetter,
        comments: JSON.parse(JSON.stringify(comments))
      })
      setIsEditing(true)
    } else {
      setBackupData(null)
      setIsEditing(false)
      await saveProfileToDb({})
      // Снимаем флаги новых элементов при сохранении
      setBioSections(prev => prev.map(s => ({ ...s, isNew: false })))
      setMediaCategories(prev => prev.map(c => ({ ...c, isNew: false })))
      setComments(prev => prev.map(c => ({ ...c, isNew: false })))
      setTags(prev => prev.map(t => ({ ...t, isNew: false })))
      setFacts(prev => prev.map(f => ({ ...f, isNew: false })))
      setLetterIsNew(false)
    }
  }

  const confirmCancelEdit = () => {
    if (backupData) {
      setProfileName(backupData.profileName)
      setProfileDates(backupData.profileDates)
      setAvatarUrl(backupData.avatarUrl)
      setCoverUrl(backupData.coverUrl)
      setTags(backupData.tags)
      setFacts(backupData.facts)
      setBioSections(backupData.bioSections)
      setMediaCategories(backupData.mediaCategories)
      setLetterText(backupData.letterText)
      setShowLetter(backupData.showLetter)
      setComments(backupData.comments)
    }
    setShowCancelAlert(false)
    setIsEditing(false)
  }

  // === ЗАГРУЗКА В SUPABASE STORAGE ===
  const uploadFileToSupabase = async (file: File, pathPrefix: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${pathPrefix}_${Date.now()}.${fileExt}`;
      const filePath = `${profileId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('memorial-media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Ошибка загрузки в Storage:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('memorial-media')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Непредвиденная ошибка при загрузке:', err);
      return null;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0]
    if (file) setter(URL.createObjectURL(file))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const publicUrl = await uploadFileToSupabase(file, 'avatar');
    if (publicUrl) {
      setAvatarUrl(publicUrl);
      await saveProfileToDb({ avatarUrl: publicUrl });
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const publicUrl = await uploadFileToSupabase(file, 'cover');
    if (publicUrl) {
      setCoverUrl(publicUrl);
      await saveProfileToDb({ coverUrl: publicUrl });
    }
  };

  const handleAddMediaPhoto = async (catId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const publicUrl = await uploadFileToSupabase(file, 'gallery');
    if (!publicUrl) return;
    setMediaCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id === catId) {
          const newPhotos = [...cat.photos, publicUrl];
          return {
            ...cat,
            photos: newPhotos,
            covers: cat.covers.length === 0 ? [publicUrl] : cat.covers
          };
        }
        return cat;
      });
      saveProfileToDb({ mediaCategories: updated });
      return updated;
    });
  }

  // Функции подтверждения удаления
  const confirmDeletePhoto = () => {
    if (photoToDelete) {
      setMediaCategories(prev => prev.map(cat => {
        if (cat.id === photoToDelete.catId) {
          const newList = [...cat[photoToDelete.type]]
          newList.splice(photoToDelete.index, 1)
          return {
            ...cat,
            [photoToDelete.type]: newList,
            covers: photoToDelete.type === 'photos' ? newList.slice(0, 3) : cat.covers
          }
        }
        return cat
      }))
      setPhotoToDelete(null)
    }
  }

  const confirmDeleteCat = () => {
    if (catToDelete) {
      setMediaCategories(prev => prev.filter(c => c.id !== catToDelete))
      setCatToDelete(null)
    }
  }

  const confirmDeleteComment = () => {
    if (commentToDelete !== null) {
      setComments(prev => prev.filter(c => c.id !== commentToDelete))
      setCommentToDelete(null)
    }
  }

  const confirmDeleteTag = () => {
    if (tagToDelete) {
      setTags(tags.filter(t => t.id !== tagToDelete))
      setTagToDelete(null)
      setEditingTagId(null)
    }
  }

  const confirmDeleteFact = () => {
    if (factToDelete !== null) {
      setFacts(facts.filter(f => f.id !== factToDelete))
      setFactToDelete(null)
    }
  }

  const confirmDeleteBioSection = () => {
    if (bioSectionToDelete) {
      setBioSections(bioSections.filter(s => s.id !== bioSectionToDelete))
      setBioSectionToDelete(null)
    }
  }

  const confirmDeleteLetter = () => {
    setShowLetter(false)
    setLetterText('')
    setLetterToDelete(false)
  }

  // Сортировка D&D в медиа
  const handleDrop = (dropIndex: number) => {
    if (draggedItemIndex === null || draggedItemIndex === dropIndex || !selectedCategoryId) return

    setMediaCategories(prev => prev.map(cat => {
      if (cat.id === selectedCategoryId) {
        const listName = mediaSubTab === 'Фото' ? 'photos' : 'videos'
        const newList = [...cat[listName]]
        const [movedItem] = newList.splice(draggedItemIndex, 1)
        newList.splice(dropIndex, 0, movedItem)
        return { ...cat, [listName]: newList, covers: listName === 'photos' ? newList.slice(0, 3) : cat.covers }
      }
      return cat
    }))
    setDraggedItemIndex(null)
  }

  const handleShareFullscreen = async () => {
    if (navigator.share && fsData?.url) {
      try { await navigator.share({ title: 'Memernity Media', url: fsData.url }) } catch (e) {}
    } else {
      navigator.clipboard.writeText(fsData?.url || '')
      alert('Ссылка скопирована!')
    }
  }

  const handleReaction = (commentId: number, type: 'infinity' | 'heart' | 'fire') => {
    if (userReactions[commentId] === type) {
      setUserReactions(prev => { const n = {...prev}; delete n[commentId]; return n; })
    } else {
      setUserReactions(prev => ({...prev, [commentId]: type}))
      setActiveReactionAnim(`${commentId}-${type}`)
      setTimeout(() => setActiveReactionAnim(null), 800)
    }
  }

  const renderReactionIcon = (type: string) => {
    if (type === 'infinity') return <img src="/images/LogoInfinityMemernitycomments.svg" alt="infinity" className="h-4 w-4 dark:invert transition-colors duration-500" />
    if (type === 'heart') return <Heart className="h-4 w-4 text-neutral-800 dark:text-white transition-colors duration-500" strokeWidth={2.5} />
    if (type === 'fire') return <Flame className="h-4 w-4 text-neutral-800 dark:text-white transition-colors duration-500" strokeWidth={2.5} />
  }

  const displayedComments = commentFilter === 'Все' ? comments : comments.filter(c => c.category === commentFilter)
  const activeCategoryData = mediaCategories.find(c => c.id === selectedCategoryId)

  if (loading) return <div className="flex h-screen items-center justify-center bg-neutral-900 text-white font-bold animate-pulse">Загрузка профиля...</div>
  
  if (!owner && profileId !== 'demo-profile') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-neutral-900 text-white text-center p-6">
        <div className="bg-black/40 p-10 rounded-[40px] border border-white/10 shadow-2xl max-w-md w-full">
          <h1 className="text-2xl font-bold mb-3">Мемориал свободен</h1>
          <p className="text-neutral-400 text-sm mb-8">QR-код <span className="font-mono text-white">{profileId}</span> не активирован.</p>
          <button onClick={claimMemorial} className="w-full bg-white text-black px-6 py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all">
            {user ? 'Создать страницу' : 'Войти через Google'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div 
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden text-neutral-900 dark:text-white transition-colors duration-500 font-sans dark:bg-zinc-950"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: isDarkMode ? '' : (bgColor || '#E5E5E5') }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dropBounce { 0% { transform: scale(0); opacity: 0; border-radius: 100px; } 40% { transform: scale(1.1); opacity: 1; border-radius: 40px; } 70% { transform: scale(0.95); opacity: 1; border-radius: 40px; } 100% { transform: scale(1); opacity: 1; border-radius: 40px; } }
          .animate-drop-bounce { animation: dropBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: center bottom; }
          @keyframes fadeBlurIn { 0% { opacity: 0; filter: blur(8px); transform: translateY(15px); } 100% { opacity: 1; filter: blur(0); transform: translateY(0); } }
          .animate-fade-blur { animation: fadeBlurIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          @keyframes scaleIn { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
          .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
          .animate-slideDown { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes firework { 0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0px) scale(0.5); opacity: 1; } 100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-45px) scale(1.2); opacity: 0; } }
          .animate-firework { animation: firework 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .edit-input { background: transparent; border-bottom: 1px dashed rgba(150,150,150,0.5); outline: none; transition: border-color 0.2s; width: 100%; }
          .edit-input:focus { border-bottom-color: #22c55e; }
          .edit-box { border: 2px dashed rgba(150,150,150,0.4); }
          @keyframes typingDots { 0%, 20% { content: '.'; } 40% { content: '..'; } 60%, 100% { content: '...'; } }
          .typing-indicator::after { content: ''; animation: typingDots 1.5s infinite; }
        `}} />

        {/* ФОНОВЫЕ ГРАДИЕНТЫ — только светлая тема */}
        {!isDarkMode && <>
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-[304px] z-0" style={{ background: 'linear-gradient(to bottom, #CDCDCD 0%, transparent 100%)' }} />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[304px] z-0" style={{ background: 'linear-gradient(to top, #CDCDCD 0%, transparent 100%)' }} />
        </>}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[290px] bg-gradient-to-t from-[#494949] dark:from-black to-transparent transition-colors duration-500" />

        {/* ================= ГАЙД (ЛАЗЕРНЫЙ) ================= */}
        {showGuide && (
          <div className="fixed inset-0 z-[999]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect x={spotlight.x} y={spotlight.y} width={spotlight.w} height={spotlight.h} rx={spotlight.r} fill="black" />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.75)" mask="url(#spotlight-mask)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <div className="absolute bottom-24 p-6 w-[90%] max-w-sm bg-neutral-900/95 backdrop-blur-2xl rounded-[40px] text-white border border-white/10 shadow-2xl animate-slideUp transition-colors duration-500">
                <span className="text-[#007AFF] font-bold text-[13px] uppercase tracking-wider mb-2 block">Шаг {guideStep + 1} из 5</span>
                <h3 className="text-[22px] font-bold">{GUIDE_STEPS[guideStep]?.title}</h3>
                <p className="mt-3 text-neutral-300 leading-relaxed text-[15px]">{GUIDE_STEPS[guideStep]?.desc}</p>
                <div className="mt-8 flex gap-3 justify-end items-center">
                  <button onClick={() => setShowGuide(false)} className="px-4 py-2 text-neutral-400 font-medium active:scale-95 transition-all text-sm">Пропустить</button>
                  <button onClick={() => { guideStep < 4 ? setGuideStep(p => p + 1) : setShowGuide(false) }} className="px-6 py-3 bg-white text-black rounded-full font-bold active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    {guideStep === 4 ? 'Начать' : 'Далее'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ПОПАП АВТОРИЗАЦИИ ДЛЯ ГОСТЕЙ ================= */}
        {showAuthPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500">
             <div className="bg-[#EAEAEA] dark:bg-neutral-900 rounded-[40px] p-7 w-[90%] max-w-sm text-center shadow-2xl animate-scale-in border border-white/10 transition-colors duration-500">
                <div className="w-16 h-16 bg-[#007AFF]/10 text-[#007AFF] rounded-full flex items-center justify-center mx-auto mb-4"><Pencil className="w-8 h-8" strokeWidth={2.5} /></div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white transition-colors duration-500">Режим редактирования</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-[15px] font-medium mb-8 px-2 transition-colors duration-500">Вносить изменения может только владелец профиля. Вы хотите войти в аккаунт создателя?</p>
                <div className="flex gap-3">
                   <button onClick={() => setShowAuthPopup(false)} className="flex-1 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white py-4 rounded-2xl font-bold shadow-sm active:scale-95 transition-all duration-500 px-2">Отмена</button>
                   <button onClick={() => { setShowAuthPopup(false); signInWithGoogle(); }} className="flex-1 bg-[#007AFF] text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform px-2">Войти</button>
                </div>
             </div>
          </div>
        )}

        {/* ================= АЛЕРТЫ УДАЛЕНИЯ (ВСЕ) ================= */}
        {showCancelAlert && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500">
             <div className="bg-[#EAEAEA] dark:bg-neutral-900 rounded-[40px] p-7 w-[90%] max-w-sm text-center shadow-2xl animate-scale-in border border-white/10 transition-colors duration-500">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500"><X className="w-8 h-8" strokeWidth={3} /></div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white transition-colors duration-500">Сбросить изменения?</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-[15px] font-medium mb-8 px-2 transition-colors duration-500">Все несохраненные данные будут утеряны. Вы уверены?</p>
                <div className="flex gap-3">
                   <button onClick={() => setShowCancelAlert(false)} className="flex-1 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white py-4 rounded-2xl font-bold shadow-sm active:scale-95 transition-all duration-500 px-2">Вернуться</button>
                   <button onClick={confirmCancelEdit} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-transform px-2">Сбросить</button>
                </div>
             </div>
          </div>
        )}

        {photoToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500">
             <div className="bg-[#EAEAEA] dark:bg-neutral-900 rounded-[40px] p-7 w-[90%] max-w-sm text-center shadow-2xl animate-scale-in border border-white/10 transition-colors duration-500">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500"><Trash2 className="w-8 h-8" strokeWidth={2.5} /></div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white transition-colors duration-500">Удалить медиа?</h3>
                <p className="text-red-500 text-[15px] font-bold mb-8 leading-relaxed px-2 transition-colors duration-500">Вы уверены? Это действие необратимо и фотография будет удалена.</p>
                <div className="flex gap-3">
                   <button onClick={() => setPhotoToDelete(null)} className="flex-1 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white py-4 rounded-2xl font-bold shadow-sm active:scale-95 transition-all duration-500 px-4">Отмена</button>
                   <button onClick={confirmDeletePhoto} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-transform px-4">Удалить</button>
                </div>
             </div>
          </div>
        )}

        {catToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500">
             <div className="bg-[#EAEAEA] dark:bg-neutral-900 rounded-[40px] p-7 w-[90%] max-w-sm text-center shadow-2xl animate-scale-in border border-white/10 transition-colors duration-500">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500"><Trash2 className="w-8 h-8" strokeWidth={2.5} /></div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white transition-colors duration-500">Удалить главу?</h3>
                <p className="text-red-500 text-[15px] font-bold mb-8 leading-relaxed px-2 transition-colors duration-500">Вы уверены? Все фотографии и видео в этой главе будут безвозвратно удалены.</p>
                <div className="flex gap-3">
                   <button onClick={() => setCatToDelete(null)} className="flex-1 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white py-4 rounded-2xl font-bold shadow-sm active:scale-95 transition-all duration-500 px-4">Отмена</button>
                   <button onClick={confirmDeleteCat} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-transform px-4">Удалить</button>
                </div>
             </div>
          </div>
        )}

        {commentToDelete !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500">
             <div className="bg-[#EAEAEA] dark:bg-neutral-900 rounded-[40px] p-7 w-[90%] max-w-sm text-center shadow-2xl animate-scale-in border border-white/10 transition-colors duration-500">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500"><Trash2 className="w-8 h-8" strokeWidth={2.5} /></div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white transition-colors duration-500">Удалить послание?</h3>
                <p className="text-red-500 text-[15px] font-bold mb-8 leading-relaxed px-2 transition-colors duration-500">Вы уверены? Это действие необратимо, и комментарий будет удален навсегда.</p>
                <div className="flex gap-3">
                   <button onClick={() => setCommentToDelete(null)} className="flex-1 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white py-4 rounded-2xl font-bold shadow-sm active:scale-95 transition-all duration-500 px-4">Отмена</button>
                   <button onClick={confirmDeleteComment} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-transform px-4">Удалить</button>
                </div>
             </div>
          </div>
        )}

        {tagToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500">
             <div className="bg-[#EAEAEA] dark:bg-neutral-900 rounded-[40px] p-7 w-[90%] max-w-sm text-center shadow-2xl animate-scale-in border border-white/10 transition-colors duration-500">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500"><Trash2 className="w-8 h-8" strokeWidth={2.5} /></div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white transition-colors duration-500">Удалить тег?</h3>
                <p className="text-red-500 text-[15px] font-bold mb-8 leading-relaxed px-2 transition-colors duration-500">Вы уверены? Тег будет удален из профиля.</p>
                <div className="flex gap-3">
                   <button onClick={() => setTagToDelete(null)} className="flex-1 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white py-4 rounded-2xl font-bold shadow-sm active:scale-95 transition-all duration-500 px-4">Отмена</button>
                   <button onClick={confirmDeleteTag} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-transform px-4">Удалить</button>
                </div>
             </div>
          </div>
        )}

        {factToDelete !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500">
             <div className="bg-[#EAEAEA] dark:bg-neutral-900 rounded-[40px] p-7 w-[90%] max-w-sm text-center shadow-2xl animate-scale-in border border-white/10 transition-colors duration-500">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500"><Trash2 className="w-8 h-8" strokeWidth={2.5} /></div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white transition-colors duration-500">Удалить факт?</h3>
                <p className="text-red-500 text-[15px] font-bold mb-8 leading-relaxed px-2 transition-colors duration-500">Вы уверены? Факт будет навсегда удален из списка.</p>
                <div className="flex gap-3">
                   <button onClick={() => setFactToDelete(null)} className="flex-1 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white py-4 rounded-2xl font-bold shadow-sm active:scale-95 transition-all duration-500 px-4">Отмена</button>
                   <button onClick={confirmDeleteFact} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-transform px-4">Удалить</button>
                </div>
             </div>
          </div>
        )}

        {bioSectionToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500">
             <div className="bg-[#EAEAEA] dark:bg-neutral-900 rounded-[40px] p-7 w-[90%] max-w-sm text-center shadow-2xl animate-scale-in border border-white/10 transition-colors duration-500">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500"><Trash2 className="w-8 h-8" strokeWidth={2.5} /></div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white transition-colors duration-500">Удалить главу биографии?</h3>
                <p className="text-red-500 text-[15px] font-bold mb-8 leading-relaxed px-2 transition-colors duration-500">Вы уверены? Текст этой главы будет потерян безвозвратно.</p>
                <div className="flex gap-3">
                   <button onClick={() => setBioSectionToDelete(null)} className="flex-1 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white py-4 rounded-2xl font-bold shadow-sm active:scale-95 transition-all duration-500 px-4">Отмена</button>
                   <button onClick={confirmDeleteBioSection} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-transform px-4">Удалить</button>
                </div>
             </div>
          </div>
        )}

        {letterToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500">
             <div className="bg-[#EAEAEA] dark:bg-neutral-900 rounded-[40px] p-7 w-[90%] max-w-sm text-center shadow-2xl animate-scale-in border border-white/10 transition-colors duration-500">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500"><Trash2 className="w-8 h-8" strokeWidth={2.5} /></div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white transition-colors duration-500">Удалить письмо?</h3>
                <p className="text-red-500 text-[15px] font-bold mb-8 leading-relaxed px-2 transition-colors duration-500">Вы уверены? Текст письма потомкам будет удален навсегда.</p>
                <div className="flex gap-3">
                   <button onClick={() => setLetterToDelete(false)} className="flex-1 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white py-4 rounded-2xl font-bold shadow-sm active:scale-95 transition-all duration-500 px-4">Отмена</button>
                   <button onClick={confirmDeleteLetter} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-transform px-4">Удалить</button>
                </div>
             </div>
          </div>
        )}

        {/* ================= ФУЛЛСКРИН ПРОСМОТР ФОТО ================= */}
        {fsData && (
          <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in transition-colors duration-500">
             <div className="flex justify-between items-center p-6 relative z-20">
               <button onClick={() => { setFsData(null); setFsZoom(1); setFsRotation(0); }} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all duration-500"><X className="w-6 h-6" strokeWidth={2.5} /></button>
               <button onClick={handleShareFullscreen} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all duration-500"><Share2 className="w-5 h-5" strokeWidth={2.5} /></button>
             </div>
             
             {fsData.index > 0 && (
                <button onClick={() => { setFsData({...fsData, url: fsData.list[fsData.index - 1], index: fsData.index - 1}); setFsZoom(1); }} className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full items-center justify-center text-white backdrop-blur-md active:scale-90 z-20 transition-all duration-300 hover:bg-white/20"><ChevronLeft className="w-8 h-8" strokeWidth={2.5} /></button>
             )}
             {fsData.index < fsData.list.length - 1 && (
                <button onClick={() => { setFsData({...fsData, url: fsData.list[fsData.index + 1], index: fsData.index + 1}); setFsZoom(1); }} className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full items-center justify-center text-white backdrop-blur-md active:scale-90 z-20 transition-all duration-300 hover:bg-white/20"><ChevronRight className="w-8 h-8" strokeWidth={2.5} /></button>
             )}

             <div className="flex-1 flex items-center justify-center overflow-hidden relative z-10 px-4">
                <img src={fsData.url} className="max-w-full max-h-full transition-transform duration-300 object-contain" style={{ transform: `scale(${fsZoom}) rotate(${fsRotation}deg)` }} alt="Fullscreen" />
             </div>
             
             <div className="pb-8 pt-4 flex flex-col items-center gap-4 relative z-20">
                <div className="flex md:hidden justify-center gap-12 w-full px-8">
                  <button onClick={() => { if(fsData.index > 0) { setFsData({...fsData, url: fsData.list[fsData.index - 1], index: fsData.index - 1}); setFsZoom(1); } }} className={`w-14 h-14 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all duration-300 ${fsData.index > 0 ? 'bg-white/10 hover:bg-white/20' : 'opacity-30'}`} disabled={fsData.index === 0}><ChevronLeft className="w-8 h-8" strokeWidth={2.5} /></button>
                  <button onClick={() => { if(fsData.index < fsData.list.length - 1) { setFsData({...fsData, url: fsData.list[fsData.index + 1], index: fsData.index + 1}); setFsZoom(1); } }} className={`w-14 h-14 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all duration-300 ${fsData.index < fsData.list.length - 1 ? 'bg-white/10 hover:bg-white/20' : 'opacity-30'}`} disabled={fsData.index === fsData.list.length - 1}><ChevronRight className="w-8 h-8" strokeWidth={2.5} /></button>
                </div>
                <div className="flex justify-center gap-6">
                  <button onClick={() => setFsZoom(z => Math.max(0.5, z - 0.5))} className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all duration-500 hover:bg-white/20"><ZoomOut className="w-6 h-6" strokeWidth={2.5} /></button>
                  <button onClick={() => setFsZoom(z => Math.min(3, z + 0.5))} className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all duration-500 hover:bg-white/20"><ZoomIn className="w-6 h-6" strokeWidth={2.5} /></button>
                  <button onClick={() => setFsRotation(r => r + 90)} className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all duration-500 hover:bg-white/20"><RotateCw className="w-6 h-6" strokeWidth={2.5} /></button>
                </div>
             </div>
          </div>
        )}

        {/* ================= ПОПАП ЛИЧНОГО КАБИНЕТА ================= */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-[60] flex flex-col justify-start">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-colors duration-500" onClick={() => setIsProfileOpen(false)} />
            <div className="animate-slideDown relative flex w-full flex-col overflow-hidden rounded-b-[50px] bg-[#EAEAEA] dark:bg-neutral-900 shadow-2xl pt-14 pb-8 px-6 transition-colors duration-500">
              <button onClick={() => setIsProfileOpen(false)} className="absolute right-5 top-12 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-black/40 text-neutral-800 dark:text-white shadow-sm backdrop-blur-md transition-all duration-500 active:scale-90"><X className="h-6 w-6" strokeWidth={2.5} /></button>
              
              <h2 className="text-2xl font-bold tracking-tight mb-6 dark:text-white">Личный кабинет</h2>

              {user ? (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 rounded-3xl bg-white/50 dark:bg-white/5 p-4 border border-white/40 dark:border-white/10 shadow-sm">
                    {googleAvatar ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 shadow-sm shrink-0">
                        <img src={googleAvatar} className="w-full h-full object-cover" alt="Profile" />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 text-xl font-bold">
                        {user.email?.[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Аккаунт создателя</span>
                      <span className="truncate text-lg font-bold dark:text-white">{user.email}</span>
                    </div>
                  </div>

                  {/* ДИНАМИЧЕСКОЕ ХРАНИЛИЩЕ */}
                  <div className="rounded-3xl bg-white/50 dark:bg-white/5 p-5 border border-white/40 dark:border-white/10 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-800 dark:text-white flex items-center gap-2"><HardDrive className="w-5 h-5 text-[#007AFF]" strokeWidth={2.5} /> Хранилище</span>
                      <span className="text-sm font-bold text-neutral-500">{usedStorage} МБ / 30 МБ</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2.5 mb-1 overflow-hidden">
                      <div className="bg-[#007AFF] h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${storagePercentage}%` }}></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Вес рассчитывается на основе загруженных медиафайлов и фотографий.</p>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <button className="flex items-center justify-between rounded-2xl bg-white/50 dark:bg-white/5 p-4 text-left font-bold transition-colors hover:bg-white/80 dark:hover:bg-white/10 border border-white/40 dark:border-white/10 shadow-sm">
                      <span className="dark:text-white text-neutral-800">Управление страницами близких</span>
                      <ChevronRight className="h-5 w-5 text-neutral-400" />
                    </button>
                    <button onClick={handleSignOut} className="flex items-center justify-center rounded-2xl bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400 transition-colors hover:bg-red-500/20 mt-2">
                      <LogOut className="w-4 h-4 mr-2" /> Выйти из аккаунта
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
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Войдите в систему, чтобы протестировать связь с базой данных и посмотреть панель управления.</p>
                  </div>
                  <button onClick={signInWithGoogle} className="w-full rounded-2xl bg-neutral-800 dark:bg-white py-4 text-[16px] font-bold text-white dark:text-black transition-transform hover:scale-[1.02] active:scale-95 shadow-xl mt-4">
                    Продолжить с Google
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* НАСТРОЙКА ТЕГА */}
        {editingTagId && (
          <div className="fixed inset-0 z-[300] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-colors duration-500" onClick={() => setEditingTagId(null)} />
             <div className="relative bg-[#EAEAEA] dark:bg-neutral-900 rounded-t-[40px] p-6 pb-12 animate-slideUp z-10 h-[85vh] flex flex-col transition-colors duration-500">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold dark:text-white transition-colors duration-500">Настройка тега</h3>
                 <div className="flex gap-2">
                    <button onClick={() => setTagToDelete(editingTagId)} className="bg-red-500/10 text-red-500 p-2 rounded-full active:scale-95 transition-colors duration-500"><Trash2 className="w-5 h-5" strokeWidth={2.5} /></button>
                    <button onClick={async () => {
                       const updatedTags = tags.map(t => t.id === editingTagId ? editTagData : t);
                       setTags(updatedTags);
                       setEditingTagId(null);
                       await saveProfileToDb({ tags: updatedTags });
                     }} className="bg-neutral-900 dark:bg-white text-white dark:text-black px-5 py-2 rounded-full font-bold active:scale-95 transition-colors duration-500">Сохранить</button>
                 </div>
               </div>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-20">
                 <label className="block w-full h-40 bg-neutral-300 dark:bg-neutral-800 rounded-[30px] relative overflow-hidden shadow-inner cursor-pointer active:scale-[0.98] transition-all duration-500">
                    {editTagData.img ? (
                      <img src={editTagData.img} className="w-full h-full object-cover" alt="Tag Cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 transition-colors duration-500">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" strokeWidth={2.5} />
                        <span className="font-bold text-sm">Обложка истории</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white">
                       <ImagePlus className="w-6 h-6 mb-1" strokeWidth={2.5} />
                       <span className="text-xs font-bold">Изменить</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEditTagData({...editTagData, img: url}))} />
                 </label>
                 <div className="space-y-3">
                   <input value={editTagData.label || ''} onChange={e => setEditTagData({...editTagData, label: e.target.value})} placeholder="Название тега (напр. Бизнесмен)" className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-white/10 rounded-2xl p-4 font-bold outline-none shadow-sm dark:text-white focus:border-[#007AFF] transition-colors duration-500" />
                   <input value={editTagData.title || ''} onChange={e => setEditTagData({...editTagData, title: e.target.value})} placeholder="Заголовок истории" className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-white/10 rounded-2xl p-4 font-bold outline-none shadow-sm dark:text-white focus:border-[#007AFF] transition-colors duration-500" />
                   <textarea value={editTagData.desc || ''} onChange={e => setEditTagData({...editTagData, desc: e.target.value})} placeholder="Расскажите историю..." rows={4} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-white/10 rounded-2xl p-4 text-[15px] outline-none shadow-sm resize-none dark:text-white focus:border-[#007AFF] transition-colors duration-500" />
                 </div>
                 <div>
                   <span className="font-bold text-neutral-500 dark:text-neutral-400 block mb-3 pl-2 transition-colors duration-500">Выберите иконку</span>
                   <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-3 bg-white/50 dark:bg-neutral-800/50 p-4 rounded-[30px] border border-neutral-300 dark:border-white/5 transition-colors duration-500 justify-items-center">
                     {Object.entries(ICON_LIBRARY).map(([name, IconComp]) => (
                       <button key={name} onClick={() => setEditTagData({...editTagData, icon: name})} className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${editTagData.icon === name ? 'bg-[#007AFF] text-white shadow-md scale-110' : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'}`}>
                         <IconComp className="w-6 h-6" strokeWidth={2.5} />
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* НАСТРОЙКА ИКОНКИ ФАКТА */}
        {editingFactId !== null && (
          <div className="fixed inset-0 z-[75] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-colors duration-500" onClick={() => setEditingFactId(null)} />
             <div className="relative bg-[#EAEAEA] dark:bg-neutral-900 rounded-t-[40px] p-6 pb-12 animate-slideUp z-10 h-[60vh] flex flex-col transition-colors duration-500">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold dark:text-white transition-colors duration-500">Иконка факта</h3>
                 <button onClick={() => setEditingFactId(null)} className="p-2 bg-neutral-200 dark:bg-white/10 rounded-full active:scale-90 transition-colors duration-500"><X className="w-5 h-5 dark:text-white" strokeWidth={3} /></button>
               </div>
               <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                 <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-3 bg-white/50 dark:bg-neutral-800/50 p-4 rounded-[30px] border border-neutral-300 dark:border-white/5 transition-colors duration-500 justify-items-center">
                   {Object.entries(ICON_LIBRARY).map(([name, IconComp]) => {
                     const isSelected = facts.find(f => f.id === editingFactId)?.icon === name;
                     return (
                       <button key={name} onClick={() => { setFacts(facts.map(f => f.id === editingFactId ? {...f, icon: name} : f)); setEditingFactId(null); }} className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-[#007AFF] text-white shadow-md scale-110' : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'}`}>
                         <IconComp className="w-6 h-6" strokeWidth={2.5} />
                       </button>
                     )
                   })}
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* ПРОСМОТР ТЕГА */}
        {viewingTag && !isEditing && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500" onClick={() => setViewingTag(null)} />
            <div className="animate-slideUp relative flex max-h-[85%] w-full flex-col overflow-hidden rounded-t-[60px] bg-[#EAEAEA] dark:bg-neutral-900 shadow-2xl transition-colors duration-500">
              <button onClick={() => setViewingTag(null)} className="absolute right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-black/40 text-neutral-800 dark:text-white shadow-sm backdrop-blur-md transition-all duration-500 active:scale-90 hover:bg-white dark:hover:bg-black/60 animate-scale-in"><X className="h-6 w-6" strokeWidth={2.5} /></button>
              <div className="flex-1 overflow-y-auto pb-12 no-scrollbar">
                <div className="relative w-full h-[300px] bg-neutral-300 dark:bg-neutral-800 transition-colors duration-500">
                  {viewingTag.img && <img src={viewingTag.img} alt={viewingTag.label} className="absolute inset-0 h-full w-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#EAEAEA] dark:from-neutral-900 to-transparent transition-colors duration-500" />
                </div>
                <div className="px-7 pt-4 relative z-10 -mt-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/10 px-4 py-1.5 text-sm font-bold text-neutral-700 dark:text-neutral-300 shadow-sm mb-3 backdrop-blur-md border border-white/40 dark:border-white/10 transition-colors duration-500">
                    {React.createElement(ICON_LIBRARY[viewingTag.icon] || Star, { className: "w-4 h-4", strokeWidth: 2.5 })}
                    {viewingTag.label}
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight mb-4 dark:text-white transition-colors duration-500">{viewingTag.title}</h2>
                  <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-300 transition-colors duration-500">{viewingTag.desc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ДОБАВЛЕНИЕ КОММЕНТАРИЯ */}
        {showNewCommentPopup && (
          <div className="fixed inset-0 z-[80] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-colors duration-500" onClick={() => setShowNewCommentPopup(false)} />
            <div className="relative bg-[#EAEAEA] dark:bg-neutral-900 rounded-t-[40px] p-6 pb-12 animate-slideUp z-10 h-[85vh] flex flex-col transition-colors duration-500">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold dark:text-white transition-colors duration-500">Новое послание</h3>
                 <button onClick={() => {
                     if (newCommentData.text && newCommentData.role) {
                       setComments([{ id: Date.now(), ...newCommentData, date: new Date().toLocaleDateString('ru-RU'), reactions: { infinity: 0, heart: 0, fire: 0 }, isNew: true }, ...comments]);
                       setShowNewCommentPopup(false);
                       setNewCommentData({ author: '', role: '', category: '', text: '', avatar: '' });
                     }
                   }} disabled={!newCommentData.text || !newCommentData.role} className="bg-[#007AFF] disabled:bg-neutral-400 text-white px-5 py-2 rounded-full font-bold active:scale-95 transition-all">Опубликовать</button>
               </div>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                 <div className="flex items-center gap-4">
                   <label className="w-16 h-16 shrink-0 bg-neutral-300 dark:bg-neutral-800 rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer shadow-sm transition-colors duration-500">
                     {newCommentData.avatar ? <img src={newCommentData.avatar} className="w-full h-full object-cover" alt="Avatar"/> : <User className="w-6 h-6 text-neutral-500" strokeWidth={2.5} />}
                     <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, url => setNewCommentData({...newCommentData, avatar: url}))} />
                   </label>
                   <input value={newCommentData.author} onChange={e => setNewCommentData({...newCommentData, author: e.target.value})} placeholder="Ваше Имя" className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-white/10 rounded-xl px-4 py-3 outline-none text-[16px] font-bold dark:text-white shadow-sm focus:border-[#007AFF] transition-colors duration-500" />
                 </div>
                 <div>
                   <span className="font-bold text-neutral-500 dark:text-neutral-400 block mb-3 pl-2 transition-colors duration-500">Кем вы приходитесь? <span className="text-red-500">*</span></span>
                   <div className="flex flex-wrap gap-2">
                     {ROLES_DATA.map((role) => (
                       <button key={role.label} onClick={() => setNewCommentData({...newCommentData, role: role.label, category: role.cat})} className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${newCommentData.role === role.label ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-md scale-105' : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>{role.label}</button>
                     ))}
                   </div>
                 </div>
                 <textarea value={newCommentData.text} onChange={e => setNewCommentData({...newCommentData, text: e.target.value})} placeholder="Поделитесь вашим воспоминанием или теплыми словами..." rows={6} className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-white/10 rounded-2xl p-4 text-[16px] outline-none shadow-sm resize-none dark:text-white focus:border-[#007AFF] transition-colors duration-500" />
               </div>
            </div>
          </div>
        )}

        {/* ШТОРКА AI */}
        {showAiSheet && (
          <div className="fixed inset-0 z-[60] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-colors duration-500" onClick={() => setShowAiSheet(false)} />
             <div className="relative bg-[#EAEAEA] dark:bg-neutral-900 rounded-t-[40px] p-6 pb-12 animate-slideUp z-10 transition-colors duration-500">
               <div className="w-12 h-1.5 bg-neutral-400/50 dark:bg-neutral-700 rounded-full mx-auto mb-6 transition-colors duration-500" />
               <h3 className="text-[22px] font-bold dark:text-white mb-5 flex items-center gap-3 transition-colors duration-500">
                 <img src="/images/Memernity Intelligence icon.png" className="w-6 h-6 object-contain" alt="AI Logo" />
                 Memernity Intelligence
               </h3>
               <div className="flex flex-col gap-3">
                  <button onClick={() => { setShowAiSheet(false); setShowAiChat(true); }} className="flex items-center gap-4 p-4 rounded-[24px] bg-white dark:bg-neutral-800 shadow-sm active:scale-95 transition-all duration-500 text-left">
                     <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] shrink-0 transition-colors duration-500"><Wand2 className="w-6 h-6" strokeWidth={2.5} /></div>
                     <div className="flex flex-col"><span className="font-bold text-[17px] dark:text-white transition-colors duration-500">Нейросеть-биограф</span><span className="text-[13px] text-neutral-500 mt-0.5 leading-snug transition-colors duration-500">Помощь в написании истории через теплое интервью</span></div>
                  </button>
                  <button onClick={() => { setShowAiSheet(false); setShowPhotoRestore(true); }} className="flex items-center gap-4 p-4 rounded-[24px] bg-white dark:bg-neutral-800 shadow-sm active:scale-95 transition-all duration-500 text-left">
                     <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 transition-colors duration-500"><ImagePlus className="w-6 h-6" strokeWidth={2.5} /></div>
                     <div className="flex flex-col"><span className="font-bold text-[17px] dark:text-white transition-colors duration-500">Реставрация фото</span><span className="text-[13px] text-neutral-500 mt-0.5 leading-snug transition-colors duration-500">Заявка на ручное улучшение и колоризацию старых снимков</span></div>
                  </button>
                  <button onClick={() => { setShowAiSheet(false); setShowTextFix(true); }} className="flex items-center gap-4 p-4 rounded-[24px] bg-white dark:bg-neutral-800 shadow-sm active:scale-95 transition-all duration-500 text-left">
                     <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 transition-colors duration-500"><FileEdit className="w-6 h-6" strokeWidth={2.5} /></div>
                     <div className="flex flex-col"><span className="font-bold text-[17px] dark:text-white transition-colors duration-500">Исправление текста</span><span className="text-[13px] text-neutral-500 mt-0.5 leading-snug transition-colors duration-500">Проверка орфографии и стилистики вашего текста</span></div>
                  </button>
               </div>
             </div>
          </div>
        )}

        {/* 1. ЧАТ ИИ */}
        {showAiChat && (
          <div className="fixed inset-0 z-[80] flex flex-col justify-end">
            {/* Тёмный фон */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAiChat(false)}
            />
            {/* Панель чата */}
            <div className="relative h-[85vh] bg-[#EAEAEA] dark:bg-neutral-900 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col animate-slideUp overflow-hidden transition-colors duration-500">
              {/* Шапка */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-300 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md z-10 transition-colors duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 flex items-center justify-center">
                    <img src="/images/Memernity Intelligence icon.png" alt="AI Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col"><span className="font-bold text-[17px] dark:text-white leading-tight transition-colors duration-500">Memernity Intelligence</span><span className="text-[13px] text-neutral-500 dark:text-neutral-400 transition-colors duration-500">Нейросеть-биограф</span></div>
                </div>
                <button onClick={() => setShowAiChat(false)} className="p-2 bg-neutral-200 dark:bg-white/10 rounded-full active:scale-90 transition-all duration-500"><X className="w-5 h-5 dark:text-white" strokeWidth={3} /></button>
              </div>

              {/* Быстрые кнопки */}
              <div className="flex gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-neutral-200 dark:border-white/5 bg-white/30 dark:bg-black/10 backdrop-blur-sm transition-colors duration-500 shrink-0">
                <button
                  onClick={() => {
                    setMessages([])
                    setIsInitializing(true)
                    try { localStorage.removeItem(CHAT_KEY) } catch {}
                    setTimeout(() => {
                      setMessages([{ id: 'greeting-1', role: 'assistant', content: 'Здравствуйте! Я Memernity Intelligence. Чтобы создать красивую историю жизни, мне нужно задать вам несколько вопросов. Расскажите, как звали этого человека и кем он вам приходился?' }])
                      setIsInitializing(false)
                    }, 1500)
                  }}
                  className="flex items-center whitespace-nowrap bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full px-3 py-1.5 text-[13px] font-medium shadow-sm active:scale-95 transition-all dark:text-white shrink-0"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Начать заново
                </button>
                <button
                  onClick={() => append({ role: 'user', content: 'Я не помню подробностей, задай другой наводящий вопрос.' })}
                  className="flex items-center whitespace-nowrap bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full px-3 py-1.5 text-[13px] font-medium shadow-sm active:scale-95 transition-all dark:text-white shrink-0"
                >
                  <Lightbulb className="w-4 h-4 mr-1.5" /> Не помню
                </button>
                <button
                  onClick={() => append({ role: 'user', content: 'Давай пропустим эту тему, переходи к следующей.' })}
                  className="flex items-center whitespace-nowrap bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full px-3 py-1.5 text-[13px] font-medium shadow-sm active:scale-95 transition-all dark:text-white shrink-0"
                >
                  <SkipForward className="w-4 h-4 mr-1.5" /> Пропустить
                </button>
              </div>

              {/* Список сообщений */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 flex flex-col">
                {messages.map((m, idx) => {
                  // Плашка даты
                  const msgDate = m.createdAt ? new Date(m.createdAt) : null
                  const prevDate = idx > 0 && messages[idx - 1].createdAt ? new Date(messages[idx - 1].createdAt!) : null
                  const showDateSep = msgDate && (!prevDate || msgDate.toDateString() !== prevDate.toDateString())
                  const timeStr = msgDate
                    ? msgDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                    : new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                  const dateLabel = msgDate
                    ? msgDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
                    : null

                  // Обработка tool call — кнопка «Сгенерировать профиль»
                  const profileTool = m.toolInvocations?.find(
                    (t: any) => t.toolName === 'generate_profile' && (t.state === 'call' || t.state === 'result')
                  )
                  if (profileTool) {
                    const args = (profileTool as any).args
                    return (
                      <div key={m.id}>
                        {showDateSep && dateLabel && (
                          <div className="mx-auto my-4 w-max rounded-full bg-black/10 dark:bg-white/10 px-3 py-1 text-[12px] font-bold text-neutral-500 dark:text-neutral-400 backdrop-blur-md">{dateLabel}</div>
                        )}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 shrink-0 flex items-center justify-center mt-1">
                            <img src="/images/Memernity Intelligence icon.png" alt="AI Logo" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex flex-col gap-3 max-w-[85%]">
                            {m.content && (
                              <div className="bg-white dark:bg-neutral-800 rounded-[20px] rounded-tl-none p-4 shadow-sm border border-neutral-200 dark:border-white/5 transition-colors duration-500">
                                <p className="text-[15px] font-medium dark:text-white leading-relaxed transition-colors duration-500 whitespace-pre-wrap break-words">{m.content}</p>
                                <div className="text-right mt-1"><span className="text-[11px] text-black/40 dark:text-white/40">{timeStr}</span></div>
                              </div>
                            )}
                            <button
                              onClick={async () => {
                                if (args?.profileName) setProfileName(args.profileName)
                                if (args?.bioSections) setBioSections(
                                  args.bioSections.map((s: any, i: number) => ({ id: `ai-sec-${i}-${Date.now()}`, title: s.title, content: s.content }))
                                )
                                if (args?.tags) setTags(
                                  args.tags.map((t: any, i: number) => ({ id: `ai-tag-${i}-${Date.now()}`, label: t.label, icon: t.icon, title: t.title, desc: t.desc, img: '' }))
                                )
                                if (args?.facts) setFacts(
                                  args.facts.map((f: any, i: number) => ({ id: i, icon: f.icon, label: f.label, value: f.value }))
                                )
                                await saveProfileToDb(args)
                                setIsEditing(false)
                                setShowAiChat(false)
                              }}
                              className="flex items-center gap-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-[20px] rounded-tl-none px-5 py-3.5 shadow-lg font-bold text-[15px] active:scale-95 transition-all duration-200"
                            >
                              <Sparkles className="w-5 h-5" strokeWidth={2} />
                              Сгенерировать профиль
                            </button>
                            <p className="text-[12px] text-neutral-500 dark:text-neutral-400 px-1">Если хотите что-то изменить или добавить детали — просто напишите об этом ниже, и я перепишу историю!</p>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={m.id}>
                      {showDateSep && dateLabel && (
                        <div className="mx-auto my-4 w-max rounded-full bg-black/10 dark:bg-white/10 px-3 py-1 text-[12px] font-bold text-neutral-500 dark:text-neutral-400 backdrop-blur-md">{dateLabel}</div>
                      )}
                      {m.role === 'user' ? (
                        <div className="flex justify-end">
                          <div className="bg-[#007AFF] text-white rounded-[20px] rounded-tr-none p-4 max-w-[85%] shadow-sm text-[15px] font-medium whitespace-pre-wrap break-words">
                            {m.content}
                            <div className="text-right mt-1"><span className="text-[11px] text-white/60">{timeStr}</span></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 max-w-[85%]">
                          <div className="w-8 h-8 shrink-0 flex items-center justify-center mt-1">
                            <img src="/images/Memernity Intelligence icon.png" alt="AI Logo" className="w-full h-full object-contain" />
                          </div>
                          <div className="bg-white dark:bg-neutral-800 rounded-[20px] rounded-tl-none p-4 shadow-sm border border-neutral-200 dark:border-white/5 transition-colors duration-500">
                            <p className="text-[15px] font-medium dark:text-white leading-relaxed transition-colors duration-500 whitespace-pre-wrap break-words">{m.content}</p>
                            <div className="text-right mt-1"><span className="text-[11px] text-black/40 dark:text-white/40">{timeStr}</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                {/* Индикатор печатания — только пока ИИ ещё не ответил */}
                {(isInitializing || (isLoading && messages[messages.length - 1]?.role === 'user')) && (
                  <div className="flex gap-3 max-w-[85%] items-center">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                      <img src="/images/Memernity Intelligence icon.png" alt="AI Logo" className="w-full h-full object-contain animate-pulse" />
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-[20px] rounded-tl-none p-4 shadow-sm border border-neutral-200 dark:border-white/5 transition-colors duration-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Форма ввода */}
              <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-300 dark:border-white/5 transition-colors duration-500">
                <div className="flex items-end gap-2 bg-[#F2F2F7] dark:bg-neutral-800 rounded-[22px] p-1.5 pl-5 border border-neutral-200 dark:border-white/5 shadow-inner transition-colors duration-500">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (!isLoading && input.trim()) handleSubmit(e as any)
                      }
                    }}
                    maxLength={1000}
                    rows={1}
                    placeholder="Написать сообщение..."
                    className="flex-1 bg-transparent outline-none dark:text-white text-[16px] placeholder-neutral-400 transition-colors duration-500 resize-none overflow-y-auto max-h-[40vh] min-h-[24px] py-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-400/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                  />
                  {input.trim().length > 0 ? (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${!isLoading ? 'bg-[#007AFF] text-white scale-100' : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 scale-95 opacity-50 cursor-not-allowed'}`}
                    >
                      <Send className="w-4 h-4 relative -left-0.5" strokeWidth={2.5} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startListening}
                      className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse scale-100' : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 scale-95'}`}
                    >
                      <Mic className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. РЕСТАВРАЦИЯ ФОТО */}
        {showPhotoRestore && (
          <div className="fixed inset-0 z-[80] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-colors duration-500" onClick={() => setShowPhotoRestore(false)} />
            <div className="relative bg-[#EAEAEA] dark:bg-neutral-900 rounded-t-[40px] p-6 pb-12 animate-slideUp z-10 transition-colors duration-500">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold dark:text-white flex items-center gap-2 transition-colors duration-500"><ImagePlus className="w-6 h-6 text-purple-500" strokeWidth={2.5} /> Реставрация фото</h3>
                 <button onClick={() => setShowPhotoRestore(false)} className="p-2 bg-neutral-200 dark:bg-white/10 rounded-full active:scale-90 transition-colors duration-500"><X className="w-5 h-5 dark:text-white" strokeWidth={3} /></button>
               </div>
               
               {photoRestoreSuccess ? (
                 <div className="bg-white dark:bg-neutral-800 rounded-[30px] p-6 text-center shadow-sm">
                   <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Check className="w-8 h-8" strokeWidth={3} />
                   </div>
                   <h4 className="text-lg font-bold dark:text-white mb-2">Заявка принята!</h4>
                   <p className="text-[15px] text-neutral-600 dark:text-neutral-400">✅ Реставрация ИИ и нашими специалистами обычно занимает около 5 минут, но в сложных случаях может потребовать до 24 часов. Фотография обновится в профиле автоматически.</p>
                 </div>
               ) : (
                 <>
                   <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 transition-colors duration-500">Выберите старую или поврежденную фотографию из галереи профиля, и алгоритмы восстановят детали и вернут цвета.</p>
                   
                   <div className="max-h-[40vh] overflow-y-auto mb-6 no-scrollbar rounded-2xl">
                     <div className="grid grid-cols-3 gap-2">
                       {mediaCategories.flatMap(c => c.photos || []).map((imgUrl, i) => (
                         <div 
                           key={i} 
                           onClick={() => setSelectedPhotoForRestore(imgUrl)}
                           className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${selectedPhotoForRestore === imgUrl ? 'ring-4 ring-[#007AFF] scale-[0.96]' : 'hover:opacity-80'}`}
                         >
                           <img src={imgUrl} className="w-full h-full object-cover" alt="gallery" />
                         </div>
                       ))}
                       {mediaCategories.flatMap(c => c.photos || []).length === 0 && (
                         <div className="col-span-3 text-center py-8 text-neutral-500 dark:text-neutral-400">
                           Нет загруженных фотографий
                         </div>
                       )}
                     </div>
                   </div>

                   {mediaCategories.flatMap(c => c.photos || []).length > 0 && (
                     <button 
                       onClick={handlePhotoRestoreSubmit} 
                       disabled={!selectedPhotoForRestore || isRestoringPhoto} 
                       className={`w-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-red-500 to-yellow-500 text-white py-4 rounded-2xl font-bold text-[16px] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2 ${(!selectedPhotoForRestore || isRestoringPhoto) ? 'opacity-70 cursor-not-allowed' : ''}`}
                     >
                       {isRestoringPhoto ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                       {isRestoringPhoto ? 'Отправка...' : 'Отправить на реставрацию'}
                     </button>
                   )}
                 </>
               )}
            </div>
          </div>
        )}

        {/* TOAST */}
        {toastMsg && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 text-[14px] font-bold px-5 py-3 rounded-full shadow-2xl backdrop-blur-xl animate-slideUp pointer-events-none">
            {toastMsg}
          </div>
        )}

        {/* МОДАЛКА ЛОКАЦИИ — КЛАДБИЩЕ */}
        {showCemeteryModal && (
          <CemeteryModal
            cemeteryInfo={cemeteryInfo}
            setCemeteryInfo={setCemeteryInfo}
            onClose={() => setShowCemeteryModal(false)}
            onSave={async (updated) => { setCemeteryInfo(updated); await saveProfileToDb({ cemeteryInfo: updated }); }}
            isOwner={isOwner}
            showToast={showToast}
            uploadFileToSupabase={uploadFileToSupabase}
          />
        )}

        {/* 3. ИСПРАВЛЕНИЕ ТЕКСТА */}
        {showTextFix && (
          <div className="fixed inset-0 z-[80] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-colors duration-500" onClick={() => setShowTextFix(false)} />
            <div className="relative bg-[#EAEAEA] dark:bg-neutral-900 rounded-t-[40px] p-6 pb-12 animate-slideUp z-10 transition-colors duration-500">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold dark:text-white flex items-center gap-2 transition-colors duration-500"><FileEdit className="w-6 h-6 text-green-500" strokeWidth={2.5} /> Улучшение текста</h3>
                 <button onClick={() => setShowTextFix(false)} className="p-2 bg-neutral-200 dark:bg-white/10 rounded-full active:scale-90 transition-colors duration-500"><X className="w-5 h-5 dark:text-white" strokeWidth={3} /></button>
               </div>
               
               {fixedData ? (
                 <div className="flex flex-col gap-4">
                   <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-2xl flex items-center gap-3">
                     <Check className="w-6 h-6 shrink-0" />
                     <p className="text-[15px] font-medium">Анализ завершен. Найдены и исправлены ошибки.</p>
                   </div>
                   <button onClick={async () => {
                     setProfileName(fixedData.profileName || profileName);
                     setBioSections(fixedData.bioSections || bioSections);
                     setTags(fixedData.tags || tags);
                     setFacts(fixedData.facts || facts);
                     setLetterText(fixedData.letterText || letterText);
                     await saveProfileToDb(fixedData);
                     setFixedData(null);
                     setShowTextFix(false);
                   }} className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white py-4 rounded-2xl font-bold text-[16px] shadow-lg active:scale-95 transition-all">Применить исправления</button>
                 </div>
               ) : (
                 <button onClick={handleFixText} disabled={isFixingText} className={`w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white py-4 rounded-2xl font-bold text-[16px] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2 ${isFixingText ? 'opacity-70 cursor-not-allowed' : ''}`}>
                   {isFixingText ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" strokeWidth={2.5} />}
                   {isFixingText ? 'Анализируем...' : 'Анализировать весь профиль'}
                 </button>
               )}
            </div>
          </div>
        )}

        {/* ОТКРЫТАЯ ГАЛЕРЕЯ МЕДИА (MASONRY ИЛИ GRID ВЕРСТКА) */}
        {selectedCategoryId && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in transition-colors duration-500" onClick={() => setSelectedCategoryId(null)} />
            <div className="animate-slideUp relative flex h-[92%] w-full flex-col overflow-hidden rounded-t-[40px] bg-[#EAEAEA] dark:bg-neutral-900 shadow-2xl transition-colors duration-500">
              <button onClick={() => setSelectedCategoryId(null)} className="absolute right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-black/40 text-neutral-800 dark:text-white shadow-sm backdrop-blur-md transition-all duration-500 active:scale-90 hover:bg-white dark:hover:bg-black/60"><X className="h-6 w-6" strokeWidth={2.5} /></button>

              <div className="flex-1 overflow-y-auto px-4 pb-32 pt-20 no-scrollbar relative">
                 <div className={mediaViewMode === 'masonry' ? "columns-1 md:columns-3 gap-4 space-y-4" : "grid grid-cols-3 gap-1 md:gap-2"}>
                    {(mediaSubTab === 'Фото' ? activeCategoryData?.photos || [] : activeCategoryData?.videos || []).map((imgPath: string, index: number) => (
                      <div 
                        key={index} 
                        draggable={isEditing}
                        onDragStart={() => setDraggedItemIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); handleDrop(index); }}
                        className={mediaViewMode === 'masonry' ? `break-inside-avoid relative rounded-[24px] overflow-hidden shadow-sm group ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}` : `relative aspect-square rounded-lg overflow-hidden shadow-sm group ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}`}
                      >
                         <img src={imgPath} className={`w-full h-full transition-all duration-300 ${mediaViewMode === 'masonry' ? 'h-auto object-contain rounded-[24px]' : 'object-cover rounded-lg'} ${isEditing ? 'pointer-events-none' : 'cursor-pointer'}`} alt="media detail" onClick={() => !isEditing && setFsData({url: imgPath, index, list: mediaSubTab === 'Фото' ? activeCategoryData?.photos : activeCategoryData?.videos})} />
                         {mediaSubTab === 'Видео' && <PlayIconOverlay />}
                         {isEditing && (
                            <button onClick={(e) => { e.stopPropagation(); setPhotoToDelete({catId: selectedCategoryId, type: mediaSubTab === 'Фото' ? 'photos' : 'videos', index}); }} className="absolute top-2 right-2 bg-white/90 dark:bg-neutral-800/90 text-red-500 p-2 rounded-full shadow-lg active:scale-90 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" strokeWidth={2.5} /></button>
                         )}
                      </div>
                    ))}
                 </div>
                 {isEditing && activeCategoryData && (
                   <div className="mt-6 flex justify-center">
                     <label className="flex items-center gap-2 bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold shadow-lg active:scale-95 cursor-pointer transition-all">
                       <Plus className="w-5 h-5" strokeWidth={3} /> Добавить медиа
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAddMediaPhoto(selectedCategoryId, e)} />
                     </label>
                   </div>
                 )}
              </div>

              {/* Выезжающий остров медиа */}
              <div className="absolute bottom-8 inset-x-4 z-[100] flex items-center gap-2 animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                <div className="relative flex flex-1 items-center justify-between rounded-[30px] bg-white/40 dark:bg-neutral-800/40 p-[5px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl border border-white/50 dark:border-white/10 transition-colors duration-500">
                  <div className="absolute inset-y-[5px] inset-x-[5px] z-0 pointer-events-none">
                    <div className="h-full w-[calc(100%/3)] rounded-[25px] bg-neutral-500/70 dark:bg-white/20 border border-white/40 dark:border-white/10 shadow-sm transition-transform duration-500" style={{ transform: `translateX(${['Фото', 'Видео', 'Фильм'].indexOf(mediaSubTab) * 100}%)`, transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
                  </div>
                  {['Фото', 'Видео', 'Фильм'].map(tab => (
                    <button key={tab} onClick={() => setMediaSubTab(tab as any)} className={`relative z-10 flex-1 rounded-[25px] py-3 text-[16px] font-bold transition-all duration-300 active:scale-95 ${mediaSubTab === tab ? 'text-white' : 'text-neutral-800 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}>{tab}</button>
                  ))}
                </div>
                {mediaSubTab !== 'Фильм' && (
                  <button onClick={() => setMediaViewMode(v => v === 'masonry' ? 'grid' : 'masonry')} className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-white/40 dark:bg-neutral-800/40 text-neutral-700 dark:text-white shadow-lg backdrop-blur-xl border border-white/50 dark:border-white/10 transition-colors duration-500 hover:bg-white/60 dark:hover:bg-neutral-700/60 active:scale-90">
                    {mediaViewMode === 'masonry' ? <Grid3x3 className="h-7 w-7" strokeWidth={2.5} /> : <LayoutGrid className="h-7 w-7" strokeWidth={2.5} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="relative flex-1 overflow-y-auto pb-[350px] no-scrollbar" onScroll={handleScroll}>
          <header className="relative z-30 flex items-center justify-between px-4 pt-14">
            <div>
              <a href="https://memernity.com" target="_blank" rel="noopener noreferrer" className="flex items-center active:scale-95 transition-transform cursor-pointer">
                <img src="/images/logo.png" alt="Memernity" className="h-6 w-auto object-contain dark:invert transition-all duration-500" />
              </a>
              <div className="mt-0.5 flex items-center gap-1 pl-0.5 text-xs font-medium text-neutral-500 transition-colors duration-500">
                <SquareUser className="h-3 w-3" strokeWidth={3} /><span>Demo Profile</span>
              </div>
            </div>
            <button onClick={() => setIsProfileOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-400/70 dark:bg-neutral-800 text-white shadow-sm transition-all duration-500 active:scale-90 border border-transparent dark:border-white/10 hover:bg-neutral-500/70 dark:hover:bg-neutral-700">
              {googleAvatar ? <img src={googleAvatar} className="w-full h-full object-cover rounded-full" alt="Profile" /> : <User className="h-6 w-6" strokeWidth={2.5} />}
            </button>
          </header>

          {/* КНОПКА ПАЛИТРЫ — fixed, над навигацией, только светлая тема */}
          {isEditing && !isDarkMode && (
            <div className={`fixed left-4 md:left-6 md:bottom-6 z-50 transition-all duration-300 ease-in-out ${isScrollingDown ? 'bottom-5' : 'bottom-[100px]'}`}>
              <button
                onClick={() => setShowColorPicker(v => !v)}
                className="w-10 h-10 rounded-full shadow-lg border-2 border-white active:scale-90 transition-transform"
                style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
              />
              {showColorPicker && (
                <div className="absolute bottom-12 left-0 z-50 backdrop-blur-xl bg-white/95 p-4 rounded-3xl shadow-2xl border border-white/60 animate-scale-in w-[210px]">
                  <p className="text-[12px] font-bold text-neutral-500 mb-3">Цвет фона</p>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {['#E5E5E5','#F0EBE3','#E3EDF0','#EBE3F0','#F0E3E3','#E3F0E6','#F5F0E0','#E8E8F5'].map(c => (
                      <button key={c} onClick={async () => { setBgColor(c); setShowColorPicker(false); await saveProfileToDb({ bgColor: c }); }} className="w-9 h-9 rounded-full border-2 transition-transform active:scale-90 hover:scale-110" style={{ backgroundColor: c, borderColor: bgColor === c ? '#007AFF' : 'transparent' }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-neutral-500">Свой цвет</span>
                    <label className="cursor-pointer">
                      <div className="w-8 h-8 rounded-full border-2 border-neutral-300" style={{ backgroundColor: bgColor }} />
                      <input type="color" value={bgColor} onChange={async (e) => { setBgColor(e.target.value); await saveProfileToDb({ bgColor: e.target.value }); }} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          <div key={active} className="relative z-10 px-4 animate-fade-blur mt-4">
            {/* ТУЛБАР ВЕРХНЕЙ ПАНЕЛИ */}
            <div className="flex items-center justify-between mb-4 relative h-10">
              <div className="flex items-center gap-2">
                <RoundButton id="guide-target-0" onClick={() => setShowCemeteryModal(true)}><MapPin className="h-4 w-4" strokeWidth={2.5} /></RoundButton>
                <RoundButton onClick={handleShare}><Share2 className="h-4 w-4" strokeWidth={2.5} /></RoundButton>
                <RoundButton id="guide-target-1" onClick={() => setIsDarkMode(!isDarkMode)}>
                  {isDarkMode ? <Sun className="h-4 w-4 text-yellow-400 transition-colors duration-500" strokeWidth={2.5} /> : <Moon className="h-4 w-4 text-[#007AFF] transition-colors duration-500" strokeWidth={2.5} />}
                </RoundButton>
              </div>
              
              <div className="flex items-center gap-2 justify-end relative">
                {isEditing && (
                  <button onClick={() => setShowCancelAlert(true)} className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all duration-500 active:scale-90 bg-white/70 dark:bg-neutral-800/80 hover:bg-red-500 hover:text-white text-red-500 animate-scale-in">
                     <X className="h-5 w-5" strokeWidth={3} />
                  </button>
                )}
                
                <button 
                  id="guide-target-2"
                  onClick={() => {
                    if (isOwner) handleEditToggle();
                    else setShowAuthPopup(true); 
                  }} 
                  className={`flex items-center justify-center rounded-full shadow-sm transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden h-9 active:scale-90 ${isEditing ? 'w-28 bg-[#007AFF] text-white shadow-[0_0_20px_rgba(0,122,255,0.4)]' : 'w-9 bg-white/70 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700'}`}
                >
                  {isEditing ? <span className="flex items-center gap-1.5 font-bold text-sm whitespace-nowrap"><Check className="h-4 w-4" strokeWidth={3} /> Готово</span> : <Pencil className="h-4 w-4 shrink-0" strokeWidth={2.5} />}
                </button>
                
                <button 
                  id="guide-target-3"
                  onClick={() => setShowAiSheet(true)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm transition-all duration-500 active:scale-90 bg-[#007AFF]/10 border border-[#007AFF]/30"
                >
                  <img src="/images/Memernity Intelligence icon.png" className="h-5 w-5 object-contain" alt="Intelligence Logo" />
                </button>
              </div>
            </div>

            {active === 'Биография' && (
              <>
                <section className="mt-4 overflow-hidden rounded-[60px] bg-white/60 dark:bg-neutral-800/80 shadow-sm transition-colors duration-500 relative group">
                  <label className={`relative block h-44 w-full ${isEditing ? 'cursor-pointer' : ''}`}>
                    {coverUrl ? <img src={coverUrl} alt="Cover" className="absolute inset-0 h-full w-full object-cover transition-colors duration-500" /> : <div className="absolute inset-0 bg-neutral-300 dark:bg-neutral-700 transition-colors duration-500" />}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold flex items-center gap-2 text-sm"><ImageIcon className="w-4 h-4" strokeWidth={2.5} /> Изменить обложку</div><input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} /></div>
                    )}
                  </label>
                  
                  <div className={`absolute left-1/2 top-44 h-36 w-36 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-4 ring-white/40 dark:ring-black/40 shadow-lg bg-neutral-200 transition-all duration-500 ${isEditing ? 'cursor-pointer' : ''}`}>
                     <label className="block w-full h-full relative">
                       {avatarUrl && <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />}
                       {isEditing && <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><ImageIcon className="w-6 h-6 text-white" strokeWidth={2.5} /><input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} /></div>}
                     </label>
                  </div>

                  <div className="px-5 pb-8 pt-[80px] text-center flex flex-col items-center">
                    {isEditing ? (
                      <><input value={profileName} onChange={e => setProfileName(e.target.value)} className="text-2xl font-bold tracking-tight text-center bg-transparent border-b border-dashed border-neutral-400/50 outline-none pb-1 w-[80%] focus:border-[#007AFF] transition-colors duration-500 dark:text-white" /><input value={profileDates} onChange={e => setProfileDates(e.target.value)} className="mt-2 text-sm font-bold text-center bg-transparent border-b border-dashed border-neutral-400/50 outline-none pb-1 w-[60%] focus:border-[#007AFF] transition-colors duration-500 dark:text-white" /></>
                    ) : (
                      <><h1 className="text-2xl font-bold tracking-tight dark:text-white transition-colors duration-500">{profileName}</h1><p className="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-300 transition-colors duration-500">{profileDates}</p></>
                    )}

                    <div className="mt-5 flex flex-wrap justify-center gap-[9px] w-full">
                      {tags.map((tag, index) => (
                        <div key={tag.id || `tag-${index}`} className={`relative group ${tag.isNew ? 'animate-slideUp' : ''}`}>
                          <button onClick={() => isEditing ? null : setViewingTag(tag)} className="flex items-center gap-2 rounded-full bg-neutral-200/80 dark:bg-white/10 px-4 py-2 text-[18px] text-neutral-700 dark:text-neutral-200 shadow-sm transition-colors duration-500 hover:bg-neutral-300 dark:hover:bg-white/20 active:scale-95 cursor-pointer">
                            {React.createElement(ICON_LIBRARY[tag.icon] || Star, { className: "w-4 h-4", strokeWidth: 2.5 })}{tag.label}
                          </button>
                          {isEditing && (
                            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setEditTagData(tag); setEditingTagId(tag.id); }} className="absolute -top-2 -right-2 bg-[#007AFF] text-white rounded-full p-1.5 shadow-md active:scale-90 transition-transform z-10"><Settings className="w-3 h-3" strokeWidth={3} /></button>
                          )}
                        </div>
                      ))}
                      {isEditing && <button onClick={() => setTags([...tags, { id: Date.now().toString(), label: 'Новый тег', icon: 'Star', title: '', desc: '', img: '', isNew: true }])} className="rounded-full bg-white/50 border border-dashed border-neutral-400 px-4 py-2 text-[16px] font-bold text-neutral-600 active:scale-95 flex items-center gap-1 transition-colors duration-500 dark:text-white"><Plus className="w-4 h-4" strokeWidth={3} /> Тег</button>}
                    </div>
                  </div>
                </section>

                <section className="mt-4 w-full rounded-[60px] bg-white/60 dark:bg-neutral-800/80 py-6 px-7 shadow-sm transition-colors duration-500">
                  <h2 className="text-[20px] font-bold dark:text-white transition-colors duration-500">Основное:</h2>
                  <ul className="mt-3 space-y-3">
                    {facts.map((fact, i) => {
                      const Icon = ICON_LIBRARY[fact.icon] || Bookmark
                      return (
                        <li key={fact.id ?? `fact-${i}`} className={`flex items-start gap-3 text-[17px] font-semibold text-neutral-800 dark:text-neutral-200 transition-colors duration-500 ${fact.isNew ? 'animate-slideUp' : ''}`}>
                          {isEditing ? (
                            <button onClick={() => setEditingFactId(fact.id)} className="mt-0.5 p-1.5 bg-white/50 dark:bg-neutral-700 rounded-lg hover:bg-white active:scale-95 transition-all duration-500 shrink-0 border border-dashed border-[#007AFF]/50 text-[#007AFF]"><Icon className="h-5 w-5" strokeWidth={2.5} /></button>
                          ) : (
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-400 transition-colors duration-500" strokeWidth={2.5} />
                          )}
                          {isEditing ? (
                            <div className="flex items-center gap-2 w-full mt-0.5">
                              <div className="flex flex-col gap-1 w-full">
                                <input value={fact.label} onChange={e => { const n = [...facts]; n[i].label = e.target.value; setFacts(n) }} className="bg-transparent border-b border-dashed border-neutral-400/50 outline-none w-full pb-0.5 focus:border-[#007AFF] transition-colors duration-500 dark:text-white" />
                                <input value={fact.value} onChange={e => { const n = [...facts]; n[i].value = e.target.value; setFacts(n) }} className="bg-transparent border-b border-dashed border-neutral-400/50 outline-none w-full pb-0.5 font-normal focus:border-[#007AFF] transition-colors duration-500 dark:text-white" />
                              </div>
                              <button onClick={() => setFactToDelete(fact.id)} className="ml-2 p-1.5 bg-red-500/10 rounded-lg hover:bg-red-500 hover:text-white active:scale-95 transition-all duration-500 shrink-0 border border-dashed border-red-500/50 text-red-500">
                                <Trash2 className="h-5 w-5" strokeWidth={2.5} />
                              </button>
                            </div>
                          ) : (
                            <span className="leading-snug transition-colors duration-500"><span className="dark:text-white">{fact.label}</span> {fact.value}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                  {isEditing && <button onClick={() => setFacts([...facts, { id: Date.now(), icon: 'Bookmark', label: 'Новый факт:', value: '', isNew: true }])} className="mt-4 flex items-center gap-2 text-[15px] font-bold text-neutral-500 border border-dashed border-neutral-400/50 rounded-2xl px-4 py-2 w-full justify-center active:scale-95 transition-colors duration-500 dark:text-white"><Plus className="w-4 h-4" strokeWidth={3} /> Добавить факт</button>}
                </section>

                {bioSections.map((section, i) => (
                  isEditing ? (
                    <section key={section.id || `section-edit-${i}`} className={`mt-4 overflow-hidden rounded-[40px] bg-white/60 dark:bg-neutral-800/80 shadow-sm p-6 relative group transition-colors duration-500 ${section.isNew ? 'animate-slideUp' : ''}`}>
                      <div className="flex flex-col gap-3 pr-10">
                        <input value={section.title} onChange={e => { const n=[...bioSections]; n[i].title=e.target.value; setBioSections(n) }} className="text-xl font-bold bg-transparent border-b border-dashed border-neutral-400/50 outline-none w-full pb-1 focus:border-[#007AFF] transition-colors duration-500 dark:text-white" />
                        <textarea value={section.content} onChange={e => { const n=[...bioSections]; n[i].content=e.target.value; setBioSections(n) }} rows={4} className="bg-transparent border border-dashed border-neutral-400/50 rounded-xl p-2 outline-none w-full resize-none text-[15px] leading-relaxed focus:border-[#007AFF] transition-colors duration-500 dark:text-white" />
                      </div>
                      <button onClick={() => setBioSectionToDelete(section.id)} className="absolute top-6 right-6 p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-90"><Trash2 className="w-5 h-5" strokeWidth={2.5} /></button>
                    </section>
                  ) : (
                    <ExpandableCard
                      key={section.id || `section-view-${i}`}
                      title={section.title}
                      content={section.content}
                      isNew={section.isNew}
                      onSpeak={() => speakText(section.content, section.id || `s${i}`)}
                      isSpeaking={ttsSectionId === (section.id || `s${i}`)}
                    />
                  )
                ))}
                {isEditing && <button onClick={() => setBioSections([...bioSections, { id: `sec-${Date.now()}`, title: 'Новая глава', content: '', isNew: true }])} className="mt-4 flex items-center gap-2 text-[15px] font-bold text-[#007AFF] border border-dashed border-[#007AFF]/50 bg-[#007AFF]/5 rounded-[40px] px-4 py-4 w-full justify-center active:scale-95 transition-colors duration-500"><Plus className="w-5 h-5" strokeWidth={3} /> Добавить главу биографии</button>}
              </>
            )}

            {active === 'Медиа' && (
              <>
                <section className="mt-4 flex items-center gap-5 rounded-[60px] bg-white/60 dark:bg-neutral-800/80 p-5 shadow-sm transition-colors duration-500">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-white/40 dark:ring-black/40 bg-neutral-200 transition-colors duration-500">
                    {avatarUrl && <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-[22px] font-bold tracking-tight dark:text-white transition-colors duration-500">{profileName}</h1>
                    <p className="mt-0.5 text-[13px] font-bold text-neutral-800 dark:text-neutral-400 transition-colors duration-500">{profileDates}</p>
                  </div>
                </section>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mediaCategories.map((cat, i) => (
                    <div key={cat.id || `cat-${i}`} className={`group relative transition-all duration-500 ${cat.isNew ? 'animate-slideUp' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        {isEditing ? (
                          <input 
                            value={cat.title} 
                            onChange={e => { const n = [...mediaCategories]; n[i].title = e.target.value; setMediaCategories(n); }} 
                            className="text-[24px] font-bold bg-transparent outline-none border-b border-dashed border-neutral-400/50 w-[80%] focus:border-[#007AFF] pl-2 transition-colors duration-500 dark:text-white" 
                          />
                        ) : (
                          <h2 className="flex items-center text-[24px] font-bold pl-2 w-max cursor-pointer transition-colors duration-500 dark:text-white active:scale-95" onClick={() => { setSelectedCategoryId(cat.id); setMediaSubTab('Фото'); }}>
                            {cat.title} <ChevronRight className="ml-1 h-7 w-7 text-inherit group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                          </h2>
                        )}
                        {isEditing && (
                          <button onClick={() => setCatToDelete(cat.id)} className="p-2 text-red-500 bg-red-500/10 rounded-full active:scale-90 hover:bg-red-500 hover:text-white transition-all duration-300 mr-2"><Trash2 className="w-4 h-4" strokeWidth={3} /></button>
                        )}
                      </div>

                      <div className="flex cursor-pointer flex-col rounded-[40px] bg-white/50 dark:bg-neutral-800/80 p-4 shadow-sm hover:shadow-md transition-all duration-500 active:scale-[0.98] group/preview" onClick={() => { setSelectedCategoryId(cat.id); setMediaSubTab('Фото'); }}>
                        {cat.covers.length > 0 ? (
                          <div className="relative w-full rounded-[24px] bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center overflow-hidden transition-colors duration-500 aspect-[4/3]">
                            <img src={cat.covers[0]} className="w-full h-full object-cover rounded-[24px]" alt="cover" />
                            {isEditing && (
                              <button onClick={(e) => { e.stopPropagation(); setPhotoToDelete({catId: cat.id, type: 'photos', index: 0}); }} className="absolute top-2 right-2 bg-white/90 dark:bg-neutral-800/90 text-red-500 p-2 rounded-full shadow-lg active:scale-90 hover:text-white hover:bg-red-500 transition-all duration-300"><Trash2 className="w-4 h-4" strokeWidth={2.5} /></button>
                            )}
                          </div>
                        ) : (
                          <div className="relative w-full rounded-[24px] bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center border-2 border-dashed border-neutral-400/30 transition-colors duration-500 aspect-[4/3]">
                            <ImageIcon className="w-8 h-8 text-neutral-400 transition-colors duration-500" strokeWidth={2.5} />
                          </div>
                        )}
                        
                        {isEditing && (
                          <label className="absolute bottom-4 right-4 bg-[#007AFF] text-white p-3 rounded-full shadow-lg active:scale-90 cursor-pointer transition-transform" onClick={(e) => e.stopPropagation()}>
                             <Plus className="w-5 h-5" strokeWidth={3} />
                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAddMediaPhoto(cat.id, e)} />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}

                  {isEditing && (
                    <div className="group relative flex flex-col pt-[44px]">
                       <div 
                         onClick={() => setMediaCategories([...mediaCategories, { id: Date.now().toString(), title: 'Новая глава', covers: [], photos: [], videos: [], film: null, isNew: true }])}
                         className="flex-1 flex flex-col items-center justify-center rounded-[40px] bg-[#007AFF]/5 border-2 border-dashed border-[#007AFF]/50 p-6 cursor-pointer hover:bg-[#007AFF]/10 transition-all duration-300 active:scale-95 aspect-[4/3]"
                       >
                         <Plus className="w-10 h-10 text-[#007AFF] mb-2" strokeWidth={2.5} />
                         <span className="font-bold text-[#007AFF]">Добавить альбом</span>
                       </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {active === 'Комментарии' && (
              <>
                <section className="mt-4 flex items-center gap-5 px-2">
                  <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full ring-4 ring-white/40 dark:ring-black/40 bg-neutral-200 transition-colors duration-500">
                    {avatarUrl && <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-[22px] font-bold tracking-tight dark:text-white transition-colors duration-500">{profileName}</h1>
                    <p className="mt-0.5 text-[13px] font-bold text-neutral-800 dark:text-neutral-400 transition-colors duration-500">{profileDates}</p>
                  </div>
                </section>

                <div className="my-6 h-px w-full bg-neutral-400/30 dark:bg-white/10 transition-colors duration-500" />

                {showLetter ? (
                  <>
                    {isEditing ? (
                      <section className={`mt-4 overflow-hidden rounded-[40px] bg-white/60 dark:bg-neutral-800/80 shadow-sm p-6 relative transition-colors duration-500 ${letterIsNew ? 'animate-slideUp' : ''}`}>
                        <button onClick={() => setLetterToDelete(true)} className="absolute top-6 right-6 p-2 text-red-500 bg-red-500/10 rounded-full active:scale-90 hover:bg-red-500 hover:text-white transition-all duration-300"><Trash2 className="w-5 h-5" strokeWidth={2.5} /></button>
                        <div className="flex flex-col gap-3 pr-12">
                          <span className="text-[19px] font-bold leading-snug mb-2 dark:text-white transition-colors duration-500">Письмо потомкам</span>
                          <textarea value={letterText} onChange={e => setLetterText(e.target.value)} rows={6} className="bg-transparent border border-dashed border-neutral-400/50 rounded-xl p-3 outline-none w-full resize-none text-[15px] leading-relaxed focus:border-[#007AFF] transition-colors duration-500 dark:text-white" />
                        </div>
                      </section>
                    ) : (
                      <ExpandableCard title="Письмо потомкам" subtitle="Открыто 31.02.2026." content={letterText} isNew={letterIsNew} />
                    )}
                    <div className="my-6 h-px w-full bg-neutral-400/30 dark:bg-white/10 transition-colors duration-500" />
                  </>
                ) : (
                  isEditing && (
                    <div className="mb-6 flex justify-center animate-slideUp">
                      <button onClick={() => { setShowLetter(true); setLetterIsNew(true); }} className="flex items-center gap-2 text-[15px] font-bold text-[#007AFF] border border-dashed border-[#007AFF]/50 bg-[#007AFF]/5 rounded-[40px] px-6 py-4 active:scale-95 transition-colors duration-500">
                        <Plus className="w-5 h-5" strokeWidth={3} /> Добавить письмо потомкам
                      </button>
                    </div>
                  )
                )}

                <div className="flex gap-2">
                  {['Все', 'Семья', 'Друзья'].map((f) => (
                    <button key={f} onClick={() => setCommentFilter(f)} className={`rounded-full px-5 py-2 text-[16px] font-bold transition-all duration-500 active:scale-90 ${commentFilter === f ? 'bg-neutral-500 dark:bg-white text-white dark:text-black shadow-sm' : 'bg-white/50 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300'}`}>{f}</button>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-6 pb-24">
                  {displayedComments.length === 0 ? (
                    <p className="mt-4 text-center text-lg font-bold text-neutral-500 dark:text-neutral-400 transition-colors duration-500">Пока нет комментариев в этой категории.</p>
                  ) : (
                    displayedComments.map((comment, i) => (
                      <div key={comment.id ?? `comment-${i}`} className={`flex flex-col relative group ${comment.isNew ? 'animate-slideUp' : ''}`}>
                        <div className="flex items-center justify-between mb-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-full shadow-sm ring-2 ring-white/20 dark:ring-black/20 bg-neutral-200 flex items-center justify-center transition-colors duration-500">
                              {comment.avatar ? <img src={comment.avatar} className="h-full w-full object-cover" alt="avatar" /> : <User className="w-5 h-5 text-neutral-500 transition-colors duration-500" strokeWidth={2.5} />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[18px] font-bold leading-tight dark:text-white transition-colors duration-500">{comment.author}</span>
                              <span className="text-[12px] font-bold text-neutral-800 dark:text-neutral-400 transition-colors duration-500">{comment.date}</span>
                            </div>
                          </div>
                          {comment.role && <span className="rounded-full bg-white/60 dark:bg-white/10 px-4 py-1 text-[13px] font-bold shadow-sm dark:text-white transition-colors duration-500">{comment.role}</span>}
                        </div>

                        <div className="rounded-[40px] bg-white/60 dark:bg-neutral-800/80 p-6 shadow-sm transition-colors duration-500 relative">
                          {isEditing && (
                            <button onClick={() => setCommentToDelete(comment.id)} className="absolute top-4 right-4 bg-red-500/10 text-red-500 p-2 rounded-full shadow-sm active:scale-90 transition-all hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" strokeWidth={2.5} /></button>
                          )}
                          <p className="text-[16px] leading-relaxed text-neutral-800 dark:text-neutral-200 transition-colors duration-500">{comment.text}</p>
                          <div className="relative mt-4 flex w-max items-center rounded-full bg-white/50 dark:bg-white/10 p-1 shadow-sm border border-white/40 dark:border-white/10 transition-colors duration-500">
                            {userReactions[comment.id] && <div className="absolute inset-y-1 w-[68px] rounded-full bg-white dark:bg-neutral-700 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" style={{ transform: `translateX(${['infinity', 'heart', 'fire'].indexOf(userReactions[comment.id]) * 100}%)` }} />}
                            {(['infinity', 'heart', 'fire'] as const).map((type) => {
                              const isSelected = userReactions[comment.id] === type
                              const baseCount = comment.reactions[type] || 0
                              const displayCount = baseCount + (isSelected ? 1 : 0)
                              return (
                                <button key={type} onClick={() => handleReaction(comment.id, type)} className="relative z-10 w-[68px] flex items-center justify-center gap-1.5 py-1.5 transition-transform active:scale-90">
                                  {activeReactionAnim === `${comment.id}-${type}` && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      {[0, 60, 120, 180, 240, 300].map(angle => <span key={angle} className="absolute animate-firework" style={{ '--angle': `${angle}deg` } as React.CSSProperties}>{renderReactionIcon(type)}</span>)}
                                    </div>
                                  )}
                                  <div className="z-10 flex items-center justify-center">{renderReactionIcon(type)}</div>
                                  <span className="z-10 text-[13px] font-bold dark:text-white transition-colors duration-500">{displayCount}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <nav id="guide-target-4" className={`fixed inset-x-4 bottom-6 z-40 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isScrollingDown ? 'translate-y-[150%]' : 'translate-y-0'} pointer-events-none`}>
          <div className="pointer-events-auto relative flex items-center justify-between rounded-[40px] bg-white/40 dark:bg-neutral-800/40 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl border border-white/50 dark:border-white/10 mx-auto max-w-[500px] animate-drop-bounce transition-colors duration-500">
            <div className="absolute inset-y-1.5 inset-x-1.5 z-0 pointer-events-none">
              <div className="h-full w-1/3 rounded-[32px] bg-neutral-500/70 dark:bg-white/20 border border-white/40 dark:border-white/10 shadow-md transition-transform duration-500" style={{ transform: `translateX(${['Биография', 'Медиа', 'Комментарии'].indexOf(active) * 100}%)`, transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
            </div>
            {[ { icon: BookOpen, label: 'Биография' }, { icon: ImageIcon, label: 'Медиа' }, { icon: Mail, label: 'Комментарии' } ].map(({ icon: Icon, label }) => (
              <button key={label} type="button" onClick={() => {
                setActive(label);
                setSelectedCategoryId(null);
                setBioSections(prev => prev.map(s => ({ ...s, isNew: false })));
                setMediaCategories(prev => prev.map(c => ({ ...c, isNew: false })));
                setComments(prev => prev.map(c => ({ ...c, isNew: false })));
                setLetterIsNew(false);
              }} className={`relative z-10 flex flex-1 flex-col items-center gap-1 rounded-full py-2.5 text-xs font-bold transition-all duration-500 active:scale-90 ${active === label ? 'text-white' : 'text-neutral-800 dark:text-neutral-400'}`}>
                <Icon className="h-[26px] w-[26px]" strokeWidth={2.5} />{label}
              </button>
            ))}
          </div>
        </nav>

        {active === 'Комментарии' && !isEditing && (
          <nav className={`fixed inset-x-0 bottom-8 z-40 flex justify-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none ${isScrollingDown ? 'translate-y-0' : 'translate-y-[150%]'}`}>
            <div className="pointer-events-auto flex items-center gap-2 rounded-[40px] bg-white/40 dark:bg-neutral-800/40 p-[6px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl border border-white/50 dark:border-white/10 transition-colors duration-500">
              <button onClick={() => setShowNewCommentPopup(true)} className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/90 dark:bg-white/20 text-neutral-600 dark:text-white shadow-sm transition-all duration-500 hover:bg-white dark:hover:bg-white/30 active:scale-90">
                <Plus className="h-7 w-7" strokeWidth={3} />
              </button>
              <button className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/90 dark:bg-white/20 text-neutral-600 dark:text-white shadow-sm transition-all duration-500 hover:bg-white dark:hover:bg-white/30 active:scale-90">
                <Mic className="h-7 w-7" strokeWidth={2.5} />
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}