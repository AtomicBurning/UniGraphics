//Vertex Shader
const vertexShaderSource =
`#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColour;

out vec3 vColour;

void main()
{
    gl_Position = vec4(aPosition, 1.0);
    vColour = aColour;
}`;

//Fragment Shader
const fragmentShaderSource =
`#version 300 es
precision mediump float;

in vec3 vColour;

out vec4 fragColour;

void main()
{
    fragColour = vec4(vColour, 1.0);
}`;

function main()
{
    const canvas = document.getElementById("canvas");
    const gl = initWebGL(canvas);

    //Triangle Verts
    const vertices = new Float32Array
    ([
      //x     y    z        r    g    b
       -0.5, -0.5, 0.0,     1.0, 0.0, 0.0,  //Vertex 0
        0.5, -0.5, 0.0,     0.0, 1.0, 0.0,  //Vertex 1
        0.0,  0.5, 0.0,     0.0, 0.0, 1.0   //Vertex 2
    ]);

    //       2
    //      / \
    //     0---1

    const squareVertices = new Float32Array
    ([
        // x  y    z       R    G    B                         
        0.5, 0.2, 0.0,    1.0, 0.0, 0.0, //vertex 0  3 -- 2
        0.8, 0.2, 0.0,    0.0, 1.0, 0.0, //vertex 1  |  / |        
        0.8, 0.6, 0.0,    0.0, 0.0, 1.0, //vertex 2  | /  | 
        0.5, 0.6, 0.0,    1.0, 1.0, 1.0, //vertex 3  0 -- 1 
    ]);

    //Define Indices
    const indices = new Uint16Array
    ([
        0, 1, 2,
    ]);

    const squareIndices = new Uint16Array
    ([
        0, 1, 2,
        0, 2, 3,
    ])

    //Create VBO
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const squareVbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVbo);
    gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //Create shader program and link shaders
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    //Set shader program
    gl.useProgram(program);

    //Tell WebGL how to read vertex buffer
    const triangleVao = createVao(gl, program, vertices, indices);
    const squareVao = createVao(gl, program, squareVertices, squareIndices);

    gl.bindVertexArray(triangleVao);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(squareVao);
    gl.drawElements(gl.TRIANGLES, squareIndices.length, gl.UNSIGNED_SHORT, 0);
}

main();