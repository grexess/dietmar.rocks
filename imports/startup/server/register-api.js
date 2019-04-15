// Register your apis here

import { ImageData } from '/imports/api/imagedata';

Meteor.publish('ImageData', function publishImageData() {
  return ImageData.find({}, {fields: {pwd: 0, email: 0}});
});