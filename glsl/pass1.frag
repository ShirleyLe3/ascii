#define MAP3(f, v) vec3(f(v.x), f(v.y), f(v.z))
#define RGB(x) mix(x/12.92, pow((x+.055)/1.055, 2.4), step(.04045, x))
#define LUM(x) dot(x, vec3(.2126, .7152, .0722))

precision highp float;

uniform sampler2D uSrc;
uniform float uGamma;
uniform float uSignal;
uniform float uNoise;
uniform float uRandom;
in vec2 vPosition;
out vec4 vFragColor;

// Hash without Sine by Dave Hoskins
// https://www.shadertoy.com/view/4djSRW
float hash13(vec3 p3) {
  p3  = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec3 srgb = texture(uSrc, vPosition).rgb;
  float s = pow(LUM(MAP3(RGB, srgb)), uGamma);
  float n = hash13(vec3(gl_FragCoord.xy, 1000.*uRandom)) - 0.5;
  vFragColor = vec4(vec3(clamp(uSignal*s + uNoise*n, 0., 1.)), 0.);
}
