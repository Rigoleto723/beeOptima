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
        <div className={`min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-orange-300 via-orange-400 to-yellow-200 p-4 transition-all duration-1000 ${animateBackground ? 'opacity-100' : 'opacity-0'}`}>
            {/* Círculos animados en el fondo */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-orange-400/40 to-yellow-300/40 blur-3xl -top-64 -left-64 animate-blob animation-delay-2000"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-yellow-400/30 to-orange-300/30 blur-3xl -bottom-32 -right-32 animate-blob animation-delay-4000"></div>
            <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-orange-300/30 to-yellow-200/30 blur-3xl bottom-64 left-64 animate-blob"></div>

            <div className="w-full max-w-md relative">
                {/* Card del login con efecto glassmorphism */}
                <div className="backdrop-blur-xl bg-orange-200/80 rounded-2xl shadow-[0_8px_32px_rgba(255,140,0,0.18)] border border-orange-400 overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
                    <div className="p-8">
                        <div className="flex justify-center mb-8 relative">
                            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-orange-400/40 to-yellow-300/40 rounded-full blur-xl"></div>
                            <div className="relative bg-orange-200/40 p-3 rounded-full backdrop-blur-sm border border-orange-400 shadow-xl transform hover:rotate-3 transition-all duration-300">
                                <img src={logotipo} alt="Bee Optima Logo" className="h-16 rounded-full" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 text-center mb-1">Bienvenido</h1>
                        <p className="text-orange-900 text-center mb-8 text-sm">Ingresa tus credenciales para continuar</p>

                        <div className="space-y-6">
                            <div className="transform transition-all duration-300 hover:translate-x-1">
                                <label className="block text-orange-900 text-sm font-medium mb-2">Nombre de Usuario</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-300 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-orange-900 z-10">
                                            <IconUser size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            className="bg-orange-200/80 text-orange-900 pl-12 rounded-lg w-full py-3 px-4 border border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 transition-all duration-200 outline-none backdrop-blur-md placeholder-orange-400"
                                            value={username}
                                            onChange={(e) => setUsername(e.currentTarget.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ingrese su nombre de usuario"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="transform transition-all duration-300 hover:translate-x-1">
                                <label className="block text-orange-900 text-sm font-medium mb-2">Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-orange-900 z-10">
                                            <IconLock size={18} />
                                        </span>
                                        <input
                                            type="password"
                                            className="bg-orange-200/80 text-orange-900 pl-12 rounded-lg w-full py-3 px-4 border border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 transition-all duration-200 outline-none backdrop-blur-md placeholder-orange-400"
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
                                    className="w-full relative overflow-hidden group bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-3px] focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-[0_5px_15px_rgba(255,140,0,0.25)]"
                                    onClick={submitLogin}
                                >
                                    <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                                    <span className="relative flex items-center justify-center">
                                        {loading ?
                                            <IconRotateClockwise className='animate-spin mx-auto text-orange-500' size={22} /> :
                                            'Ingresar'
                                        }
                                    </span>
                                </button>
                            </div>

                            <div className="text-center mt-6">
                                <p className="text-orange-400 text-xs">© 2024 Bee Optima</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Login;
