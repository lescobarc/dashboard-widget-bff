import express from 'express';
import { getDashboardWidget } from '../controllers/dashboardWidget.controller.js';
const router = express.Router();

router.get('/dashboard-widget', getDashboardWidget);

export default router;
