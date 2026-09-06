// Traemos la librería jsonwebtoken, que nos permite crear y verificar tokens JWT.
import jwt from "jsonwebtoken";     
import dotenv from "dotenv";

dotenv.config();

// Esta clave se utiliza para firmar y verificar los tokens.
const JWT_SECRET = process.env.JWT_SECRET;
// si no obtenemos ninugun valor de la derecha utilizamos un dia(hacemos eso gracias a ||)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// El token sirve para que después el servidor pueda reconocer que el usuario está autenticado.

// Esta función sirve para crear un token JWT
// El payload son los datos que queremos guardar dentro del token.
export const generateToken = (payload) => {
    // Payload → contiene id, username, role, etc.
    // JWT_SECRET → es la clave secreta que usamos para firmar y después comprobar que el token es auténtico.
    // JWT_EXPIRES_IN → indica cuánto tiempo puede utilizarse el token.
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Esta función hace lo contrario.
// generateToken(): Crea el token.
// verifyToken(): Comprueba si el token es válido.
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

