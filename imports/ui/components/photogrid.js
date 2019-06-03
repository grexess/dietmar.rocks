import './photogrid.html';

import {
    ImageData,
    ImageDataSchema
} from '/imports/api/imagedata';

Template.photogrid.onCreated(function () {

    Tracker.autorun(() => {

        let dbArray = ImageData.find({}).fetch();
        let images = shuffle(dbArray);
        Session.set("images", images);
      });

});

Template.photogrid.helpers({

    memoriesCol(cnt) {
        return getNthImages(cnt);
    },
    memoriesCol(cnt) {
        return getNthImages(cnt);
    },
    memoriesCol(cnt) {
        return getNthImages(cnt);
    },
    showDelBtn() {
        return Session.get('showDelBtn');
    }
});


Template.photogrid.events({

    'click .delBtn'(event) {
        event.preventDefault();
        let id = event.currentTarget.dataset.picdelbtn


        Meteor.call('checkDeletePwd', event.currentTarget.dataset.picdelbtn, $('*[data-pic="' + id + '"]').val(), function (err, res) {
            if (err) {
                console.error(err);
            } else {
                if (res) {
                    new Confirmation({
                        message: "Dietmar-Memo wirklich löschen?",
                        title: "Löschen",
                        cancelText: "Nein",
                        okText: "Weg damit!",
                        success: false, // whether the button should be green or red
                        focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
                    }, function (ok) {
                        if (ok) {
                            //delete image
                            Meteor.call('deleteImageAfterPwdCheck', event.currentTarget.dataset.picdelbtn, $('*[data-pic="' + id + '"]').val(), function (err, res) {});
                        } else {
                            return;
                        }
                    });
                } else {
                    Bert.alert({
                        title: 'Fehler',
                        message: 'Löschpasswort stimmt nicht!',
                        type: 'danger',
                        icon: 'fas  fa-flash'
                    });
                };
            }
        })
    },

    'click .figcaption>a'(event) {
        event.preventDefault();
    },

    'keyup .delPwd'(event) {
        event.preventDefault();
        if (event.currentTarget.value.length > 0) {
            $('*[data-picdelbtn="' + event.currentTarget.dataset.pic + '"]').removeClass("disabledButton").addClass("redButton");
        } else {
            $('*[data-picdelbtn="' + event.currentTarget.dataset.pic + '"]').removeClass("redButton").addClass("disabledButton");
        }
    }

})

function getNthImages(start) {

    //let images = ImageData.find({}).fetch();
    /*  let dbArray = ImageData.find({}).fetch();
     let images = shuffle(dbArray); */

    let images = Session.get("images");

    var aImages = [];
    while (start < images.length) {
        aImages.push(images[start]);
        start = start + 3;
    }
    return aImages;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
    return array;
}