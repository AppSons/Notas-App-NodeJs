const mongoose = require('mongoose');


//Y4RvC3DYhDXK3GWY
//Notes_App
const dbConnection = async() => {
  try {
    await mongoose.connect('mongodb+srv://Notes_App:Y4RvC3DYhDXK3GWY@cluster0.q3ing.mongodb.net/Notes_App',{
     
      
    });

    console.log('DB online');

  } catch (error) {
    console.log(error);
    throw new Error('Error al iniciar la BD');
  }
}

module.exports = {
  dbConnection
}