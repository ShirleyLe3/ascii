in vec2 aPosition;
out vec2 vPosition;

void main() {
  vPosition = .5 + .5*aPosition;
  gl_Position = vec4(aPosition, 0., 1.);
}
