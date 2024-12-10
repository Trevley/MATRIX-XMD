const {leyian}=require("../Trevor/leyian")







adams({nomCom:"restart",categorie:"Mods",reaction:"📴"},async(dest,z,com)=>{


  
const{repondre,ms,dev,superUser}=com;

  if(!superUser)
  {
    return repondre("This command is only for my owner broo");
  }

  const {exec}=require("child_process")

    repondre("MATRIX-MD bot Restarting ⏳");

  exec("pm2 restart all");
  

  



})
