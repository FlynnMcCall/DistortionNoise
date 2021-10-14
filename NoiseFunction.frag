// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif
# define PI 3.14159265
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float gridSize =  2.304;
const float dBBT = 0.000;
const vec3 dBBC = vec3(0.774,0.900,0.683);
// debug buffer thickness and color

const float angle = 1.440;
const int layers = 2;
const float sizeFact = 1.112;
const float strFact = 0.280;

const vec2 textureSeed = vec2(-0.060,0.500);
// if the texture looks blocky change this vector untill it doesnt


vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(0.300,0.280)),dot(p,vec2(0.620,0.720))))*43758.5453);}

float GenRandomCloudNoise(float mapM,vec2 st,vec2 seed){
    float minDist = 10.00;
    
    vec2 mi_pos = floor(st * gridSize * mapM);
    vec2 mf_pos = fract(st * gridSize * mapM);
    // mi_pos is magnified i_pos
    // mf_pos is magnified f_pos
    
    for(int y = -1; y <= 1; y++){
        for(int x = -1; x <= 1; x++){
            // relative X and Y pos
            vec2 neighbour = vec2(float(x), float(y));
            vec2 posVect = random2(neighbour + mi_pos + seed);
            //posVect = vec2(clamp(posVect.x, 0.0, 1.0), clamp(posVect.y, 0.0, 1.0));
            vec2 diff = posVect + neighbour - mf_pos;
            minDist = min(length(diff), minDist);}}
    return minDist;}


vec2 AngleVec(float incr){
    return vec2( cos(2.0 * incr/(angle * PI)), sin(2.0 *incr/(angle * PI)));}

float strRange(){
    float sum = 0.0;
    for (int i = 0; i < layers; i ++){sum += 1.0/pow(strFact, float(i));}
    return sum;
}

float GenNoise(vec2 st, vec2 scroll, vec2 seed){
    float sum = 0.0;
    vec2 offset = vec2(0.0,0.0);
    
    for (int i = layers; i > 1; i --){
        offset = AngleVec(float(i)) * (1.0 - GenRandomCloudNoise(pow(sizeFact, float(i)),st + offset + scroll, vec2(i) + seed));
        offset = offset * pow(strFact, float(i));
        
        sum += (1.0 - GenRandomCloudNoise(pow(sizeFact, float(i)),st + offset,vec2(i) + seed))/pow(strFact, float(i));}
    
    return sum/strRange();
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    vec2 scrollFunct = vec2(sin(u_time/2.0), -cos(u_time/2.0));
    
    st *= gridSize;
    
    vec2 i_pos = floor(st);
    vec2 f_pos = fract(st);
    // i_pos gives the integer position
    // f_pos gives the fractional position (pos within square)
    
    vec3 color = vec3(0.);
    color = vec3(1,1,1);
    
    vec2 offset = AngleVec(1.0) * GenNoise(st, scrollFunct, textureSeed);
    color = vec3(0.887,0.951,0.980) * GenRandomCloudNoise(sizeFact,st + offset,vec2(1,0));
    
    if (st.x - i_pos.x < dBBT || st.y - i_pos.y < dBBT ){
        color = dBBC;
    }

    gl_FragColor = vec4(color,1.0);
}




















