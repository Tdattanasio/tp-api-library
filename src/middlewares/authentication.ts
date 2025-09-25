import * as express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { rolePermissions, permissionMatches} from "../config/permissions";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "jwt") {
        const token = request.headers["authorization"];

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));
            } else {

            jwt.verify(token, "your_secret_key", 
                function(erreur, decoded) {
                    if(erreur){
                        reject(new Error("Invalid token"));
                    }
                    const payload = decoded as JwtPayload & { role?: string; username?: string };
                    const role = payload.role || "utilisateur";
                    const permissions: string[] = rolePermissions[role] || [];

                    if(!scopes || scopes.length === 0) {
                        (request as any).user = decoded;
                        return resolve(decoded);
                    }

                    for(const scope of scopes) {
                        const ok = permissions.some(p => permissionMatches(p, scope));
                        if(!ok) {
                            return reject(new Error("Insufficient permissions"));
                        }
                    }

                    (request as any).user = decoded;
                    resolve(decoded);
                }

                );
            }
        });
    } else {
        throw new Error("Only support JWT authentication");
    }
}

