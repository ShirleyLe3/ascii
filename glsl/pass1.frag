#define MAP3(fn, v3) vec3(fn(v3.x), fn(v3.y), fn(v3.z))
#define RGB(v1) mix(v1/12.92, pow((v1+.055)/1.055, 2.4), step(.04045, v1))
#define LUM(v3) dot(MAP3(RGB, v3), vec3(.2126, .7152, .0722))

precision highp float;

uniform sampler2D uSrc;
uniform float uGamma;
uniform float uSignal;
uniform float uNoise;
uniform float uRandom;
in vec2 vPosition;
out float vOutput;

// Hash without Sine by Dave Hoskins
// https://www.shadertoy.com/view/4djSRW
float hash13(vec3 p3) {
  p3 = fract(p3 * 1031.);
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec4 t = texture(uSrc, vPosition);
  float s = pow(LUM(t), uGamma);
  float n = hash13(vec3(vPosition, uRandom)) - 0.5;
  vOutput = uSignal*s + uNoise*n;
}
