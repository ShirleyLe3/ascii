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

float lum(in vec3 c) {
  return dot(c, vec3(.2126, .7152, .0722));
}

float rgb(in float c) {
  return mix(c/12.92, pow((c + .055)/1.055, 2.4), step(.04045, c));
}

vec3 rgb(in vec3 c) {
  return vec3(rgb(c.r), rgb(c.g), rgb(c.b));
}

float[X] read() {
  vec2 middle = vec2(textureSize(uSrc, 0))*vPosition;
  ivec2 topLeft = ivec2(middle) - ivec2(U, V)/2;
  float buf[X];

  for (int v = 0; v < V; v++) {
    for (int u = 0; u < U; u++) {
      ivec2 xy = topLeft + ivec2(u, v);
      float s = pow(lum(rgb(texelFetch(uSrc, xy, 0).rgb)), uGamma);
      float n = hash13(vec3(vec2(xy), uRandom)) - .5;
      buf[u + v*U] = uBrightness*s + uNoise*n;
    }
  }

  return buf;
}

int closest(in float[X] buf) {
  int closestIndex = 0;
  float closestValue = float(X);

  for (int y = 0; y < Y; y++) {
    float acc = 0.;

    for (int x = 0; x < X; x++) {
      vec4 t = texelFetch(uLUT, ivec2(x, y), 0);
      acc += abs(buf[x] - t.r);
    }

    if (closestValue > acc) {
      closestIndex = y;
      closestValue = acc;
    }
  }

  return uCharMap[closestIndex];
}

void main() {
  vFragColor = vec4(closest(read()), 0, 0, 0);
}
