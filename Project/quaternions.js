// Define vertex shader
const vertexShader = 
`#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;
in vec2 aTexCoords;
in vec3 aNormal;

out vec3 vColour;
out vec2 vTexCoords;
out vec3 vNormal;
out vec3 vPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

in vec3 aTangent;

out vec3 vTangent;
out vec3 vBitangent;

void main() {
    gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);

    // Output vertex colour
    vColour = aColour;

    // Output texture coordinates
    vTexCoords = aTexCoords;
    
    // Output world space normal vectors
    vNormal = normalize(mat3(transpose(inverse(uModel))) * aNormal);
    vPosition = vec3(uModel * vec4(aPosition, 1.0));

    // Output world space tangent and bitangent vectors
    vTangent = normalize(mat3(uModel) * aTangent);
    vBitangent = normalize(cross(vNormal, vTangent));
}`;

// Define fragment shader
const fragmentShader = 
`#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoords;
in vec3 vNormal;
in vec3 vPosition;

in vec3 vTangent;
in vec3 vBitangent;

out vec4 fragColour;

uniform sampler2D uTexture;
uniform vec3 uCameraPosition;
uniform sampler2D uNormalMap;
uniform sampler2D uSpecularMap;

uniform bool uHasDiffuseMap;
uniform bool uHasNormalMap;
uniform bool uHasSpecularMap;

// Material coefficients
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;

// Light struct
struct Light {
  vec3 position;
  vec3 colour;
  float constant;
  float linear;
  float quadratic;
  int type;
  vec3 direction;
  float cutoff;
  float outerCutoff;
};

// Number of lights
uniform int uNumLights;

// Array of lights
uniform Light uLights[16];

// Function to compute the lighting
vec3 computeLighting(Light light, vec3 N, vec3 V, vec3 objectColour){

  if (light.type == 3){
    return vec3(0.0, 0.0, 0.0);
  }

  // Light vector
  vec3 L = normalize(light.position - vPosition);

  // Attenuation
  float distance = length(light.position - vPosition);
  float attenuation = 1.0 / (
    light.constant +
    light.linear * distance +
    light.quadratic * distance * distance
  );

  // Spotlight intensity
  float intensity = 1.0;
  if (light.type == 1) {
    float theta = dot(-L, normalize(light.direction));
    float epsilon = light.cutoff - light.outerCutoff;
    intensity = clamp((theta - light.outerCutoff) / epsilon, 0.0, 1.0);
  }

  // Directional light
  if (light.type == 2) {
    L = normalize(-light.direction);
    attenuation = 1.0;
  }

  // Ambient light
  vec3 ambient = uKa * objectColour;

  // Diffuse light
  float diff = max(dot(N, L), 0.0);
  vec3 diffuse = uKd * max(dot(N, L), 0.0) * light.colour * objectColour;

  // Specular light
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), uShininess);
  vec3 specular = uKs * spec * light.colour;

  // Apply specular map only if defined
  if (uHasSpecularMap) {
    specular *= texture(uSpecularMap, vTexCoords).rgb;
  }

  // Output fragment colour
  return attenuation * (ambient + intensity * (diffuse + specular));
}

// Main fragment shader function
void main() {

  // Object colour
  vec4 objectColour = vec4(vColour, 1.0);
  if (uHasDiffuseMap) {
    objectColour = texture(uTexture, vTexCoords);
  }

  // Lighting vectors
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCameraPosition - vPosition);

  // Apply normal map
  if (uHasNormalMap) {
    vec3 T = normalize(vTangent);
    vec3 B = cross(N, T);
    mat3 TBN = mat3(T, B, N);

    vec3 normalSample = texture(uNormalMap, vTexCoords).rgb * 2.0 - 1.0;
    N = normalize(TBN * normalSample);
  }

  // Calculate lighting for each light source
  vec3 lighting;
  for (int i = 0; i < uNumLights; i++) {
    lighting += computeLighting(uLights[i], N, V, objectColour.rgb);
  }

  // Fragment colour
  fragColour = vec4(lighting, objectColour.a);
}`;

// Define vertex and fragment shaders for the light source
const lightVertexShader =
`#version 300 es
precision mediump float;

in vec3 aPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}`;

const lightFragmentShader =
`#version 300 es
precision mediump float;

out vec4 fragColour;

uniform vec3 uLightColour;

void main() {
  fragColour = vec4(uLightColour, 1.0);
}`;

