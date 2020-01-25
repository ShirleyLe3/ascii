#define U ${ width }
#define V ${ height }
#define X ${ width * height }
#define Y ${ chars }

#define Inf exp(1000.)
#define Block float[X]
#define CharCode uint

precision highp float;

uniform sampler2D uSrc;
uniform sampler2D uLUT;
uniform CharCode uCharMap[Y];
in vec2 vPosition;
out CharCode Result;

Block read() {
  vec2 center = vec2(textureSize(uSrc, 0))*vPosition;
  ivec2 topLeft = ivec2(center + .25) - ivec2(U, V)/2;
  Block src;

  for (int v = 0; v < V; v++)
    for (int u = 0; u < U; u++)
      src[U*v + u] = texelFetch(uSrc, topLeft + ivec2(u, v), 0).r;

  return src;
}

CharCode closest(Block src) {
  struct Pair { int index; float diff; };
  Pair closest = Pair(0, Inf);

  for (int y = 0; y < Y; y++) {
    float diff = 0.;

    for (int x = 0; x < X; x++)
      diff += abs(src[x] - texelFetch(uLUT, ivec2(x, y), 0).r);

    if (closest.diff > diff)
      closest = Pair(y, diff);
  }

  return uCharMap[closest.index];
}

void main() {
  Result = closest(read());
}
