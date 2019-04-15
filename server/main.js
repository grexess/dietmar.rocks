// Server entry point, imports all server code
var cloudinary = require('cloudinary').v2;

// set your env variable CLOUDINARY_URL or set the following configuration
cloudinary.config({
  cloud_name: Meteor.settings.public.cloudinary.cloud_name,
  api_key:  Meteor.settings.private.cloudinary.api_key,
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

        if(element){

            console.log("elem: " + element);

            cloudinary.uploader.destroy(element, 
            function(error, result) {
                //console.log(result, error) 
            });

        return "deleted";
    }
}})