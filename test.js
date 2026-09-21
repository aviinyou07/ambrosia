const defaultImage = '/images/ethnic_lehenga_1789624855314.jpg';
const allImages = [
    defaultImage,
    '/images/ethnic_anarkali_1789624868513.jpg',
    '/images/ethnic_saree_1789624840596.jpg',
    '/images/ethnic_lehenga_1789624855314.jpg',
    '/images/ethnic_palazzo_suit_1789624892265.jpg',
    '/images/ethnic_sharara_1789624905126.jpg',
    '/images/ethnic_gown_1789624931377.jpg',
    '/images/ethnic_fusion_wear_1789624920412.jpg',
    '/images/ethnic_kurta_set_1789624822973.jpg',
    '/images/silk_kurta_1789621596703.jpg',
    '/images/coord_set_1789621584844.jpg',
  ].filter((v, i, a) => a.indexOf(v) === i);

const allProducts = Array.from({ length: 4 }).map((_, i) => {
    return allImages[i % allImages.length];
});
console.log(allProducts);
