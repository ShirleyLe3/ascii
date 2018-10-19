#define TEX(s,size,uv,xy) texture2D(s,(uv)+(xy)/(size))

#define O ${settings.optimized ? 1 : 0}
#define U ${settings.lutWidth}
#define V ${settings.lutHeight}
#define X ${luts[0].length}
#define Y ${luts.length}

precision mediump float;

uniform sampler2D uSrc;
uniform sampler2D uLut;
uniform vec2 uSrcSize;
uniform vec2 uLutSize;
varying vec2 vPosition;

const vec2 srcOffset = 0.5*(0.5 - vec2(U, V));
const vec2 lutOffset = vec2(0.5);

void main() {
  float bestDelta = float(X);
  int   bestChar  = 0;

#if O

  float src[X]; // trading memory for speed

  for (int v = 0; v < V; v++)
    for (int u = 0; u < U; u++)
      src[u + v*U] = TEX(uSrc, uSrcSize, vPosition, srcOffset + vec2(u, v)).r;

  for (int y = 0; y < Y; y++) {
    float delta = 0.;

    for (int x = 0; x < X; x++)
      delta += abs(
        src[x] -
        TEX(uLut, uLutSize, 0., lutOffset + vec2(x, y)).r
      );

    if (delta < bestDelta) {
      bestDelta = delta;
      bestChar  = y;
    }
  }

#else

  for (int y = 0; y < Y; y++) {
    int x = 0;
    float delta = 0.;

    for (int v = 0; v < V; v++)
      for (int u = 0; u < U; u++)
        delta += abs(
          TEX(uSrc, uSrcSize, vPosition, srcOffset + vec2(u, v)).r -
          TEX(uLut, uLutSize, 0., lutOffset + vec2(x++, y)).r
        );

    if (delta < bestDelta) {
      bestDelta = delta;
      bestChar  = y;
    }
  }

#endif

  gl_FragColor = vec4(bestChar, 0, 0, 0);
}
