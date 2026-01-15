import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  Monitor,
  Cpu,
  Mouse,
  Layout,
  Keyboard,
  FileText,
  Presentation,
  Table,
  ShieldCheck,
  Trophy,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  CheckCircle,
  Dices,
  Menu,
  Play,
  X,
  ArrowRight,
  ArrowLeft,
  Star,
  User,
  Lock,
  Award,
  Printer,
  LogOut,
  Users,
  School,
  Zap,
} from "lucide-react";

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

// --- CONTEÚDO DO CURSO ---
const courseData = {
  info: { title: "Informática Kids", modulesCount: 10 },
  modules: [
    {
      id: 1,
      title: "Introdução à Informática",
      duration: "2h",
      icon: <Monitor size={24} />,
      color: "bg-blue-100 text-blue-600 border-blue-200",
      description: "O básico sobre computadores.",
      slides: [
        {
          title: "O que é Informática?",
          type: "theory",
          content: [
            "Informática é a ciência que estuda a informação automática.",
            "Usamos computadores para facilitar o nosso dia a dia.",
          ],
        },
        {
          title: "Hardware vs Software",
          type: "concept",
          content: [
            "Hardware: Parte física (ex: monitor, mouse).",
            "Software: Parte lógica (ex: Windows, jogos).",
          ],
        },
        {
          title: "Atividade",
          type: "activity",
          content: ["Encontre 2 hardwares e 2 softwares na sua frente agora!"],
        },
      ],
    },
    {
      id: 2,
      title: "Hardware do Computador",
      duration: "4h",
      icon: <Cpu size={24} />,
      color: "bg-purple-100 text-purple-600 border-purple-200",
      description: "As peças de dentro do gabinete.",
      slides: [
        {
          title: "O Processador (CPU)",
          type: "theory",
          content: [
            "É o cérebro do computador.",
            "Ele processa todas as informações e comandos.",
          ],
        },
        {
          title: "HD e SSD",
          type: "concept",
          content: [
            "É o armário do computador.",
            "Onde guardamos nossos arquivos para sempre.",
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Periféricos",
      duration: "3h",
      icon: <Mouse size={24} />,
      color: "bg-orange-100 text-orange-600 border-orange-200",
      description: "Dispositivos de entrada e saída.",
      slides: [
        {
          title: "Teclado e Monitor",
          type: "theory",
          content: ["Teclado envia ordens.", "Monitor mostra o resultado."],
        },
      ],
    },
    {
      id: 4,
      title: "Sistema Operacional",
      duration: "4h",
      icon: <Layout size={24} />,
      color: "bg-sky-100 text-sky-600 border-sky-200",
      description: "Trabalhando com o Windows.",
      slides: [
        {
          title: "Pastas",
          type: "activity",
          content: ["Crie uma pasta com seu nome na Área de Trabalho."],
        },
      ],
    },
    {
      id: 5,
      title: "Digitação Mágica",
      duration: "2h",
      icon: <Keyboard size={24} />,
      color: "bg-green-100 text-green-600 border-green-200",
      description: "Teclas e atalhos.",
      slides: [
        {
          title: "Acentuação",
          type: "concept",
          content: ["Para fazer Á: aperte o acento e depois o A."],
        },
      ],
    },
    {
      id: 6,
      title: "Word: O Escritor",
      duration: "4h",
      icon: <FileText size={24} />,
      color: "bg-indigo-100 text-indigo-600 border-indigo-200",
      description: "Editor de textos.",
      slides: [
        {
          title: "Negrito e Cores",
          type: "activity",
          content: ["Escreva uma frase e mude a cor para azul."],
        },
      ],
    },
    {
      id: 7,
      title: "PowerPoint",
      duration: "3h",
      icon: <Presentation size={24} />,
      color: "bg-rose-100 text-rose-600 border-rose-200",
      description: "Apresentações criativas.",
      slides: [
        {
          title: "Slides Criativos",
          type: "theory",
          content: ["Use imagens grandes e pouco texto."],
        },
      ],
    },
    {
      id: 8,
      title: "Excel Básico",
      duration: "3h",
      icon: <Table size={24} />,
      color: "bg-emerald-100 text-emerald-600 border-emerald-200",
      description: "Planilhas e tabelas.",
      slides: [
        {
          title: "Células",
          type: "concept",
          content: ["O encontro de uma Linha com uma Coluna."],
        },
      ],
    },
    {
      id: 9,
      title: "Segurança Digital",
      duration: "2h",
      icon: <ShieldCheck size={24} />,
      color: "bg-yellow-100 text-yellow-600 border-yellow-200",
      description: "Cuidado na internet.",
      slides: [
        {
          title: "Senhas Fortes",
          type: "theory",
          content: ["Crie senhas com letras e números."],
        },
      ],
    },
    {
      id: 10,
      title: "Projeto Final",
      duration: "Fim",
      icon: <Trophy size={24} />,
      color: "bg-amber-100 text-amber-600 border-amber-200",
      description: "Formatura!",
      slides: [
        {
          title: "Finalização",
          type: "activity",
          content: ["Mostre tudo o que aprendeu hoje!"],
        },
      ],
    },
  ],
};

// --- COMPONENTES ---

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
        await setDoc(doc(db, "users", res.user.uid), {
          name,
          email,
          completedModules: [],
          role: "student",
        });
      }
    } catch (err) {
      setError("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-200">
            <School size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            {isLogin ? "Entrar na Aula" : "Criar Cadastro"}
          </h1>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 text-center font-bold border border-red-100">
            {error}
          </div>
        )}
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Seu Nome"
              className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex justify-center"
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-center mt-6 text-sm text-slate-500 font-medium"
        >
          {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
        </button>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const snap = await getDocs(collection(db, "users"));
      setStudents(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((u) => u.role !== "teacher")
      );
    };
    getData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
        <Users className="text-blue-600" /> Relatório da Turma
      </h2>
      <div className="space-y-4">
        {students.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
          >
            <div>
              <p className="font-bold text-slate-800">{s.name}</p>
              <p className="text-xs text-slate-500">{s.email}</p>
            </div>
            <div className="text-right">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                {s.completedModules?.length || 0} estrelas
              </span>
            </div>
          </div>
        ))}
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
      <div className="bg-white p-4 flex justify-between items-center border-b border-slate-200">
        <h2 className="font-bold text-slate-700">{module.title}</h2>
        <button
          onClick={onExit}
          className="p-2 bg-slate-100 rounded-full text-slate-500"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border-b-8 border-blue-600 max-w-2xl w-full text-center">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 block">
            {slide.type}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-8">
            {slide.title}
          </h1>
          <div className="text-left space-y-4 mb-10">
            {slide.content.map((c, i) => (
              <p key={i} className="text-lg text-slate-600 flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                {c}
              </p>
            ))}
          </div>
          <button
            onClick={() => (isLast ? onComplete(module.id) : setIdx(idx + 1))}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-blue-100"
          >
            {isLast ? "Concluir Aula 🏁" : "Próximo Passo ➡️"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [view, setView] = useState("modules");
  const [init, setInit] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curr) => {
      setUser(curr);
      if (curr) {
        const d = await getDoc(doc(db, "users", curr.uid));
        setUserData(d.data());
      }
      setInit(false);
    });
    return unsub;
  }, []);

  const handleComplete = async (mid) => {
    if (!userData.completedModules.includes(mid)) {
      const newList = [...userData.completedModules, mid];
      setUserData({ ...userData, completedModules: newList });
      await updateDoc(doc(db, "users", user.uid), {
        completedModules: arrayUnion(mid),
      });
    }
    setActiveLesson(null);
  };

  if (init)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">
        Abrindo portal...
      </div>
    );
  if (!user) return <AuthScreen />;
  if (activeLesson)
    return (
      <LessonView
        module={activeLesson}
        onExit={() => setActiveLesson(null)}
        onComplete={handleComplete}
      />
    );

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              {userData?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                {userData?.name || "Aluno"}
              </p>
              <p className="text-xs text-slate-400 capitalize">
                {userData?.role || "Estudante"}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 mt-4">
        {userData?.role === "teacher" && (
          <div className="flex bg-slate-200 p-1 rounded-xl mb-6 font-bold text-sm">
            <button
              onClick={() => setView("modules")}
              className={`flex-1 py-3 rounded-lg ${
                view === "modules"
                  ? "bg-white shadow text-blue-600"
                  : "text-slate-500"
              }`}
            >
              Aulas
            </button>
            <button
              onClick={() => setView("teacher")}
              className={`flex-1 py-3 rounded-lg ${
                view === "teacher"
                  ? "bg-white shadow text-blue-600"
                  : "text-slate-500"
              }`}
            >
              Professor
            </button>
          </div>
        )}

        {view === "teacher" ? (
          <TeacherDashboard />
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-slate-800">
                Minha Jornada
              </h2>
              <div className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-bold">
                {userData?.completedModules?.length || 0} / 10
              </div>
            </div>
            {courseData.modules.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveLesson(m)}
                className={`p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
                  userData?.completedModules?.includes(m.id)
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-slate-100 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${m.color} bg-opacity-20`}>
                    {userData?.completedModules?.includes(m.id) ? (
                      <CheckCircle className="text-green-600" />
                    ) : (
                      m.icon
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 leading-tight">
                      {m.title}
                    </p>
                    <p className="text-xs text-slate-400">{m.duration}</p>
                  </div>
                </div>
                {userData?.completedModules?.includes(m.id) && (
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
