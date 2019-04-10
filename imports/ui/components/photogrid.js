import './photogrid.html';

import {
    ImageData,
    ImageDataSchema
} from '/imports/api/imagedata';

Template.photogrid.helpers({

    memoriesCol1() {
        var images = ImageData.find({}).fetch();
        return images.filter((_, i) => i % 3 == 0);
    },
    memoriesCol2() {
        var images = ImageData.find({}).fetch();
        const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
        every_nth(images, 2)
    },
    memoriesCol3() {
        var images = ImageData.find({}).fetch();
        return images.filter((_, i) => i % 5 == 0);
    }

});