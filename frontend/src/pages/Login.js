import { IconRotateClockwise } from '@tabler/icons-react';
import { useState } from 'react';
import client from '../axiosConfig';
import { useSession } from '../context/sessionContext';
import logotipo from "../assets/logo.jpg";
import toast from 'react-hot-toast';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setSessionId } = useSession();

    const submitLogin = () => {
        setLoading(true);
        if (!username || username === '' || !password || password === '') {
            // Aquí puedes añadir lógica adicional para manejar campos vacíos
            setLoading(false); // Añadido para asegurarse de que el estado de carga se restablezca
            return;
        }
        client
            .post(
                '/api/auth/login/',
                {
                    username,
                    password,
                },
                { withCredentials: true }
            )
            .then((response) => {
                console.log('LOGIN RESPONSE', response);
                setSessionId(response.data);
            })
            .catch((error) => {
                console.log('LOGIN ERROR', error);
                toast.error('Usuario o Contraseña Incorrecta');
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <div className="grid grid-cols-1 h-screen md:grid-cols-3 bg-black">
                <div className="flex flex-col justify-between p-7 z-10">
                    <div className="flex flex-row gap-2">
                        <img src={logotipo} alt="" className="h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold pb-6">Bienvenido</h1>
                        <div className="pb-6">
                            <label className="text-gray-500">Nombre de Usuario</label>
                            <input
                                type="text"
                                className="bg-gray-900 text-gray-200 rounded-lg w-full p-3 border-none outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.currentTarget.value)}
                            />
                        </div>
                        <div className="pb-10">
                            <label className="text-gray-500">Contraseña</label>
                            <input
                                type="password"
                                className="bg-gray-900 text-gray-200 rounded-lg w-full p-3 border-none outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                            />
                        </div>
                        <button className="w-full bg-blue-500 p-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 cursor-pointer flex justify-center" onClick={submitLogin}>
                            {loading ? <IconRotateClockwise className='animate-spin' /> : 'Ingresar'}
                        </button>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">© 2024 Bee Optima</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
