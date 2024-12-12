import bcrypt from "bcryptjs-react";

export default function hashPassword(password) {
    return bcrypt.hashSync(password, import.meta.env.VITE_SALT);
}
