const crypto = require('crypto');

import './upload.html';

import {
    ImageData,
    ImageDataSchema
} from '/imports/api/imagedata';

Template.upload.events({

    'click .memoButton'(event, instance) {
        event.preventDefault();

        $("#addBtnArea").slideUp(1000, function () {
            $("#id01").slideDown(1000);
        });
    },

    'keyup input'(event) {
        event.preventDefault();

        if (validateInput()) {
            $("#addMemo").removeClass("w3-disabled");
        } else {
            $("#addMemo").addClass("w3-disabled");
        }
    },

    'click #cloudinary-upload-widget': function click(event) {
        event.preventDefault();


        if (Session.get('public_id')) {
            Meteor.call('deleteImage', Session.get('public_id'), function (err, res) {
                if (err) console.error(err);
                else console.log(res);
            });
        }

        cloudinary.openUploadWidget({
                cloud_name: Meteor.settings.public.cloudinary.cloud_name,
                upload_preset: Meteor.settings.public.cloudinary.upload_preset,
                sources: ['local', 'url'],
                cropping: true,
                //cropping_aspect_ratio: 1,
                croppingShowBackButton: true,
                max_file_size: '5000000',
                max_image_width: '2048',
                max_image_height: '2048',
                min_image_width: '600',
                min_image_height: '600',
                folder: 'dietmar',
                croppingValidateDimensions: false
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
                const public_id = result[0].public_id;
                const url = result[0].url;

                Session.set({
                    url: url,
                    thumbnail: thumbnail,
                    public_id: public_id
                });

                $("input[name='cloudinaryFileName']").val(fileName);
                $("#thumbnail").attr("src", url).show();
                validateInput();
            });
    },

    'click #addMemo': function click(event) {
        event.preventDefault();

        var isValid = validateInput();

        if (isValid) {
            ImageData.insert({
                name: htmlEscape($('#name').val()),
                email: htmlEscape($('#email').val()),
                title: htmlEscape($('#title').val()),
                msg: htmlEscape($('#msg').val()),
                pwd: crypto.createHash('sha256').update($('#pwd').val()).digest('hex'),
                url: Session.get('url'),
                thumbnail: Session.get('thumbnail'),
                createdAt: new Date(),
            }, function (error, result) {
                if (error) console.log(error); //info about what went wrong
                if (result) {

                    $("#id01").slideUp(1000, function () {
                        $("#addBtnArea").slideDown(1000);
                    });
                };
            });
        } else {
            Bert.alert({
                title: 'Fehler',
                message: 'Eingabe überprüfen',
                type: 'danger',
                style: 'growl-top-right',
                icon: 'fas  fa-flash'
            });

        }


        /* TODO
         - send email
          */


    },

    'click .closeModal': function click(event) {

        event.preventDefault();

        $("#id01").slideUp(1000, function () {
            $("#addBtnArea").slideDown(1000);
        });

        if (Session.get('public_id')) {
            Meteor.call('deleteImage', Session.get('public_id'), function (err, res) {
                if (err) console.error(err);
                else console.log(res);
            });
        }
        Session.set('url', undefined);
        delete Session.keys.url;
        Session.set('thumbnail', undefined);
        delete Session.keys.thumbnail;
        Session.set('public_id', undefined);
        delete Session.keys.public_id;
    }

});

function validateInput() {
    if ($("#name").val().length == 0 || $("#name").val().length > 30) return false;
    if ($("#email").val().length > 30) return false;
    if ($("#name").val().length > 30) return false;
    if ($("#title").val().length == 0 || $("#title").val().length > 30) return false;
    if ($("#msg").val().length > 200) return false;
    if ($("#cloudinaryFileName").val().length == 0 && $("#cloudinaryFileName").val().length > 100) return false;
    if ($("#pwd").val().length == 0 || $("#pwd").val().length > 30) return false;
    return true;
}

function htmlEscape(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}