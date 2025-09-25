import { CustomError } from "../middlewares/errorHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export class AuthenticationService {
    public async authenticate(username: string, password: string): Promise<string> {
        const user = await User.findOne({ where: { username, password } }); 
        
        if(!user) {
            let error: CustomError = new Error("Invalid username or password");
            error.status = 401;
            throw error;
        }

        const payload = {username: user.username, role: (user as any).role || "utilisateur"}
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' });
        return token;
    }
}

export const authenticationService = new AuthenticationService();