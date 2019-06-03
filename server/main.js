const crypto = require('crypto');

// Server entry point, imports all server code
var cloudinary = require('cloudinary').v2;

// set your env variable CLOUDINARY_URL or set the following configuration
cloudinary.config({
    cloud_name: Meteor.settings.public.cloudinary.cloud_name,
    api_key: Meteor.settings.private.cloudinary.api_key,
    api_secret: Meteor.settings.private.cloudinary.api_secret,
});

import '/imports/startup/server';
import '/imports/startup/both';

import {
    ImageData
} from '/imports/api/imagedata';

ImageData.allow({
    'insert': function (userId, doc) {
        return true;
    }
});

Meteor.methods({

    deleteImage: function (element) {

        if (element) {

            cloudinary.uploader.destroy(element,
                function (error, result) {

                    console.log(result, error)
                });


        }
    },

    checkDeletePwd: function (id, pwd) {

        let image = ImageData.findOne({
            _id: id
        });

        if (image && image.pwd === crypto.createHash('sha256').update(pwd).digest('hex')) {
            return true;
        } else {
            return false;
        }
    },

    deleteImageAfterPwdCheck: function (id, pwd) {

        let image = ImageData.findOne({
            _id: id
        });

        if (image && image.pwd === crypto.createHash('sha256').update(pwd).digest('hex')) {

            const bound = Meteor.bindEnvironment((callback) => {
                callback();
            });

            cloudinary.uploader.destroy(image.publicId,

                function (error, result) {
                    bound(() => {
                        if (error) {
                            return false;
                        } else {
                            ImageData.remove({
                                _id: id
                            });
                            return true;
                        }
                    })
                })
        } else {
            return false;
        }
    },

    sendEmail: function (from) {

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();
    
        Email.send({
          to: "admin@dietmar.rocks",
          from: "admin@dietmar.rocks",
          subject: "[DIDI70] New DietmarMemo",
          text: buildEmailText(from),
        });
      }
})

function buildEmailText(from) {
    return "Neues Dietmar-Memo erhalten von" + from + ".";
}