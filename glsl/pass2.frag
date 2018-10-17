#define TEX(s,size,uv,xy) texture2D(s,uv+(xy+.5)/size)
#define MOD(x,y) (x-(x/y*y))

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

void main() {
  float bestDelta = 3.402823e+38; // FLT_MAX
  int   bestChar  = 0;

#if O

  float src[X]; // trading memory for speed

  for (int v = 0; v < V; v++) {
    for (int u = 0; u < U; u++) {
      src[u + v*U] = TEX(uSrc, uSrcSize, vPosition, vec2(u, v)).r;
    }
  }

  for (int y = 0; y < Y; y++) {
    float delta = 0.;

    for (int x = 0; x < X; x++) {
      float a = src[x];
      float b = TEX(uLut, uLutSize, 0., vec2(x, y)).r;
      delta += abs(a - b);
    }

    if (delta < bestDelta) {
      bestDelta = delta;
      bestChar  = y;
    }
  }

#else

  for (int y = 0; y < Y; y++) {
    int x = 0;
    float delta = 0.;

    for (int v = 0; v < V; v++) {
      for (int u = 0; u < U; u++) {
        float a = TEX(uSrc, uSrcSize, vPosition, vec2(u, v)).r;
        float b = TEX(uLut, uLutSize, 0., vec2(x++, y)).r;
        delta += abs(a - b);
      }
    }

    if (delta < bestDelta) {
      bestDelta = delta;
      bestChar  = y;
    }
  }

#endif

  gl_FragColor = vec4(bestChar, 0, 0, 0) / 255.;
}
