import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/* eslint-disable object-shorthand */

export const ImageData = new Mongo.Collection('ImageData');

/**
 * Create the schema for ImageData
 */
ImageData.schema = new SimpleSchema({
  name: {
    label: 'name',
    type: String,
  },
  email: {
    label: 'email',
    type: String,
  },
  title: {
    label: 'title',
    type: String,
  },
  msg: {
    label: 'msg',
    type: String,
  },
  url: {
    label: 'url',
    type: String,
  },
  thumbnail: {
    label: 'thumbnail',
    type: String,
  },
}, { tracker: Tracker });
