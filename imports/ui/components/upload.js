import './upload.html';

import {
    ImageData,
    ImageDataSchema
} from '/imports/api/imagedata';

Template.upload.events({

    'click #btnAddCard'(event, instance) {
        document.getElementById("id01").style.display = "block";
    },

    'click #cloudinary-upload-widget': function click(event) {
        event.preventDefault();
        cloudinary.openUploadWidget({
                cloud_name: Meteor.settings.public.cloudinary.cloud_name,
                upload_preset: Meteor.settings.public.cloudinary.upload_preset,
                sources: ['local', 'url'],
                cropping: 'server',
                cropping_aspect_ratio: 1,
                max_file_size: '5000000',
                max_image_width: '500',
                max_image_height: '500',
                min_image_width: '300',
                min_image_height: '300',
            },
            (error, result) => {
                if (error) {
                    console.log('Error during Cloudinary upload: ', error);
                    return;
                }
                // Otherwise get the form elements
                // console.log('Cloudinary results: ', result);
                const fileName = result[0].original_filename;
                const thumbnail = result[0].thumbnail_url;
                const url = result[0].url;

                Session.set({
                    url: url,
                    thumbnail: thumbnail
                });

                $("input[name='cloudinaryFileName']").val(fileName);

            });
    },

    'click #addMemo': function click(event) {
        event.preventDefault();

        ImageData.insert({
            name: htmlEscape($('#name').val()),
            email: htmlEscape($('#email').val()),
            title: htmlEscape($('#title').val()),
            msg: htmlEscape($('#msg').val()),
            url: Session.get('url'),
            thumbnail: Session.get('thumbnail'),
            createdAt: new Date(),
        }, function (error, result) {
            if (error) console.log(error); //info about what went wrong
            if (result) {
                document.getElementById('id01').style.display = 'none';
            };
        });

        /* TODO
          - store thumbnail and link in DB
         - store message & user & email
         - send email
          */


    },

    'click .closeModal': function click(event) {

        event.preventDefault();
        document.getElementById('id01').style.display = 'none';

        /* TODO
          //remove image from cloud
        */

        Session.set('url', undefined);
        delete Session.keys.url;
        Session.set('thumbnail', undefined);
        delete Session.keys.thumbnail;
    }

});

function htmlEscape(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}