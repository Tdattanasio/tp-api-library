export const rolePermissions: Record<string, string[]> = {
    admin: [
        "author:read","author:create","author:update","author:delete",
        "book:read","book:create","book:update","book:delete",
        "bookCopy:read","bookCopy:create","bookCopy:update","bookCopy:delete"
    ],
    gerant: [
        "author:read","author:create","author:update",
        "book:read","book:create","book:update",
        "bookCopy:read","bookCopy:create","bookCopy:update","bookCopy:delete"
    ],
    utilisateur: [
        "author:read",
        "book:read","book:create",
        "bookCopy:read"
    ]
};

export function permissionMatches(permissionPattern: string, scope: string): boolean {
    if (permissionPattern === scope) {
        return true;
    }
    const [pRes, pAct] = permissionPattern.split(":");
    const [sRes, sAct] = scope.split(":");
    let res:boolean;
    if((pRes === "*" || pRes === sRes) && (pAct === "*" || pAct === sAct)){
        res = true;
    }else{
        res = false;
    }
    return res;
}
