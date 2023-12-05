const nameRegExp =
  /^[a-zA-Zа-щьюяґєіїА-ЩЬЮЯҐЄІЇ]+(([' \\-][a-zA-Zа-щьюяґєіїА-ЩЬЮЯҐЄІЇ ])?[a-zA-Zа-щьюяґєіїА-ЩЬЮЯҐЄІЇ]*)*$/;
const emailRegExp =
  /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
const phoneRegExp = /^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$/;

export default {
  nameRegExp,
  emailRegExp,
  phoneRegExp,
};