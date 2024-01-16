import express from 'express';
const router = express.Router();

import {
  listMerchants,
  addMerchant,
  updateMerchant,
  deleteMerchant,
  getMerchant,
  filterMerchants,
} from '../controllers/merchantController';

router.route('/').get(listMerchants);
router.route('/').post(addMerchant);
router.route('/:merchantId').put(updateMerchant);
router.route('/:merchantId').delete(deleteMerchant);
router.route('/:merchantId').get(getMerchant);
router.route('/filter').get(filterMerchants);

export default router;
