const {model}=require("mongoose");

const {Holdingschema}=require("../schemas/Holdingschema");

const Holdingsmodel=new model("holding",Holdingschema);
module.exports={Holdingsmodel};