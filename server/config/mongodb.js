import mongoose from 'mongoose'

const connectDB = async () => {
    // ehen ever your connection with the database happens successfully 
    mongoose.connection.on('connected', () => {
        console.log('Database Connected');
    })
    await mongoose.connect(`${process.env.MONGODB_URL}`);
}

export default connectDB; 