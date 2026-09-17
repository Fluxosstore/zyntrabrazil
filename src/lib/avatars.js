export const ASTRONAUT_AVATARS = [
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/6a2944403_file_00000000e634820eb5324bbea01cd4002.jpg",
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ce619fd76_file_00000000e634820eb5324bbea01cd4003.jpg",
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/30afc9ca8_file_00000000e634820eb5324bbea01cd4004.jpg",
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/d96bfd425_file_00000000e634820eb5324bbea01cd4005.jpg",
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/0ce59961d_file_00000000e634820eb5324bbea01cd4006.jpg",
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/cc51f6e65_file_00000000e634820eb5324bbea01cd4007.jpg",
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/eb1c5bee2_file_00000000e634820eb5324bbea01cd4008.jpg",
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/f9c6de72a_file_00000000e634820eb5324bbea01cd4009.jpg",
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/6ca06aa2d_file_00000000e634820eb5324bbea01cd400.png",
];

export function getAvatarForUser(userId) {
  if (!userId) return ASTRONAUT_AVATARS[0];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  return ASTRONAUT_AVATARS[Math.abs(hash) % ASTRONAUT_AVATARS.length];
}