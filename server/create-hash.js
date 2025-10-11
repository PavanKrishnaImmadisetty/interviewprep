import bcrypt from 'bcryptjs';

const createHash = async () => {
    const newPassword = "Hello@123"; // 👈 Change this
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log("Your new hashed password is:");
    console.log(hashedPassword);
};

createHash();

