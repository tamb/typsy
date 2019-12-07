export default function mixin(arrayOfMixins, obj) {
    arrayOfMixins.forEach(mixinObj => {
      Object.keys(mixinObj).forEach(key => {
        obj[key] = mixinObj[key];
      });
    });
    return obj;
  }