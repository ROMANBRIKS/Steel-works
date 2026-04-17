/**
 * This file maps local folders to image lists.
 * Since we cannot dynamically scan the 'public' folder from the browser,
 * you should add the filenames of the images you upload to the respective folders here.
 * 
 * Example: If you upload 'banner1.jpg' to 'public/assets/images/banner/',
 * add 'banner1.jpg' to the 'banner' array below.
 */

export const LOCAL_IMAGES = {
  logo: ['file_00000000208471f7830a0ecb2eac0714.png'],
  banner: [
    '11f927f0-3870-11f1-b516-278f5b5733f9.png',
    '1776049004070.png',
    '256f9e80-340c-11f1-b8aa-555131ee0cd0.png',
    '3db7ed80-3871-11f1-b516-278f5b5733f9.png',
    '3ddb7b10-3871-11f1-b516-278f5b5733f9.png',
    '51709a00-3409-11f1-ac42-89e0609da5d7.png',
    '55ae58d0-340b-11f1-b8aa-555131ee0cd0.png',
    '5d157d10-340b-11f1-b8aa-555131ee0cd0.png',
    '6202eec0-340b-11f1-b8aa-555131ee0cd0.png',
    '70aec5b0-340c-11f1-b8aa-555131ee0cd0.png',
    '72bcc580-3409-11f1-ac42-89e0609da5d7.png',
    '7bb9c4a0-340c-11f1-b8aa-555131ee0cd0.png',
    '7c7a83f0-3409-11f1-ac42-89e0609da5d7 (1).png',
    '8b6d1d50-3409-11f1-ac42-89e0609da5d7.png',
    '91830970-3409-11f1-ac42-89e0609da5d7.png',
    'IMG_20260411_175739_258.png',
    'IMG_20260413_004340_314.png',
    'IMG_20260413_004417_935.png',
    'IMG_20260414_202141_191.png',
    'IMG_20260414_202241_656.png',
    'IMG_20260414_202333_734.png',
    'IMG_20260414_202410_211.png',
    'IMG_20260414_202454_731.png',
    'IMG_20260415_013803_962.png',
    'IMG_20260415_013839_205.png',
    'IMG_20260415_013903_246.png',
    'IMG_20260415_013941_538.png',
    'IMG_20260415_014023_194.png',
    'IMG_20260415_014044_476.png',
    'IMG_20260415_014222_985.png',
    'IMG_20260415_014303_658.png',
    'IMG_20260415_014338_933.png',
    'IMG_20260415_014750_372.png',
    'IMG_20260415_014819_138.png',
    'IMG_20260415_023946_838.png',
    'IMG_20260415_024016_041.png',
    'IMG_20260415_024101_315.png',
    'ec768170-340b-11f1-b8aa-555131ee0cd0.png',
    'file_000000003a1c71fd9876ad3a2ea4c95a.png',
    'file_000000003ddc720c9fa0843eec720775.png',
    'file_00000000507c71f5b619ada8728ee87b.png',
    'file_0000000060c471f8be491528e0d7adbb.png',
    'file_00000000813471fda1e9b72536ec920c.png',
    'file_000000009d4071fd9a59f0083b1590e6.png',
    'file_00000000c29c71fd977abc39e84b6cf3.png',
    'file_00000000d07871fda75c36373322dbb6.png'
  ],
  gates: [],
  'steel-structures': [],
  'underground-tanks': [],
  'surface-tanks': [],
  'filling-station-canopies': [],
  'billboard-frames': [],
  'bugler-proof': []
};

export const getLocalImagePath = (category: keyof typeof LOCAL_IMAGES, filename: string) => {
  return `/assets/images/${category}/${filename}`;
};
