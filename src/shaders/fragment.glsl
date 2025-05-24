uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture;
varying vec2 vUv;

#include ./includes/perlin3dNoise.glsl

void main() {
  vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1));
  float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

  float radialGradient = distance(vUv, vec2(0.5)) * 12.5 - 7.0 * uProgress;
  strength += radialGradient;

  strength = clamp(strength, 0.0, 1.0);
  strength = 1.0 - strength;

  vec3 textureColor = texture2D(uTexture, vUv).rgb;

  float opacityProgress = smoothstep(0.0, 0.7, uProgress);
  gl_FragColor = vec4(textureColor, strength * opacityProgress);
}