"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const material_1 = require("@mui/material");
function LoginPage() {
    const [username, setUsername] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [success, setSuccess] = (0, react_1.useState)("");
    const [isRegister, setIsRegister] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const handleLogin = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const res = yield fetch("http://localhost:3000/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok)
                throw new Error("Invalid credentials");
            const data = yield res.json();
            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        }
        catch (err) {
            setError(err.message || "Login failed");
        }
    });
    const handleRegister = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const res = yield fetch("http://localhost:3000/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                const data = yield res.json().catch(() => ({}));
                throw new Error(data.message || "Registration failed");
            }
            setSuccess("Registration successful! Please login.");
            setIsRegister(false);
            setUsername("");
            setPassword("");
            setConfirmPassword("");
        }
        catch (err) {
            setError(err.message || "Registration failed");
        }
    });
    return (<material_1.Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <material_1.Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <material_1.Typography variant="h5" mb={2} align="center">
          {isRegister ? "Register" : "Admin Login"}
        </material_1.Typography>
        {error && (<material_1.Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </material_1.Alert>)}
        {success && (<material_1.Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </material_1.Alert>)}
        {isRegister ? (<form onSubmit={handleRegister}>
            <material_1.TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" required/>
            <material_1.TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required/>
            <material_1.TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth margin="normal" required/>
            <material_1.Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Register
            </material_1.Button>
            <material_1.Button variant="text" fullWidth sx={{ mt: 1 }} onClick={() => {
                setIsRegister(false);
                setError("");
                setSuccess("");
            }}>
              Already have an account? Login
            </material_1.Button>
          </form>) : (<form onSubmit={handleLogin}>
            <material_1.TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" required/>
            <material_1.TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required/>
            <material_1.Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </material_1.Button>
            <material_1.Button variant="text" fullWidth sx={{ mt: 1 }} onClick={() => {
                setIsRegister(true);
                setError("");
                setSuccess("");
                setConfirmPassword("");
            }}>
              New user? Register
            </material_1.Button>
          </form>)}
      </material_1.Paper>
    </material_1.Box>);
}
