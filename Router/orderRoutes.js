//product order router

const express =require('express');
const router=express.Router();
const { createOrder, orderView, orderSingleView, orderUpdate, orderDelete } =require('../Controllers/orderController');

router.post('/createorder',createOrder);
router.get('/orderview',orderView);
router.get('/orderview/:id',orderSingleView);
router.put('/orderupdates/:id',orderUpdate);
router.delete('/orderdelete/:id',orderDelete);

module.exports=router;