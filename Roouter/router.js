import express from 'express';

import * as C from '../Controller/control.js';

const router= express.Router();

router.get('/User',C.handleGet);
router.get('/Api/User',C.handleGetApi);
router.get('/Api/User/:id',C.handleGetIdApi);
router.post('/Api/User',C.handlePostIdApi);
router.put('/Api/User/:id',C.handlePutIdApi);
router.patch('/Api/User/:id',C.handlePatchIdApi);
router.put('/Api/User/:id',C.handleDeleteIdApi);

export default router;