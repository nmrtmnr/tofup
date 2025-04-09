const K=`//#define GLSLIFY 1\r
\r
uniform float time;\r
\r
varying vec4 vMvPosition;\r
varying vec3 vColor;\r
\r
void main() {\r
  vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;\r
\r
  float orb = 0.1 / length(uv * 1.0);\r
  orb = smoothstep(0.0, 1.0, orb);\r
\r
  vec3 color = vec3(orb) * vColor;\r
\r
  gl_FragColor = vec4(color, 1.0);\r
}\r
`,O=`//#define GLSLIFY 1\r
\r
attribute vec3 color;\r
\r
uniform float time;\r
uniform float size;\r
\r
varying vec4 vMvPosition;\r
varying vec3 vColor;\r
\r
float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {\r
    return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));\r
}\r
\r
void main() {\r
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\r
  vMvPosition = mvPosition;\r
  vColor = color;\r
\r
  //    gl_PointSize = size + ((sin(time * 0.05) + 1.0) / 2.0) * 10.0;\r
  gl_PointSize = size;\r
  gl_Position = projectionMatrix * mvPosition;\r
}\r
`,X=Q=>{let g,h,f,M,p,y,d,l,R,H,b,G=document.querySelector(".c-sound_popup"),_={ok:document.querySelector(".c-sound_popup__button--ok"),ng:document.querySelector(".c-sound_popup__button--dont-allow")};const I=[],w=document.createElement("canvas"),E=w.getContext("2d"),z="loading";let A={time:{type:"f",value:0},size:{type:"f",value:10}},m,L;const V=2048,P={bass:[20,140],lowMid:[140,400],mid:[400,2600],highMid:[2600,5200],treble:[5200,14e3]},j=()=>{G.remove(),document.body.classList.add(z),g=new THREE.Scene,g.background=new THREE.Color(0),h=new THREE.WebGLRenderer,document.getElementById("particle_movie").appendChild(h.domElement),M=new THREE.Clock,Y(),D(),navigator.mediaDevices&&(U(),N()),k()},Y=()=>{const t=p/y;f=new THREE.PerspectiveCamera(45,t,.1,1e4),f.position.set(0,0,900),f.lookAt(0,0,0),g.add(f)},N=()=>{d=document.querySelector("video"),d.play(),w.style.opacity="0.95",R=d.videoWidth,H=d.videoHeight,q(),(!R||!H)&&d.addEventListener("loadeddata",()=>{R=d.videoWidth,H=d.videoHeight,q()})},U=()=>{const e=new THREE.AudioListener;m=new THREE.Audio(e),new THREE.AudioLoader().load("/assets/audios/breakbot/baby_im_yours/musics.mp3",n=>{document.body.classList.remove(z),m.setBuffer(n),m.setLoop(!0),m.setVolume(.5),m.play()}),L=new THREE.AudioAnalyser(m,V)},$=e=>{let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return{r:parseInt(t[1],16)/255,g:parseInt(t[2],16)/255,b:parseInt(t[3],16)/255}},q=()=>{const e=F(d),t=new THREE.BufferGeometry,n=new THREE.ShaderMaterial({uniforms:A,vertexShader:O,fragmentShader:K,transparent:!0,depthWrite:!1,blending:THREE.AdditiveBlending}),r=[],a=[];let i=["#ffffff"];const s=3;for(let c=0,u=e.height;c<u;c+=s)for(let v=0,W=e.width;v<W;v+=s){let x=(v+c*W)*4;I.push(x);let B=(e.data[x]+e.data[x+1]+e.data[x+2])/3,J=B<300?B:1e4;r.push(v-e.width/2,-c+e.height/2,J);const C=$(i[Math.floor(Math.random()*i.length)]);a.push(C.r,C.g,C.b)}const o=new Float32Array(r);t.addAttribute("position",new THREE.BufferAttribute(o,3));const S=new Float32Array(a);t.addAttribute("color",new THREE.BufferAttribute(S,3)),l=new THREE.Points(t,n),g.add(l)},F=(e,t)=>{if(t&&b)return b;const n=e.videoWidth,r=e.videoHeight;return w.width=n,w.height=r,E.translate(n,0),E.scale(-1,1),E.drawImage(e,0,0),b=E.getImageData(0,0,n,r),b},T=(e,t)=>{const r=Math.round(t[0]/24e3*e.length),a=Math.round(t[1]/24e3*e.length);let i=0,s=0;for(let o=r;o<=a;o++)i+=e[o],s+=1;return i/s/255},k=e=>{M.getDelta(),M.elapsedTime,A.time.value+=.5;let t,n,r;if(L){const a=L.getFrequencyData(),i=T(a,P.bass),s=T(a,P.mid),o=T(a,P.treble);t=i,n=s,r=o}if(l){const a=parseInt(e)%2===0,i=F(d,a);let s=0;for(let o=0,S=l.geometry.attributes.position.array.length;o<S;o+=3){let c=I[s],u=(i.data[c]+i.data[c+1]+i.data[c+2])/3,v=300;u<v?u<v/3?l.geometry.attributes.position.array[o+2]=u*t*5:u<v/2?l.geometry.attributes.position.array[o+2]=u*n*5:l.geometry.attributes.position.array[o+2]=u*r*5:l.geometry.attributes.position.array[o+2]=1e4,s++}A.size.value=(t+n+r)/3*35+5,l.geometry.attributes.position.needsUpdate=!0}h.render(g,f),requestAnimationFrame(k)},D=()=>{p=window.innerWidth,y=window.innerHeight,h.setPixelRatio(window.devicePixelRatio),h.setSize(p,y),f.aspect=p/y,f.updateProjectionMatrix()};window.addEventListener("resize",D),_.ok.addEventListener("click",()=>{j()}),_.ng.addEventListener("click",()=>{window.location.href="/"})};export{X as default};
