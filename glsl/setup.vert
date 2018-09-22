attribute vec2 aPosition;
varying vec2 vPosition;

void main() {
  vPosition = 0.5 + 0.5 * aPosition;
  gl_Position = vec4(aPosition, 0., 1.);
}
