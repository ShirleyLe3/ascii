#define U ${ width }
#define V ${ height }
#define X ${ width * height }
#define Y ${ chars }

precision mediump float;

uniform sampler2D uSrc;
uniform sampler2D uLUT;
uniform float uBrightness;
uniform float uGamma;
uniform float uNoise;
uniform float uRandom;
uniform int uCharMap[Y];
in vec2 vPosition;
out vec4 vFragColor;

// Hash without Sine by Dave Hoskins
// https://www.shadertoy.com/view/4djSRW
float hash13(vec3 p3) {
  p3  = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.x + p3.y) * p3.z);
}

float lum(vec3 c) {
  return dot(c, vec3(.2126, .7152, .0722));
}

float rgb(float c) {
  return mix(c/12.92, pow((c + .055)/1.055, 2.4), step(.04045, c));
}

vec3 rgb(vec3 c) {
  return vec3(rgb(c.r), rgb(c.g), rgb(c.b));
}

struct Result {
  int index;
  float value;
};

void main() {
  Result res = Result(0, float(X));
  ivec2 pos = ivec2(vec2(textureSize(uSrc, 0))*vPosition) - ivec2(U, V)/2;
  float src[X];

  for (int v = 0; v < V; v++) {
    for (int u = 0; u < U; u++) {
      ivec2 xy = pos + ivec2(u, v);
      vec3 srgb = texelFetch(uSrc, xy, 0).rgb;
      float signal = uBrightness * pow(lum(rgb(srgb)), uGamma);
      float noise = uNoise * (hash13(vec3(vec2(xy), 1000.*uRandom)) - 0.5);
      src[u + v*U] = clamp(signal + noise, 0., 1.);
    }
  }

  for (int y = 0; y < Y; y++) {
    float value = 0.;

    for (int x = 0; x < X; x++)
      value += abs(src[x] - texelFetch(uLUT, ivec2(x, y), 0).r);

    if (res.value > value)
      res = Result(y, value);
  }

  vFragColor = vec4(uCharMap[res.index], 0, 0, 0);
}
