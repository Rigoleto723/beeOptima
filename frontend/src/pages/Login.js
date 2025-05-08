import { IconRotateClockwise, IconUser, IconLock } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import client from '../axiosConfig';
import { useSession } from '../context/sessionContext';
import logotipo from "../assets/logo.jpg";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [animateBackground, setAnimateBackground] = useState(false);
    const navigate = useNavigate();
    const { login } = useSession();

    useEffect(() => {
        setAnimateBackground(true);
    }, []);

    const submitLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            // Depuración - Mostrar la URL base de Axios antes de la solicitud
            console.log("Base URL antes de login:", client.defaults.baseURL);
            console.log("Enviando solicitud a:", `${client.defaults.baseURL}/api/users/login/`);

            // Usar la configuración básica sin cabeceras adicionales
            const response = await client.post("/api/users/login/", { username, password });
            console.log("Respuesta completa del servidor:", response.data);

            const { access, refresh } = response.data.tokens;
            const user = response.data.user;

            console.log("Datos de usuario:", user);
            console.log("must_change_password:", user.must_change_password);

            // Guardar sesión en el contexto
            login(access, refresh, user);

            if (user.must_change_password) {
                console.log("Redirigiendo a cambio de contraseña");
                toast.success("Por favor, cambie su contraseña para continuar");
                setTimeout(() => {
                    navigate("/change-password", { replace: true });
                }, 100);
            } else {
                console.log("Redirigiendo a dashboard");
                toast.success("Inicio de sesión exitoso");
                navigate("/app/hives", { replace: true });
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            const message = error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.error ||
                "Error al iniciar sesión. Intente nuevamente.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            submitLogin();
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900 p-4 transition-all duration-1000 ${animateBackground ? 'opacity-100' : 'opacity-0'}`}>
            {/* Círculos animados en el fondo */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-3xl -top-64 -left-64 animate-blob animation-delay-2000"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-yellow-600/20 to-amber-600/20 blur-3xl -bottom-32 -right-32 animate-blob animation-delay-4000"></div>
            <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl bottom-64 left-64 animate-blob"></div>

            <div className="w-full max-w-md relative">
                {/* Card del login con efecto glassmorphism */}
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] border border-white/20 overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
                    <div className="p-8">
                        <div className="flex justify-center mb-8 relative">
                            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full blur-xl"></div>
                            <div className="relative bg-white/10 p-3 rounded-full backdrop-blur-sm border border-white/20 shadow-xl transform hover:rotate-3 transition-all duration-300">
                                <img src={logotipo} alt="Bee Optima Logo" className="h-16 rounded-full" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center mb-1">Bienvenido</h1>
                        <p className="text-gray-300 text-center mb-8 text-sm">Ingresa tus credenciales para continuar</p>

                        <div className="space-y-6">
                            <div className="transform transition-all duration-300 hover:translate-x-1">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Nombre de Usuario</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-gray-400">
                                            <IconUser size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            className="bg-gray-800/70 text-white pl-12 rounded-lg w-full py-3 px-4 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 outline-none backdrop-blur-md"
                                            value={username}
                                            onChange={(e) => setUsername(e.currentTarget.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ingrese su nombre de usuario"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="transform transition-all duration-300 hover:translate-x-1">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-gray-400">
                                            <IconLock size={18} />
                                        </span>
                                        <input
                                            type="password"
                                            className="bg-gray-800/70 text-white pl-12 rounded-lg w-full py-3 px-4 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 outline-none backdrop-blur-md"
                                            value={password}
                                            onChange={(e) => setPassword(e.currentTarget.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ingrese su contraseña"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-3px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-[0_5px_15px_rgba(30,64,175,0.35)]"
                                    onClick={submitLogin}
                                >
                                    <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                                    <span className="relative flex items-center justify-center">
                                        {loading ?
                                            <IconRotateClockwise className='animate-spin mx-auto' size={22} /> :
                                            'Ingresar'
                                        }
                                    </span>
                                </button>
                            </div>

                            <div className="text-center mt-6">
                                <p className="text-gray-400 text-xs">© 2024 Bee Optima</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Añade estos estilos al CSS global o crea un archivo CSS para este componente
const styleElement = document.createElement('style');
styleElement.textContent = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`;
document.head.appendChild(styleElement);

export default Login;
