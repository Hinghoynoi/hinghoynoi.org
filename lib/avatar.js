import { md5 } from "~/lib/md5.js";

export function getGravatarUrl(email) {
  let profile = [
    "HinghoyNoy_Blue-1-300x300.png",
    "HinghoyNoy_Choco-300x300.png",
    "HinghoyNoy_Green-300x300.png",
    "HinghoyNoy_Orange-1-300x300.png",
    "HinghoyNoy_Purple-2-300x300.png",
    "HinghoyNoy_Rainbow-1-300x300.png",
    "HinghoyNoy_Red-1-300x300.png",
    "HinghoyNoy_Smile-300x294.png",
    "HinghoyNoy_Writer-300x300.png",
  ];

  let randomProfile =
    "https://r2.tinarskii.com/" +
    profile[Math.floor(Math.random() * profile.length)];
  return `https://www.gravatar.com/avatar/${md5(email?.trim()?.toLowerCase())}?s=200&d=${encodeURIComponent(randomProfile)}`;
}
