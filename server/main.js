// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';

import { ImageData } from '/imports/api/imagedata';

ImageData.allow({
    'insert': function (userId, doc) {
        return true;
    }
});