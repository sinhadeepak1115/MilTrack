"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const requireAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== "ADMIN") {
        res.status(403).json({ error: "Access denied: Admins only" });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
