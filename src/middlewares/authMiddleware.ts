// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// export default authMiddleware;




// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any; // or a specific type if you have one
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Now TypeScript recognizes this
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

export default authMiddleware;
