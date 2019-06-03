import './home.html';

import '../../components/header.js';
import '../../components/upload.js';
import '../../components/photogrid.js';
import '../../components/footer.js';

import {
  ImageData,
  ImageDataSchema
} from '/imports/api/imagedata';


Template.App_home.onCreated(function onCreated() {

  this.subscribe('ImageData');

});