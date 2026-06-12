import { Router } from 'express';
import { CitiesController } from '../controllers/cities.controller';

const router = Router();

router.get('/', CitiesController.getCities);

export default router;
