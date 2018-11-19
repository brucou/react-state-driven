const linksForCatheter = [
  "https://www.flickr.com/photos/155010203@N06/31741086078/",
  "https://www.flickr.com/photos/159915559@N02/30547921577/",
  "https://www.flickr.com/photos/155010203@N06/44160499005/",
  "https://www.flickr.com/photos/139230693@N02/28991566557/"
];
const imgSrcForCathether = [
  "https://farm2.staticflickr.com/1928/31741086078_8757b4913d_m.jpg",
  "https://farm2.staticflickr.com/1978/30547921577_f8cbee76f1_m.jpg",
  "https://farm2.staticflickr.com/1939/44160499005_7c34c4326d_m.jpg",
  "https://farm2.staticflickr.com/1833/42224900930_360debd33e_m.jpg"
];
const resultSearchForCathether = [0, 1, 2, 3].map(index => ({
  link: linksForCatheter[index],
  media: { m: imgSrcForCathether[index] }
}));
const linksForCat = [
  "https://www.flickr.com/photos/155010203@N06/31741086079/",
  "https://www.flickr.com/photos/159915559@N02/30547921579/",
  "https://www.flickr.com/photos/155010203@N06/44160499009/",
  "https://www.flickr.com/photos/139230693@N02/28991566559/"
];
const imgSrcForCat = [
  "https://farm2.staticflickr.com/1811/28991566557_7373bf3b87_m.jpg",
  "https://farm1.staticflickr.com/838/43264055412_0758887829_m.jpg",
  "https://farm2.staticflickr.com/1760/28041185847_16008b600a_m.jpg",
  "https://farm2.staticflickr.com/1744/41656558545_d4e0eec5d3_m.jpg"
];
const resultSearchForCat = [0, 1, 2, 3].map(index => ({
  link: linksForCat[index],
  media: { m: imgSrcForCat[index] }
}));
export const searchFixtures = {
  "cathether": resultSearchForCathether,
  "cat": resultSearchForCat
};