// Main function
async function main() {

    // Setup WebGL
    const canvas = document.getElementById("canvasId");
    const gl = initWebGL(canvas);
    
    // Create WebGL program 
    const program = createProgram(gl, vertexShader, fragmentShader);
    const lightProgram = createProgram(gl, lightVertexShader, lightFragmentShader);

    // Set the shader program
    gl.useProgram(program);

    let materials = [];
    materials["crate"] = buildMaterial(gl, crateMaterialDef);
    materials["stone"] = buildMaterial(gl, stoneMaterialDef);

    let meshes = [];
    meshes["cube"] = buildMesh(gl, program, cubeMeshDef);
    meshes["plane"] = buildMesh(gl, program, planeMeshDef);
    meshes["suzanne"] = await importMesh(gl, program, "assets/suzanne.obj");
    meshes["pyramid"] = buildMesh(gl, program, pyramidMeshDef);
    meshes["tube"] = buildMesh(gl, program, buildCylinderMesh(16));

    const camera = new Camera();
    camera.eye = [6, 2, 5];

    const input = new Input(canvas);

    const player = new Player([3, 3, 3], [0, 0, 0], [0.5, 0.4, 0.5], materials["crate"], meshes["suzanne"]);
    player.attachCam(camera);

    // Define cube positions
    const objs = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            objs.push(new RenderedObject([3 * i, 0, -3 * j], [0, 0, 0], [0.5, 0.5, 0.5], materials["crate"], meshes["cube"]));
        }
    }

    objs.push(new RenderedObject([6, -0.5, -6], [0, 0, 0], [10, 1, 10], materials["stone"], meshes["plane"]));

    objs.push(new RenderedObject([5, 0, 5], [0, 0, 0], [2, 2, 2], materials["stone"], meshes["pyramid"]));
    objs.push(new RenderedObject([10, 1, -10], [0, 0, 0], [1, 1, 1], materials["crate"], meshes["tube"]));

    const door = new Door([0, 5, -10], [0, 0, 0], [0.1, 10, 20], materials["stone"], meshes["cube"], [0, 15, -10], [0, 5, -10]);
    const lever = new Lever([7, 0, -7], [15, 0, 0], [0.25, 1, 0.25], materials["crate"], meshes["cube"], [-15, 0, 0], [15, 0, 0])

    // Add light sources
    const light = new Light();
    light.position = [6, 2, 0];

    const lightSources = new LightSources();
    lightSources.addLight(light);

    // Yellow light
    const yellowLight = new Light(1);
    yellowLight.position = [9, 3, -9];
    yellowLight.colour = [1, 1, 0];
    yellowLight.active = false;
    lightSources.addLight(yellowLight);

    const triggers = [];
    const yellowTrigger = new TriggerArea([5, 0, -13], [13, 6, -5]);
    yellowTrigger.onEnter.push(() => {
      yellowLight.toggle();
    })

    yellowTrigger.onExit.push(() => {
      yellowLight.toggle();
    })

    yellowTrigger.onInteract.push(() => {
      door.toggle();
    })

    yellowTrigger.onInteract.push(() => {
      lever.toggle();
    })

    triggers.push(yellowTrigger);
    objs.push(door);
    objs.push(lever);


    // Directional light
    const directionalLight = new Light(2);
    directionalLight.colour = [1, 0, 1];
    directionalLight.direction = [2, -1, -1];
    lightSources.addLight(directionalLight);

    let lastTime = 0;
    const numObjs = objs.length;

    // Render function
    function render(time) {

        // Manual init call, no timing yet
        if (time == null) {
            requestAnimationFrame(render);
            return;
        }

        // Clear frame buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set the shader program
        gl.useProgram(program);

        const dt = (time - lastTime) * 0.001;
        lastTime = time;

        player.update(input, dt);

        camera.update(input, dt);
        camera.updateTarget(player.position);

        const view = camera.getViewMatrix();

        //const projection = camera.getOrthographicMatrix(-2, 2, -2, 2, 0, 100);
        const projection = camera.getPerspectiveMatrix();

        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), false, view.m);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection.m);

        // Send light source properties to the shader
        lightSources.toShader(gl, program);

        for (let i = 0; i < numObjs; i++) 
        {
          objs[i].draw(gl, program);
          if (objs[i].moveable)
          {
            objs[i].update(dt);
          }
        }

        for (const trigger of triggers)
        {
            trigger.update(input, player);
        }

        // Send camera position to the shader
        gl.uniform3fv(gl.getUniformLocation(program, "uCameraPosition"), camera.eye);

        player.draw(gl, program);

        // Draw light sources
        gl.useProgram(lightProgram);

        for (let i = 0; i < lightSources.lights.length; i++) 
        {
            // Don't draw directional light source
            if (lightSources.lights[i].type === 2 || lightSources.lights[i].type === 3) continue;

            // Calculate model matrix for light source
            const model = new Mat4()
                .translate(lightSources.lights[i].position)
                .scale([0.1, 0.1, 0.1]);

            // Send model, view and projection matrices to the shaders
            gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, model.m);
            gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uView"), false, view.m);
            gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uProjection"), false, projection.m);

            // Send light colour to the shader
            gl.uniform3fv(gl.getUniformLocation(lightProgram, "uLightColour"), lightSources.lights[i].colour);

            // Draw light source cube
            gl.bindVertexArray(meshes["cube"].vao);
            gl.drawElements(gl.TRIANGLES, meshes["cube"].indices.length, gl.UNSIGNED_SHORT, 0);
        }

        // Calculate model matrix for the light source
        const model = new Mat4()
        .translate(light.position)
        .scale([0.1, 0.1, 0.1]);

        // Send model, view and projection matrices to the shaders
        gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, model.m);
        gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uView"), false, view.m);
        gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uProjection"), false, projection.m);

        // Send light colour to the shader
        gl.uniform3fv(gl.getUniformLocation(lightProgram, "uLightColour"), light.colour);

        // Draw light source cube
        gl.bindVertexArray(meshes["cube"].vao);
        gl.drawElements(gl.TRIANGLES, meshes["cube"].indices.length, gl.UNSIGNED_SHORT, 0);

        // Render next frame
        requestAnimationFrame(render);
    }

    render();
}

main();