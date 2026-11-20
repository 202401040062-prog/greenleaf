const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const DATA = path.join(__dirname, 'data');
const PLANTS = path.join(DATA, 'plants.json');
const ORDERS = path.join(DATA, 'orders.json');
app.use(express.json({limit:'100kb'}));
app.use(express.static(path.join(__dirname, 'public')));
function read(file){ return JSON.parse(fs.readFileSync(file,'utf8')); }
function write(file,value){ fs.writeFileSync(file, JSON.stringify(value,null,2)); }
app.get('/api/health',(req,res)=>res.json({success:true,message:'GreenLeaf API is running'}));
app.get('/api/plants',(req,res)=>{
 const q=String(req.query.search||'').trim().toLowerCase(), c=String(req.query.category||'All');
 const all=read(PLANTS); const result=all.filter(p=>(p.name+' '+p.description+' '+p.category).toLowerCase().includes(q)&&(c==='All'||p.category===c));
 res.json({success:true,count:result.length,data:result});
});
app.get('/api/plants/:id',(req,res)=>{const p=read(PLANTS).find(x=>x.id===req.params.id); if(!p)return res.status(404).json({success:false,message:'Plant not found'});res.json({success:true,data:p});});
app.post('/api/orders',(req,res)=>{
 const {customer,items}=req.body||{};
 if(!customer||!customer.name||!customer.email||!/^\S+@\S+\.\S+$/.test(customer.email)||!/^\d{10}$/.test(customer.phone||'')||!customer.address||!customer.city||!Array.isArray(items)||!items.length) return res.status(400).json({success:false,message:'Please provide valid customer and order details.'});
 const plants=read(PLANTS), orders=read(ORDERS), lines=[]; let total=0;
 for(const item of items){const p=plants.find(x=>x.id===item.id),qty=Number(item.quantity);if(!p||!Number.isInteger(qty)||qty<1||qty>p.stock)return res.status(400).json({success:false,message:`${p?p.name:'A selected plant'} is unavailable in the requested quantity.`});lines.push({id:p.id,name:p.name,price:p.price,quantity:qty});total+=p.price*qty;}
 for(const line of lines){const p=plants.find(x=>x.id===line.id);p.stock-=line.quantity;} write(PLANTS,plants);
 const order={id:crypto.randomUUID(),orderNumber:'GL'+Date.now().toString().slice(-8),customer:{name:String(customer.name).trim(),email:String(customer.email).trim().toLowerCase(),phone:customer.phone,address:String(customer.address).trim(),city:String(customer.city).trim()},items:lines,total,status:'Confirmed',createdAt:new Date().toISOString()};
 orders.unshift(order);write(ORDERS,orders);res.status(201).json({success:true,message:'Your order has been placed!',data:order});
});
app.get('/api/orders',(req,res)=>{const email=String(req.query.email||'').trim().toLowerCase();if(!email)return res.status(400).json({success:false,message:'Email is required'});const data=read(ORDERS).filter(o=>o.customer.email===email);res.json({success:true,data});});
app.use('/api',(req,res)=>res.status(404).json({success:false,message:'API endpoint not found'}));
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({success:false,message:'Unexpected server error'});});
const PORT=process.env.PORT||3000;app.listen(PORT,()=>console.log(`GreenLeaf Nursery running at http://localhost:${PORT}`));
