import express from 'express';
import cors from 'cors';
import dashboardWidgetRoutes from './routes/dashboardWidget.routes.js';
import ApiError from './utils/apiError.js';

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use('/api', dashboardWidgetRoutes);

// Manejo global de errores
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message, details: err.details });
  } else {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

export default app;
