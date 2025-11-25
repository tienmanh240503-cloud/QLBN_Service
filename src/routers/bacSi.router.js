import express from 'express';
import { getAllBacSi, getBacSiById, updateBacSi } from '../controllers/bacSi.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getAllBacSi);
router.get('/:id_bac_si', getBacSiById);
router.put('/:id_bac_si', verify, updateBacSi);

export default router;
