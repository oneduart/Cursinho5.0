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
  info: {
    title: "Informática Kids",
    target: "Nível Infantil (10 anos)",
    duration: "20-30 horas",
    methodology: "80% Prática / 20% Teoria"
  },
  modules: [
    {
      id: 1,
      title: "Introdução à Informática",
      duration: "2h",
      icon: <Monitor />,
      color: "bg-blue-100 text-blue-600 border-blue-200",
      description: "O básico sobre computadores e como eles funcionam.",
      slides: [
        { title: "O que é Informática?", type: "theory", content: ["Informática é a ciência que estuda o tratamento da informação automática.", "Basicamente: É usar computadores para criar, guardar e encontrar informações!", "Onde usamos? Na escola, no hospital, no banco, nos jogos e no celular."] },
        { title: "Tipos de Computadores", type: "theory", content: ["🖥️ Desktop (Computador de Mesa): Grande, potente, fica parado.", "💻 Notebook: Portátil, bateria, teclado junto da tela.", "📱 Tablet/Smartphone: Tela de toque, super portátil."] },
        { title: "Hardware vs Software", type: "concept", content: ["🔨 HARDWARE: É tudo o que você pode CHUTAR (A parte física). Ex: Teclado, Tela, Mouse.", "👻 SOFTWARE: É tudo o que você pode XINGAR (Os programas). Ex: Windows, Joguinhos, YouTube."] },
        { title: "Atividade Prática", type: "activity", content: ["1. Olhe ao seu redor na sua casa ou sala.", "2. Liste 3 equipamentos eletrônicos.", "3. Classifique: Tem tela? Tem teclado?"] },
        { title: "Desafio Rápido!", type: "quiz", content: ["Eu vou falar um nome, e você grita se é HARDWARE ou SOFTWARE!", "Mouse? (Hardware)", "Minecraft? (Software)", "WhatsApp? (Software)"] }
      ]
    },
    {
      id: 2,
      title: "Hardware do Computador",
      duration: "4h",
      icon: <Cpu />,
      color: "bg-purple-100 text-purple-600 border-purple-200",
      description: "Entendendo as peças de dentro do computador.",
      slides: [
        { title: "O Gabinete", type: "theory", content: ["O gabinete é a caixa que guarda todas as peças importantes.", "Não confunda: O monitor é a tela, o gabinete é a 'caixa'!"] },
        { title: "As Peças (Analogia do Corpo)", type: "concept", content: ["🧠 Processador (CPU): É o cérebro. Ele pensa e faz os cálculos.", "⚡ Fonte: É o coração. Dá energia para tudo funcionar.", "📦 HD ou SSD: É o armário. Onde guardamos fotos e jogos."] },
        { title: "Memória RAM", type: "concept", content: ["A Memória RAM é a sua 'Mesa de Trabalho'.", "Quanto maior a mesa, mais coisas você faz ao mesmo tempo.", "Quando desliga o PC, a mesa é limpa!"] }
      ]
    },
    {
      id: 3,
      title: "Periféricos",
      duration: "3h",
      icon: <Mouse />,
      color: "bg-orange-100 text-orange-600 border-orange-200",
      description: "Dispositivos de entrada e saída.",
      slides: [
        { title: "O que são Periféricos?", type: "theory", content: ["São peças que ficam em volta do gabinete.", "Eles servem para a gente conversar com o computador."] },
        { title: "Entrada vs Saída", type: "concept", content: ["➡️ Entrada (Input): Manda informação PRA DENTRO. Ex: Teclado.", "⬅️ Saída (Output): Tira informação PARA FORA. Ex: Monitor."] }
      ]
    },
    {
      id: 4,
      title: "Sistema Operacional",
      duration: "4h",
      icon: <Layout />,
      color: "bg-sky-100 text-sky-600 border-sky-200",
      description: "Windows, Pastas e Arquivos.",
      slides: [
        { title: "O Chefe do Computador", type: "theory", content: ["O Sistema Operacional (Windows) é o chefe.", "Ele controla o hardware e deixa você usar os programas."] },
        { title: "Organizando a Bagunça", type: "activity", content: ["1. Clique com botão direito na Área de Trabalho.", "2. Novo > Pasta.", "3. Escreva seu NOME."] }
      ]
    },
    {
      id: 5,
      title: "Digitação Mágica",
      duration: "2h",
      icon: <Keyboard />,
      color: "bg-green-100 text-green-600 border-green-200",
      description: "Aprendendo a usar o teclado corretamente.",
      slides: [
        { title: "As Teclas Poderosas", type: "theory", content: ["ENTER: Botão de confirmação.", "BACKSPACE: Apaga para trás.", "SPACE: Dá espaço entre palavras."] },
        { title: "O Segredo do SHIFT", type: "concept", content: ["Segure o SHIFT e aperte uma letra para ela sair MAIÚSCULA."] }
      ]
    },
    {
      id: 6,
      title: "Word: O Escritor",
      duration: "4h",
      icon: <FileText />,
      color: "bg-indigo-100 text-indigo-600 border-indigo-200",
      description: "Criando documentos bonitos.",
      slides: [
        { title: "Conhecendo o Word", type: "theory", content: ["É um processador de texto para trabalhos e cartas."] },
        { title: "Maquiagem do Texto", type: "concept", content: ["Fonte: O desenho da letra.", "Tamanho: Letra grande ou pequena.", "Negrito: Letra gordinha."] }
      ]
    },
    {
      id: 7,
      title: "PowerPoint: O Artista",
      duration: "3h",
      icon: <Presentation />,
      color: "bg-rose-100 text-rose-600 border-rose-200",
      description: "Criando apresentações e slides.",
      slides: [
        { title: "O que é um Slide?", type: "theory", content: ["É como um cartaz digital para apresentações."] },
        { title: "Hora do Show", type: "activity", content: ["Aperte F5 para ver seu slide em TELA CHEIA!"] }
      ]
    },
    {
      id: 8,
      title: "Excel: O Matemático",
      duration: "3h",
      icon: <Table />,
      color: "bg-emerald-100 text-emerald-600 border-emerald-200",
      description: "Planilhas e tabelas básicas.",
      slides: [
        { title: "Linhas e Colunas", type: "theory", content: ["Colunas são Letras (A, B, C).", "Linhas são Números (1, 2, 3)."] },
        { title: "A Fórmula Mágica", type: "concept", content: ["Toda conta começa com o sinal de IGUAL (=)."] }
      ]
    },
    {
      id: 9,
      title: "Segurança Digital",
      duration: "2h",
      icon: <ShieldCheck />,
      color: "bg-yellow-100 text-yellow-600 border-yellow-200",
      description: "Navegando sem perigos.",
      slides: [
        { title: "O Perigo dos Cliques", type: "theory", content: ["Não clique em anúncios que prometem prêmios grátis!"] },
        { title: "Senhas Fortes", type: "concept", content: ["Nunca conte sua senha para estranhos, só para os pais."] }
      ]
    },
    {
      id: 10,
      title: "Grande Projeto Final",
      duration: "Fim",
      icon: <Trophy />,
      color: "bg-amber-100 text-amber-600 border-amber-200",
      description: "Mostrando tudo o que aprendeu.",
      slides: [
        { title: "A Missão Final", type: "activity", content: ["Crie uma pasta chamada PROJETO FINAL e guarde seus arquivos nela.", "Parabéns por chegar ao fim!"] }
      ]
    }
  ]
};

// --- COMPONENTES ---

https://cursinho5-0.vercel.app/

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

