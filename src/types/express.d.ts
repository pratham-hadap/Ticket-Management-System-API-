// import 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: any; // Replace `any` with your actual user type
//     }
//   }
// }




// src/types/express.d.ts
import { User } from '../models/user'; // Adjust the import based on your User model location

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add any additional properties as needed
    }
  }
}
