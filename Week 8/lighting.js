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

void main() {
    gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);

    // Output vertex colour
    vColour = aColour;

    // Output texture coordinates
    vTexCoords = aTexCoords;
    
    // Output world space normal vectors
    vNormal = normalize(mat3(transpose(inverse(uModel))) * aNormal);
    vPosition = vec3(uModel * vec4(aPosition, 1.0));
}`;

// Define fragment shader
const fragmentShader = 
`#version 300 es
precision mediump float;

in vec3 vColour;
in vec2 vTexCoords;
in vec3 vNormal;
in vec3 vPosition;

out vec4 fragColour;

uniform sampler2D uTexture;
uniform float uKa;

uniform vec3 uLightPosition;
uniform vec3 uLightColour;

uniform float uKd;

void main() {

  // Object colour
  vec4 objectColour = texture(uTexture, vTexCoords);

  // Ambient light
  vec3 ambient = uKa * objectColour.rgb;

  // Diffuse light
  vec3 N = normalize(vNormal);
  vec3 L = normalize(uLightPosition - vPosition);
  float diff = max(dot(N, L), 0.0);
  vec3 diffuse = uKd * diff * uLightColour * objectColour.rgb;

  // Fragment colour
  fragColour = vec4(diffuse, objectColour.a);
}`;

// Main function
function main() {

    // Setup WebGL
    const canvas = document.getElementById("canvasId");
    const gl = initWebGL(canvas);
    
    // Create WebGL program 
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Set the shader program
    gl.useProgram(program);

    // Define cube vertices
    const vertices = new Float32Array([
        // x y   z     R  G  B     u  v     nx  ny  nz                  + ------ +
        // front                                                       /|       /|
        -1, -1,  1,    0, 0, 0,    0, 0,    0,  0,  1,  //   y        / |      / |
        1, -1,  1,    0, 0, 0,    1, 0,    0,  0,  1,  //   |       + ------ +  |
        1,  1,  1,    0, 0, 0,    1, 1,    0,  0,  1,  //   +-- x   |  + ----|- +
        -1, -1,  1,    0, 0, 0,    0, 0,    0,  0,  1,  //  /        | /      | /
        1,  1,  1,    0, 0, 0,    1, 1,    0,  0,  1,  // z         |/       |/
        -1,  1,  1,    0, 0, 0,    0, 1,    0,  0,  1,  //           + ------ +
        // right
        1, -1,  1,    0, 0, 0,    0, 0,    1,  0,  0,
        1, -1, -1,    0, 0, 0,    1, 0,    1,  0,  0,
        1,  1, -1,    0, 0, 0,    1, 1,    1,  0,  0,
        1, -1,  1,    0, 0, 0,    0, 0,    1,  0,  0,
        1,  1, -1,    0, 0, 0,    1, 1,    1,  0,  0,
        1,  1,  1,    0, 0, 0,    0, 1,    1,  0,  0,
        // back
        1, -1, -1,    0, 0, 0,    0, 0,    0,  0, -1,
        -1, -1, -1,    0, 0, 0,    1, 0,    0,  0, -1,
        -1,  1, -1,    0, 0, 0,    1, 1,    0,  0, -1,
        1, -1, -1,    0, 0, 0,    0, 0,    0,  0, -1,
        -1,  1, -1,    0, 0, 0,    1, 1,    0,  0, -1,
        1,  1, -1,    0, 0, 0,    0, 1,    0,  0, -1,
        // left
        -1, -1, -1,    0, 0, 0,    0, 0,   -1,  0,  0,
        -1, -1,  1,    0, 0, 0,    1, 0,   -1,  0,  0,
        -1,  1,  1,    0, 0, 0,    1, 1,   -1,  0,  0,
        -1, -1, -1,    0, 0, 0,    0, 0,   -1,  0,  0,
        -1,  1,  1,    0, 0, 0,    1, 1,   -1,  0,  0,
        -1,  1, -1,    0, 0, 0,    0, 1,   -1,  0,  0,
        // bottom
        -1, -1, -1,    0, 0, 0,    0, 0,    0, -1,  0,
        1, -1, -1,    0, 0, 0,    1, 0,    0, -1,  0,
        1, -1,  1,    0, 0, 0,    1, 1,    0, -1,  0,
        -1, -1, -1,    0, 0, 0,    0, 0,    0, -1,  0,
        1, -1,  1,    0, 0, 0,    1, 1,    0, -1,  0,
        -1, -1,  1,    0, 0, 0,    0, 1,    0, -1,  0,
        // top
        -1,  1,  1,    0, 0, 0,    0, 0,    0,  1,  0,
        1,  1,  1,    0, 0, 0,    1, 0,    0,  1,  0,
        1,  1, -1,    0, 0, 0,    1, 1,    0,  1,  0,
        -1,  1,  1,    0, 0, 0,    0, 0,    0,  1,  0,
        1,  1, -1,    0, 0, 0,    1, 1,    0,  1,  0,
        -1,  1, -1,    0, 0, 0,    0, 1,    0,  1,  0,
    ]);

    // Define cube indices
    const indices = new Uint16Array([
        0,  1,  2,  3,  4,  5,  // front
        6,  7,  8,  9, 10, 11,  // right
        12, 13, 14, 15, 16, 17,  // back
        18, 19, 20, 21, 22, 23,  // left
        24, 25, 26, 27, 28, 29,  // bottom
        30, 31, 32, 33, 34, 35   // top
    ]);

    // Define cube positions
    const cubes = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            cubes.push({
                position : [3 * i, 0, -3 * j],
                ka : 0.2,
                kd : 0.7,
            });
        }
    }

    const numCubes = cubes.length;

    // Create VAO
    const vao = createVao(gl, program, vertices, indices);

    // Load texture
    const texture = loadTexture(gl, "assets/crate.png");

    const camera = new Camera();
    camera.eye = [6, 2, 5];

    const input = new Input(canvas);

    let lastTime = 0;

    const light = new Light();
    light.position = [6, 2, 0];

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
        camera.update(input, dt);

        const view = camera.getViewMatrix();

        //const projection = camera.getOrthographicMatrix(-2, 2, -2, 2, 0, 100);
        const projection = camera.getPerspectiveMatrix();

        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), false, view.m);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection.m);
        light.toShader(gl, program);

        for (let i = 0; i < numCubes; i++) 
        {
            // Calculate the model matrix
            const angle = 0;
            const model = new Mat4()
                .translate(cubes[i].position)
                .rotate([0, 1, 0], angle)
                .scale([0.5, 0.5, 0.5]);

            // Send model matrix to the shader
            gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);
            
            //Send Object Light
            gl.uniform1f(gl.getUniformLocation(program, "uKa"), cubes[i].ka);
            gl.uniform1f(gl.getUniformLocation(program, "uKd"), cubes[i].kd);

            // Bind texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);
            
            // Draw the triangles
            gl.bindVertexArray(vao);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        }

        // Render next frame
        requestAnimationFrame(render);
    }

    render();
}

main();