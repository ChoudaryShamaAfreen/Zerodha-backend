const {model}=require("mongoose");
 const {Positionschema}=require("../schemas/Positionschema");

const Positionmodel=new model("position",Positionschema);
module.exports={Positionmodel};

