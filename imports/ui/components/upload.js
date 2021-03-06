const crypto = require('crypto');

import './upload.html';

import {
    ImageData,
    ImageDataSchema
} from '/imports/api/imagedata';

Template.upload.events({

    'click #memoButton'(event, instance) {
        event.preventDefault();

        $("#addBtnArea").slideUp(1000, function () {
            $("#id01").slideDown(1000);
        });
    },

    'keyup input'(event) {
        event.preventDefault();
        validateInput();
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
                max_image_width: '1024',
                max_image_height: '1024',
                min_image_width: '512',
                min_image_height: '512',
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
                debugger;
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
                publicId: Session.get('public_id'),
                createdAt: new Date(),
            }, function (error, result) {
                if (error) console.log(error); //info about what went wrong
                if (result) {

                    $("#id01").slideUp(1000, function () {
                        $("#addBtnArea").slideDown(1000);
                    });

                    deleteUploadIputFields();

                    Meteor.call('sendEmail', htmlEscape($('#name').val()));
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

    'click .closeMemo': function click(event) {

        event.preventDefault();

        $("#id01").slideUp(1000, function () {
            $("#addBtnArea").slideDown(1000);
        });

        deleteUploadIputFields();

        window.scrollTo(0, 0);

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

    let isValid = true;

    if ($("#name").val().length == 0 || $("#name").val().length > 30) {
        $("#nameLabel").removeClass("textMainColorGreen").addClass("textMainColorRed");
        isValid = false;
    } else {
        $("#nameLabel").removeClass("textMainColorRed").addClass("textMainColorGreen");
    };

    if ($("#email").val().length > 30) {
        $("#emailLabel").removeClass("textMainColorGreen").addClass("textMainColorRed");
        isValid = false;
    } else {
        $("#emailLabel").removeClass("textMainColorRed").addClass("textMainColorGreen");
    };

    if ($("#pwd").val().length == 0 || $("#pwd").val().length > 30) {
        $("#pwdLabel").removeClass("textMainColorGreen").addClass("textMainColorRed");
        isValid = false;
    } else {
        $("#pwdLabel").removeClass("textMainColorRed").addClass("textMainColorGreen");
    };

    if ($("#title").val().length == 0 || $("#title").val().length > 30) {
        $("#titleLabel").removeClass("textMainColorGreen").addClass("textMainColorRed");
        isValid = false;
    } else {
        $("#titleLabel").removeClass("textMainColorRed").addClass("textMainColorGreen");
    };

    if ($("#msg").val().length > 200) {
        $("#msgLabel").removeClass("textMainColorGreen").addClass("textMainColorRed");
        isValid = false;
    } else {
        $("#msgLabel").removeClass("textMainColorRed").addClass("textMainColorGreen");
    };
    if ($("#cloudinaryFileName").val().length == 0 || $("#cloudinaryFileName").val().length > 100) {
        $("#cloudinary-upload-widget").removeClass("okayButton").addClass("redButton");
        isValid = false;
    } else {
        $("#cloudinary-upload-widget").removeClass("redButton").addClass("okayButton");
    };

    if (isValid) {
        $("#addMemo").removeClass("disabledButton").addClass("okayButton");
    } else {
        $("#addMemo").removeClass("okayButton").addClass("disabledButton");
    }

    return isValid;
}

function deleteUploadIputFields(){
     $.each($("#id01").find('input'), function (index, value) {
        $(value).val("");
    });
    $("#thumbnail").attr("src", "/img/avatar.jpg").show();
}

function htmlEscape(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}