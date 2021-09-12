const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
const uuid = require('node-uuid');
const credentials = new AWS.SharedIniFileCredentials({ profile: 'b2' });
AWS.config.credentials = credentials;






class helperFunction {

    authTokenGenerate(email, userId) {
        return jwt.sign({ email: email, userId: userId },
            `z+mms^s12#masd1`, { expiresIn: '24h' }
        );
    }

    hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }

    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }

    async uploadFile() {

        const ep = new AWS.Endpoint('s3.us-west-002.backblazeb2.com');

        const s3 = new AWS.S3({
            endpoint: ep,
            // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            accessKeyId: "0028c287547a0d10000000004",
            secretAccessKey: "K002GZ4dpAkN1GMiGL3X+9LVZfpzcnM",
            region: 'us-west-002'
        });


        const bucketName = 'mediumForApp';
        const keyName = 'hello_world.txt'

        s3.createBucket({ Bucket: bucketName }, function () {
            var params = { Bucket: bucketName, Key: keyName, Body: 'Hello World!', ACL: "public-read" };

            s3.putObject(params, function (err, data) {
                console.log(data);
                if (err)
                    console.log(err)
                else
                    console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
            });
        });

    }


}

module.exports = helperFunction



