"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const db_1 = __importDefault(require("../models/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, type, password } = req.body;
    // Validation
    if (type !== 'customer' && type !== 'admin') {
        return res.status(400).json({ message: 'Invalid user type' });
    }
    // Hash password
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        const result = yield db_1.default.query('INSERT INTO users (name, email, type, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email', [name, email, type, hashedPassword]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === '23505') {
                // handle specific error code
            }
        }
    }
});
exports.createUser = createUser;
