#define MAP3(f,v) vec3(f(v.x),f(v.y),f(v.z))
#define RGB(x) mix(x/12.92,pow((x+.055)/1.055,2.4),step(.04045,x))
#define LUM(x) dot(x,vec3(.212655,.715158,.072187))

precision mediump float;
uniform sampler2D uSrc;
uniform float uBrightness;
uniform float uGamma;
uniform float uNoise;
uniform float uTime;
varying vec2 vPosition;

float hash13(vec3 p3) {
  p3  = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec3 srgb = texture2D(uSrc, vPosition).rgb;
  float signal = uBrightness * pow(LUM(MAP3(RGB, srgb)), uGamma);
  float noise = uNoise * (hash13(vec3(gl_FragCoord.xy, uTime)) - 0.5);
  gl_FragColor = vec4(signal + noise, 0., 0., 0.);
}
