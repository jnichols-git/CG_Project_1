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

   //toonify: alter intensity
   float intensity = dot(normalize(N),normalize(L));

   float f;
   if (intensity > 0.95)
      f= 0.0;
   else if (intensity > 0.5)
      f = 0.0;
   else if (intensity > 0.25)
      f = 0.0;
   else
      f = 0.0;
      

   //  Diffuse light is cosine of light and normal vectors
   float Id = max(dot(L,N) , 0.0);
   //  Specular is cosine of reflected and view vectors
   float Is = (Id>0.0) ? pow(max(dot(R,V),0.0) , gl_FrontMaterial.shininess) : 0.0;
   // Attenuation
   float d = length(Light);
   float At = clamp(7.5/d, 0.0, 1.0);

   //  Sum color types
   vec4 color = gl_FrontMaterial.emission * At * f
              + gl_FrontLightProduct[0].ambient * At * f
              + Id*gl_FrontLightProduct[0].diffuse * At * f
              + Is*gl_FrontLightProduct[0].specular * At * f;
   //  Apply texture
   gl_FragColor = color * texture2D(tex,gl_TexCoord[0].xy);
}
