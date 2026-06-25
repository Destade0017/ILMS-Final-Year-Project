import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from './models/User.js';
import { forgotPassword, resetPassword } from './controllers/authController.js';

const run = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const email = 'fayoseshadrach@gmail.com';
        const testUser = await User.findOne({ email }).select('+password');
        if (!testUser) {
            console.error('Test user fayoseshadrach@gmail.com not found. Seed first.');
            return;
        }

        const originalPasswordHash = testUser.password;
        console.log('Found user with email:', email);

        console.log('\n--- 1. Testing forgotPassword Controller ---');
        let resetToken = null;
        let responseData = null;

        // Mock Request and Response for forgotPassword
        const reqForgot = {
            body: { email }
        };

        const resForgot = {
            statusCode: 200,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(payload) {
                responseData = payload;
                return this;
            }
        };

        await forgotPassword(reqForgot, resForgot);

        console.log('Response code:', resForgot.statusCode);
        console.log('Response body:', responseData);

        if (resForgot.statusCode === 200 && responseData.success) {
            resetToken = responseData.data.resetToken;
            console.log('✅ PASS: forgotPassword successfully generated reset token:', resetToken);
        } else {
            console.log('❌ FAIL: forgotPassword failed');
            return;
        }

        // Verify that the hashed token is stored in the database
        const updatedUser = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpire');
        console.log('Hashed token in DB:', updatedUser.resetPasswordToken);
        console.log('Token expires at:', updatedUser.resetPasswordExpire);
        if (updatedUser.resetPasswordToken) {
            console.log('✅ PASS: Hashed token correctly saved to user document');
        } else {
            console.log('❌ FAIL: Hashed token not saved');
            return;
        }

        console.log('\n--- 2. Testing resetPassword Controller ---');
        const newPassword = 'studentnewpassword123';
        let resetResponseData = null;

        // Mock Request and Response for resetPassword
        const reqReset = {
            params: { resetToken },
            body: { password: newPassword }
        };

        const resReset = {
            statusCode: 200,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(payload) {
                resetResponseData = payload;
                return this;
            }
        };

        await resetPassword(reqReset, resReset);

        console.log('Response code:', resReset.statusCode);
        console.log('Response body:', resetResponseData);

        if (resReset.statusCode === 200 && resetResponseData.success) {
            console.log('✅ PASS: resetPassword successfully completed');
        } else {
            console.log('❌ FAIL: resetPassword failed');
            return;
        }

        // Verify that the password is changed and the token fields are cleared
        const finalUser = await User.findOne({ email }).select('+password +resetPasswordToken +resetPasswordExpire');
        console.log('Old Password Hash:', originalPasswordHash);
        console.log('New Password Hash:', finalUser.password);
        console.log('Cleared resetPasswordToken:', finalUser.resetPasswordToken);
        console.log('Cleared resetPasswordExpire:', finalUser.resetPasswordExpire);

        if (finalUser.password !== originalPasswordHash && !finalUser.resetPasswordToken) {
            console.log('✅ PASS: Password successfully updated in DB, and reset token cleared!');
        } else {
            console.log('❌ FAIL: Password state inconsistent');
        }

        // Reset the password back to the default 'password123' so seeder logins still work
        finalUser.password = 'password123';
        await finalUser.save();
        console.log('\nRestored student password back to "password123" for other tests.');

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

run();
