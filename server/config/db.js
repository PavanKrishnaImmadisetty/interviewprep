import mongoose from 'mongoose'

const connectdb = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`connection success:${conn.connection.host}`)

    }catch(error){
        console.log(`connection failed:${error.message}`)
        process.exit(1)
    }
}

export default connectdb;