import bcrypt from "bcryptjs";

export function hashPassword(password) {
    return bcrypt.hashSync(password, import.meta.env.VITE_SALT);
}
