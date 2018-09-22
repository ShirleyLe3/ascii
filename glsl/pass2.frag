#define TEX(s,size,uv,xy) texture2D(s,uv+(xy+.5)/size)
#define MOD(x,y) (x-(x/y*y))

#define false 0
#define true 1
#define O #{0.settings.optimized}
#define U #{0.settings.lutWidth}
#define V #{0.settings.lutHeight}
#define X #{0.luts.0.length}
#define Y #{0.luts.length}

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

  float deltas[Y]; // trading memory for speed

  for (int x = 0; x < X; x++) {
    int u = MOD(x, U), v = x/U;
    float a = TEX(uSrc, uSrcSize, vPosition, vec2(u, v)).r;
    for (int y = 0; y < Y; y++) {
      float b = TEX(uLut, uLutSize, 0., vec2(x, y)).r;
      deltas[y] += abs(a - b);
    }
  }

  for (int y = 0; y < Y; y++) {
    float delta = deltas[y];
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
