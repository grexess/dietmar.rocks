import './photogrid.html';

import {
    ImageData,
    ImageDataSchema
} from '/imports/api/imagedata';

Template.photogrid.helpers({

    memoriesCol1() {
        return getNthImages(0);
    },
    memoriesCol2() {
        return getNthImages(1);
    },
    memoriesCol3() {
        return getNthImages(2);
    },
    showDelBtn() {
        return Session.get('showDelBtn');
    }
});


Template.photogrid.events({

    'click .delBtn'(event) {
        event.preventDefault();
        alert(event.currentTarget);
    },

    'click .figcaption>a' (event) {
        event.preventDefault();
    },

})

function getNthImages(start) {
    var images = ImageData.find({}).fetch();
    var aImages = [];
    while (start < images.length) {
        aImages.push(images[start]);
        start = start + 3;
    }
    return aImages;
}