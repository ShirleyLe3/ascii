#define U ${ width }
#define V ${ height }
#define X ${ width * height }
#define Y ${ chars }

precision mediump float;

uniform sampler2D uSrc;
uniform sampler2D uLUT;
uniform int uCharMap[Y];
in vec2 vPosition;
out vec4 vFragColor;

struct Result {
  int index;
  float value;
};

void main() {
  Result res = Result(0, float(X));
  ivec2 pos = ivec2(vec2(textureSize(uSrc, 0))*vPosition) - ivec2(U, V)/2;
  float src[X];

  for (int v = 0; v < V; v++)
    for (int u = 0; u < U; u++)
      src[u + v*U] = texelFetch(uSrc, pos + ivec2(u, v), 0).r;

  for (int y = 0; y < Y; y++) {
    float value = 0.;

    for (int x = 0; x < X; x++)
      value += abs(src[x] - texelFetch(uLUT, ivec2(x, y), 0).r);

    if (res.value > value)
      res = Result(y, value);
  }

  vFragColor = vec4(uCharMap[res.index], 0, 0, 0);
}
