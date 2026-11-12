import sharp from 'sharp';
import {resolve} from 'node:path';
const source=resolve('design/web_ana_sayfa_tasarim_referansi.png');
const out=resolve('public/images/home');
// Photographic regions only: no navigation, headings, prices or buttons.
// The homepage hero uses the supplied luqa-hero-original.png unchanged; never generate it here.
const crops={
 'box-detail':{left:27,top:574,width:182,height:134},
 'q-detail':{left:417,top:574,width:170,height:134},
 'floral-detail':{left:787,top:574,width:166,height:134},
 'interior-detail':{left:1163,top:574,width:173,height:134},
 'heritage-card':{left:36,top:790,width:251,height:144},
 'blossom-card':{left:306,top:790,width:232,height:144},
 'ivory-card':{left:556,top:790,width:221,height:144},
 'garden-card':{left:794,top:790,width:227,height:144},
 'story-flowers':{left:1410,top:782,width:126,height:242}
};
await Promise.all(Object.entries(crops).map(([name,rect])=>sharp(source).extract(rect).webp({quality:98,effort:6}).toFile(`${out}/${name}.webp`)));
console.log(`${Object.keys(crops).length} independent photo crops prepared at their native resolution; no upscaling.`);
