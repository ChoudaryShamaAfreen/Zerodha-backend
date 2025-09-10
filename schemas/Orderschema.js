const {Schema}=require("mongoose");

const Orderschema=new Schema({
name: String,
    qty:Number,
    price:String,
    mode:String,
});

module.exports={Orderschema};