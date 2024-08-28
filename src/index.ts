import express from 'express';
import pool from './models/db';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import ticketRoutes from './routes/ticketRoutes';
import ticketHistoryRoutes from './routes/ticketHistoryRoutes';
import ticketAnalyticsRoutes from './routes/ticketAnalyticsRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', ticketRoutes);
app.use('/api', ticketHistoryRoutes);
app.use('/api', ticketAnalyticsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/users', async (req, res) => {
    try {
      
      const result = await pool.query('SELECT * FROM users'); 
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).send('Server error');
    }
  });

app.get('/', (req,res)=>{
    res.send("Hello Pratham")
})
