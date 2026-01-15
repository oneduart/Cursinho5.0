import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, onAuthStateChanged, updateProfile 
} from "firebase/auth";
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, 
  collection, onSnapshot, query, where 
} from "firebase/firestore";
import { 
  Monitor, Cpu, Mouse, Layout, Keyboard, FileText, Presentation, Table, 
  ShieldCheck, Trophy, ChevronDown, ChevronUp, BookOpen, Clock, 
  CheckCircle, Dices, Menu, Play, X, ArrowRight, ArrowLeft, Star,
  User, Lock, Award, Printer, LogOut, Users, School, Zap, Cat, Dog, Rabbit, Bird, Rocket, Gamepad2, Smile, Trash2, Unlock
} from 'lucide-react';

// --- CONFIGURAÇÃO DO FIREBASE ---
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
  { id: 'cat', icon: Cat, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 'dog', icon: Dog, color: 'text-amber-700', bg: 'bg-amber-100' },
  { id: 'rabbit', icon: Rabbit, color: 'text-pink-500', bg: 'bg-pink-100' },
  { id: 'bird', icon: Bird, color: 'text-sky-500', bg: 'bg-sky-100' },
  { id: 'robot', icon: Rocket, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'gamer', icon: Gamepad2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { id: 'smile', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-100' },
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
        await updateProfile(res.user, { displayName: name, photoURL: avatar });
        await setDoc(doc(db, "users", res.user.uid), {
          name, email, avatar, completedModules: [], role: "student"
        });
      }
    } catch (err) { setError("Erro ao acessar conta. Verifique os dados."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
            <School size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-800">{isLogin ? "Olá de novo!" : "Criar Personagem"}</h1>
        </div>

        {!isLogin && (
          <div className="flex justify-center gap-2 mb-6 overflow-x-auto p-2 no-scrollbar">
            {avatars.map(av => (
              <button key={av.id} onClick={() => setAvatar(av.id)} className={`p-2 rounded-xl border-2 transition-all ${avatar === av.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 opacity-50'}`}>
                <AvatarIcon id={av.id} size={32} />
              </button>
            ))}
          </div>
        )}

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-4 text-center font-bold border border-red-100">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-3">
          {!isLogin && <input type="text" placeholder="Nome Completo" className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-400 outline-none" value={name} onChange={e => setName(e.target.value)} required />}
          <input type="email" placeholder="Email" className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-400 outline-none" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-400 outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all">
            {loading ? "Aguarde..." : (isLogin ? "ENTRAR" : "CRIAR CONTA")}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center mt-6 text-sm text-slate-400 font-bold uppercase tracking-widest">
          {isLogin ? "Não tem conta? Cadastre-se" : "Já tenho conta"}
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
      <div className="bg-white p-4 border-b flex justify-between items-center shadow-sm">
        <h2 className="font-black text-slate-700 uppercase text-sm tracking-widest">{module.title}</h2>
        <button onClick={onExit} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border-b-[12px] border-blue-600 max-w-2xl w-full text-center">
          <span className="text-xs font-black text-blue-400 uppercase tracking-[4px] mb-6 block">{slide.type}</span>
          <h1 className="text-3xl font-black text-slate-800 mb-8 leading-tight">{slide.title}</h1>
          <div className="text-left space-y-5 mb-12">
            {slide.content.map((c, i) => (
              <p key={i} className="text-xl text-slate-600 font-medium flex gap-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2.5 shrink-0 shadow-lg shadow-blue-200"></div>
                {c}
              </p>
            ))}
          </div>
          <button onClick={() => isLast ? onComplete(module.id) : setIdx(idx + 1)} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-blue-200">
            {isLast ? "CONCLUIR MISSÃO 🏁" : "PRÓXIMO PASSO ➡️"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = ({ onReset }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, "users");
    const unsub = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map(d => ({id: d.id, ...d.data()})).filter(u => u.role !== 'teacher'));
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">Carregando lista de alunos...</div>;

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
        <Users className="text-blue-600" /> Dashboard do Professor
      </h2>
      <div className="grid gap-4">
        {students.map(s => (
          <div key={s.id} className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                <AvatarIcon id={s.avatar} size={32} />
              </div>
              <div>
                <p className="font-black text-slate-800 text-lg">{s.name}</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${s.completedModules?.includes(i+1) ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xs font-black text-slate-400 uppercase mb-1">Status</span>
              <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-2xl text-sm font-black">
                {s.completedModules?.length || 0}/10 Estrelas
              </span>
            </div>
          </div>
        ))}
        {students.length === 0 && <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">Nenhum aluno cadastrado ainda.</div>}
      </div>
    </div>
  );
};

const Certificate = ({ name, avatar }) => {
  return (
    <div className="py-10 animate-fadeIn flex flex-col items-center">
      <div id="print-area" className="w-full max-w-[800px] aspect-[1.4] bg-white border-[20px] border-double border-blue-600 p-12 relative text-center flex flex-col justify-between shadow-2xl">
        <div className="absolute top-10 right-10 opacity-20"><Trophy size={100} /></div>
        <div>
          <h1 className="text-6xl font-black text-blue-700 tracking-tighter mb-2">CERTIFICADO</h1>
          <p className="text-xl font-bold text-slate-400 uppercase tracking-[10px]">Incrível!</p>
        </div>
        <div className="my-10">
          <div className="flex justify-center mb-6"><AvatarIcon id={avatar} size={80} /></div>
          <p className="text-xl text-slate-500 mb-4 font-medium">Parabéns, você completou o treinamento!</p>
          <h2 className="text-5xl font-black text-slate-800 border-b-4 border-slate-100 inline-block px-10 pb-4 capitalize">{name}</h2>
          <p className="text-2xl font-bold text-blue-600 mt-6">EXPERI NO PORTAL KIDS</p>
        </div>
        <div className="flex justify-between items-end border-t-2 border-slate-100 pt-8">
          <div className="text-left">
            <p className="text-xs font-black text-slate-400 uppercase">Data</p>
            <p className="font-bold">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-200 border-4 border-white rotate-12">SELO</div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-400 uppercase">Professor</p>
            <div className="w-32 h-0.5 bg-slate-300 mt-4"></div>
          </div>
        </div>
      </div>
      <button onClick={() => window.print()} className="mt-10 bg-blue-600 text-white px-10 py-5 rounded-3xl font-black flex items-center gap-3 shadow-2xl shadow-blue-200 no-print hover:scale-110 transition-all">
        <Printer /> IMPRIMIR MEU PRÊMIO
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
    const unsubAuth = onAuthStateChanged(auth, async (curr) => {
      setUser(curr);
      if (curr) {
        const docRef = doc(db, "users", curr.uid);
        const unsubDoc = onSnapshot(docRef, (snap) => {
          if (snap.exists()) setUserData(snap.data());
        });
        return () => unsubDoc();
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  const handleComplete = async (mid) => {
    if (!userData.completedModules.includes(mid)) {
      await updateDoc(doc(db, "users", user.uid), { completedModules: arrayUnion(mid) });
    }
    setActiveLesson(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-blue-600 text-white font-black text-2xl animate-pulse">LIGANDO COMPUTADORES...</div>;
  if (!user) return <AuthScreen />;
  if (activeLesson) return <LessonView module={activeLesson} onExit={() => setActiveLesson(null)} onComplete={handleComplete} />;

  const isCompleted = (id) => userData?.completedModules?.includes(id);
  const totalCompleted = userData?.completedModules?.length || 0;
  const isAllDone = totalCompleted >= 10;

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-white p-4 border-b-2 border-slate-100 sticky top-0 z-10 no-print">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border shadow-sm">
              <AvatarIcon id={userData?.avatar} size={28} />
            </div>
            <div>
              <p className="font-black text-slate-800 text-base leading-tight uppercase tracking-tight">{userData?.name || "Aluno"}</p>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${(totalCompleted/10)*100}%` }}></div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase">{totalCompleted}/10 Estrelas</p>
              </div>
            </div>
          </div>
          <button onClick={() => signOut(auth)} className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-red-500 transition-all"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 mt-6">
        {userData?.role === 'teacher' && (
          <div className="flex bg-slate-200 p-1.5 rounded-2xl mb-8 font-black text-xs no-print">
            <button onClick={() => setView('modules')} className={`flex-1 py-4 rounded-xl transition-all ${view === 'modules' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}>AULAS</button>
            <button onClick={() => setView('teacher')} className={`flex-1 py-4 rounded-xl transition-all ${view === 'teacher' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}>PROFESSOR</button>
          </div>
        )}

        {view === 'teacher' ? <TeacherDashboard /> : (
          <div className="space-y-4 animate-fadeIn no-print">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Missões Ativas</h2>
              {isAllDone && (
                <button onClick={() => setView('certificate')} className="bg-yellow-400 text-yellow-900 font-black px-4 py-2 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-yellow-100 animate-bounce">
                  <Award size={16}/> VER CERTIFICADO
                </button>
              )}
            </div>

            {view === 'certificate' ? <Certificate name={userData?.name} avatar={userData?.avatar} /> : (
              courseData.modules.map((m, index) => {
                const isLocked = index > 0 && !userData?.completedModules?.includes(courseData.modules[index-1].id);
                const done = isCompleted(m.id);

                return (
                  <div 
                    key={m.id} 
                    onClick={() => !isLocked && setActiveLesson(m)}
                    className={`p-6 rounded-[32px] border-b-8 border-2 transition-all flex items-center justify-between group
                      ${isLocked ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed' : 
                        done ? 'bg-green-50 border-green-200 border-b-green-400' : 
                        'bg-white border-slate-100 border-b-slate-200 hover:border-blue-400 hover:border-b-blue-600 cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6
                        ${isLocked ? 'bg-slate-200 text-slate-400' : done ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}
                      `}>
                        {isLocked ? <Lock size={28}/> : done ? <CheckCircle size={28}/> : m.icon}
                      </div>
                      <div>
                        <p className={`font-black text-lg leading-tight uppercase ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{m.title}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{isLocked ? 'Bloqueado' : m.duration}</p>
                      </div>
                    </div>
                    {!isLocked && done && <Star className="text-yellow-400 fill-yellow-400" size={24}/>}
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

