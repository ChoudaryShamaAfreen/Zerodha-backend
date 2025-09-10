const {model}=require("mongoose");
 const {Orderschema}=require("../schemas/Orderschema");

const Ordermodel=new model("order",Orderschema);
module.exports={Ordermodel};
