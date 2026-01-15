import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, onAuthStateChanged, updateProfile 
} from "firebase/auth";
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, 
  collection, onSnapshot 
} from "firebase/firestore";
import { 
  Monitor, Cpu, Mouse, Layout, Keyboard, FileText, Presentation, Table, 
  ShieldCheck, Trophy, ChevronDown, ChevronUp, BookOpen, Clock, 
  CheckCircle, Dices, Menu, Play, X, ArrowRight, ArrowLeft, Star,
  User, Lock, Award, Printer, LogOut, Users, School, Zap, Cat, Dog, Bird, Rocket, Gamepad2, Smile, Trash2, Unlock, Ghost
} from 'lucide-react';

// --- CONFIGURAÇÃO DO FIREBASE ---
// Cole suas chaves aqui novamente
const firebaseConfig = {
  apiKey: "AIzaSyDKMNklM6lOAUqmOyGR9m3rQb3DfcmStH8",
  authDomain: "cursoinfo-b829d.firebaseapp.com",
  projectId: "cursoinfo-b829d",
  storageBucket: "cursoinfo-b829d.firebasestorage.app",
  messagingSenderId: "794931610541",
  appId: "1:794931610541:web:3dcd34d48f80b54398d724",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- AVATARES DISPONÍVEIS ---
const avatars = [
  { id: 'cat', icon: Cat, color: 'text-orange-500' },
  { id: 'dog', icon: Dog, color: 'text-amber-700' },
  { id: 'ghost', icon: Ghost, color: 'text-slate-400' },
  { id: 'bird', icon: Bird, color: 'text-sky-500' },
  { id: 'robot', icon: Rocket, color: 'text-purple-600' },
  { id: 'gamer', icon: Gamepad2, color: 'text-indigo-600' },
  { id: 'smile', icon: Smile, color: 'text-yellow-500' },
  { id: 'zap', icon: Zap, color: 'text-blue-500' },
];

const AvatarIcon = ({ id, size = 24, className = "" }) => {
  const av = avatars.find(a => a.id === id) || avatars[0];
  const Icon = av.icon;
  return <Icon size={size} className={`${av.color} ${className}`} />;
};

// --- DADOS DO CURSO ---
const courseData = {
  modules: [
    { id: 1, title: "Introdução à Informática", duration: "2h", icon: <Monitor />, color: "bg-blue-100 text-blue-600", slides: [{title: "O que é Informática?", type: "theory", content: ["Ciência da informação automática.", "Hardware (físico) vs Software (programas)."]}] },
    { id: 2, title: "Hardware do Computador", duration: "4h", icon: <Cpu />, color: "bg-purple-100 text-purple-600", slides: [{title: "Peças de dentro", type: "theory", content: ["CPU: Cérebro.", "RAM: Mesa de trabalho.", "HD: Armário."]}] },
    { id: 3, title: "Periféricos", duration: "3h", icon: <Mouse />, color: "bg-orange-100 text-orange-600", slides: [{title: "Entrada e Saída", type: "concept", content: ["Mouse (Entra) e Monitor (Sai)."]}] },
    { id: 4, title: "Sistema Operacional", duration: "4h", icon: <Layout />, color: "bg-sky-100 text-sky-600", slides: [{title: "Windows", type: "activity", content: ["Organize suas pastas e arquivos."]}] },
    { id: 5, title: "Digitação Mágica", duration: "2h", icon: <Keyboard />, color: "bg-green-100 text-green-600", slides: [{title: "Teclado", type: "activity", content: ["Use o Shift para letras maiúsculas."]}] },
    { id: 6, title: "Word: O Escritor", duration: "4h", icon: <FileText />, color: "bg-indigo-100 text-indigo-600", slides: [{title: "Textos", type: "activity", content: ["Mude as cores e tamanhos das fontes."]}] },
    { id: 7, title: "PowerPoint", duration: "3h", icon: <Presentation />, color: "bg-rose-100 text-rose-600", slides: [{title: "Slides", type: "activity", content: ["Crie uma apresentação sobre você."]}] },
    { id: 8, title: "Excel Básico", duration: "3h", icon: <Table />, color: "bg-emerald-100 text-emerald-600", slides: [{title: "Planilhas", type: "concept", content: ["Use células para organizar números."]}] },
    { id: 9, title: "Segurança Digital", duration: "2h", icon: <ShieldCheck />, color: "bg-yellow-100 text-yellow-600", slides: [{title: "Internet", type: "theory", content: ["Cuidado com links estranhos e senhas."]}] },
    { id: 10, title: "Projeto Final", duration: "Fim", icon: <Trophy />, color: "bg-amber-100 text-amber-600", slides: [{title: "Formatura", type: "activity", content: ["Complete o desafio final para ganhar o certificado!"]}] }
  ]
};

// --- COMPONENTES ---

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState('cat');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
        await setDoc(doc(db, "users", res.user.uid), {
          name, email, avatar, completedModules: [], role: "student"
        });
      }
    } catch (err) { setError("Erro no login ou cadastro."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-md animate-fadeIn border-b-[12px] border-black/10">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
            <School size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">{isLogin ? "BEM-VINDO!" : "CRIAR HERÓI"}</h1>
        </div>

        {!isLogin && (
          <div className="flex justify-start gap-2 mb-6 overflow-x-auto p-2 no-scrollbar bg-slate-50 rounded-2xl">
            {avatars.map(av => (
              <button key={av.id} type="button" onClick={() => setAvatar(av.id)} className={`p-2 rounded-xl border-4 transition-all shrink-0 ${avatar === av.id ? 'border-blue-500 bg-white scale-110' : 'border-transparent opacity-40'}`}>
                <AvatarIcon id={av.id} size={32} />
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && <input type="text" placeholder="Seu Nome" className="w-full p-4 rounded-2xl bg-slate-100 border-none font-bold outline-none" value={name} onChange={e => setName(e.target.value)} required />}
          <input type="email" placeholder="Email" className="w-full p-4 rounded-2xl bg-slate-100 border-none font-bold outline-none" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" className="w-full p-4 rounded-2xl bg-slate-100 border-none font-bold outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all">
            {loading ? "..." : (isLogin ? "ENTRAR" : "CADASTRAR")}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center mt-6 text-xs font-black text-slate-400 uppercase tracking-widest">
          {isLogin ? "Não tem conta? Clique aqui" : "Já tenho conta"}
        </button>
      </div>
    </div>
  );
};

const LessonView = ({ module, onExit, onComplete }) => {
  const [idx, setIdx] = useState(0);
  const slide = module.slides[idx];
  const isLast = idx === module.slides.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-fadeIn">
      <div className="bg-white p-4 border-b-4 border-slate-100 flex justify-between items-center">
        <h2 className="font-black text-slate-700 uppercase text-xs tracking-[2px]">{module.title}</h2>
        <button onClick={onExit} className="p-2 bg-slate-100 rounded-xl text-slate-400"><X size={20}/></button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border-b-[12px] border-blue-600 max-w-2xl w-full text-center border-2 border-slate-100">
          <span className="text-xs font-black text-blue-400 uppercase tracking-[4px] mb-6 block">{slide.type}</span>
          <h1 className="text-4xl font-black text-slate-800 mb-8 leading-tight">{slide.title}</h1>
          <div className="text-left space-y-5 mb-12">
            {slide.content.map((c, i) => (
              <p key={i} className="text-xl text-slate-600 font-bold flex gap-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full mt-2 shrink-0 shadow-lg shadow-blue-200"></div>
                {c}
              </p>
            ))}
          </div>
          <button onClick={() => isLast ? onComplete(module.id) : setIdx(idx + 1)} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-2xl border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 transition-all">
            {isLast ? "CONCLUIR! 🏁" : "PRÓXIMO! ➡️"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const q = collection(db, "users");
    const unsub = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map(d => ({id: d.id, ...d.data()})).filter(u => u.role !== 'teacher'));
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-4 animate-fadeIn">
      <h2 className="text-2xl font-black text-slate-800 mb-6">ALUNOS ATIVOS</h2>
      {students.map(s => (
        <div key={s.id} className="bg-white p-5 rounded-[32px] border-2 border-slate-100 shadow-sm flex items-center justify-between border-b-8 border-b-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-slate-100">
              <AvatarIcon id={s.avatar} size={32} />
            </div>
            <div>
              <p className="font-black text-slate-800">{s.name}</p>
              <p className="text-[10px] font-black text-blue-500 uppercase">Progresso: {s.completedModules?.length || 0}/10</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`w-2 h-6 rounded-full ${s.completedModules?.includes(i+1) ? 'bg-green-400' : 'bg-slate-100'}`}></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Certificate = ({ name, avatar }) => {
  return (
    <div className="py-10 animate-fadeIn flex flex-col items-center">
      <div id="print-area" className="w-full max-w-[800px] aspect-[1.4] bg-white border-[20px] border-double border-blue-600 p-12 relative text-center flex flex-col justify-between shadow-2xl rounded-3xl">
        <h1 className="text-6xl font-black text-blue-700 italic tracking-tighter">CERTIFICADO</h1>
        <div className="my-10">
          <div className="flex justify-center mb-6"><AvatarIcon id={avatar} size={80} /></div>
          <p className="text-xl text-slate-400 font-bold mb-4 uppercase tracking-[5px]">Mestre da Informática</p>
          <h2 className="text-6xl font-black text-slate-800 border-b-8 border-slate-100 inline-block px-10 pb-4 capitalize">{name}</h2>
        </div>
        <p className="text-sm font-black text-slate-300 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
      </div>
      <button onClick={() => window.print()} className="mt-10 bg-green-500 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-xl border-b-8 border-green-700 no-print active:border-b-0 active:translate-y-2 transition-all">
        IMPRIMIR PRÊMIO 🖨️
      </button>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [view, setView] = useState('modules');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      setUser(curr);
      if (curr) {
        onSnapshot(doc(db, "users", curr.uid), (snap) => {
          if (snap.exists()) setUserData(snap.data());
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const handleComplete = async (mid) => {
    if (!userData.completedModules.includes(mid)) {
      await updateDoc(doc(db, "users", user.uid), { completedModules: arrayUnion(mid) });
    }
    setActiveLesson(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-blue-600 text-white font-black text-3xl italic animate-pulse">CARREGANDO...</div>;
  if (!user) return <AuthScreen />;
  if (activeLesson) return <LessonView module={activeLesson} onExit={() => setActiveLesson(null)} onComplete={handleComplete} />;

  const totalDone = userData?.completedModules?.length || 0;

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-white p-4 border-b-4 border-slate-100 sticky top-0 z-10 no-print">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <AvatarIcon id={userData?.avatar} size={40} className="bg-slate-50 p-1 rounded-xl border-2 border-slate-100" />
            <div>
              <p className="font-black text-slate-800 text-lg leading-tight uppercase italic">{userData?.name || "Herói"}</p>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{totalDone}/10 ESTRELAS</p>
            </div>
          </div>
          <button onClick={() => signOut(auth)} className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 transition-all"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 mt-4">
        {userData?.role === 'teacher' && (
          <div className="flex bg-slate-200 p-1.5 rounded-3xl mb-8 font-black text-xs no-print border-b-4 border-slate-300">
            <button onClick={() => setView('modules')} className={`flex-1 py-4 rounded-2xl transition-all ${view === 'modules' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>AULAS</button>
            <button onClick={() => setView('teacher')} className={`flex-1 py-4 rounded-2xl transition-all ${view === 'teacher' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>PROFESSOR</button>
          </div>
        )}

        {view === 'teacher' ? <TeacherDashboard /> : (
          <div className="space-y-4 animate-fadeIn no-print">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 italic uppercase">Minhas Missões</h2>
              {totalDone === 10 && <button onClick={() => setView('cert')} className="bg-yellow-400 text-yellow-900 font-black p-3 rounded-2xl text-xs shadow-lg animate-bounce border-b-4 border-yellow-600">CERTIFICADO!</button>}
            </div>

            {view === 'cert' ? <Certificate name={userData?.name} avatar={userData?.avatar} /> : (
              courseData.modules.map((m, i) => {
                const locked = i > 0 && !userData?.completedModules?.includes(courseData.modules[i-1].id);
                const done = userData?.completedModules?.includes(m.id);

                return (
                  <div key={m.id} onClick={() => !locked && setActiveLesson(m)} className={`p-6 rounded-[35px] border-2 border-b-[10px] transition-all flex items-center justify-between group ${locked ? 'bg-slate-100 border-slate-200 opacity-60 grayscale cursor-not-allowed' : done ? 'bg-green-50 border-green-200 border-b-green-400' : 'bg-white border-slate-100 border-b-slate-200 cursor-pointer hover:border-blue-400 hover:border-b-blue-600 hover:scale-[1.02]'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 ${locked ? 'bg-slate-200 text-slate-400' : done ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {locked ? <Lock size={28}/> : done ? <CheckCircle size={28}/> : m.icon}
                      </div>
                      <div>
                        <p className={`font-black text-xl leading-tight uppercase ${locked ? 'text-slate-400' : 'text-slate-800'}`}>{m.title}</p>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{locked ? 'Módulo Bloqueado' : m.duration}</p>
                      </div>
                    </div>
                    {done && <Star className="text-yellow-400 fill-yellow-400" size={24}/>}
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}

