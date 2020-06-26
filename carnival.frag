//  Per Pixel Lighting shader with texture

varying vec3 View;
varying vec3 Light;
varying vec3 Normal;
uniform sampler2D tex;

void main()
{
  //  N is the object normal
  vec3 N = normalize(Normal);
  //  L is the light vector
  vec3 L = normalize(Light);
  //  R is the reflected light vector R = 2(L.N)N - L
  vec3 R = reflect(-L,N);
  //  V is the view vector (eye vector)
  vec3 V = normalize(View);

  //  Diffuse light is cosine of light and normal vectors
  float Id = max(dot(L,N) , 0.0);
  //  Specular is cosine of reflected and view vectors
  float Is = (Id>0.0) ? pow(max(dot(R,V),0.0) , gl_FrontMaterial.shininess) : 0.0;
  // Attenuation
  float d = length(Light);
  float At = clamp(12.0/d, 0.0, 1.0);

  //toonify: alter intensity
  float intensity = dot(normalize(N),normalize(L)) * At;
  float f;
  if (intensity > 0.80)
    f= 1.0 * At;
  else if (intensity > 0.4)
    f = 0.8 * At;
  else if (intensity > 0.2)
    f = 0.6 * At;
  else
    f = 0.2 * At;
  //for disable purposes
  //f = 1.0 * At;

  //  Sum color types
  vec4 color =  gl_FrontMaterial.emission * f
              + gl_FrontLightProduct[0].ambient * f
              + Id*gl_FrontLightProduct[0].diffuse * f
              + Is*gl_FrontLightProduct[0].specular * At * f;

  //  Apply texture
  gl_FragColor = color * texture2D(tex,gl_TexCoord[0].xy);
}