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
        0.0,  0.5, 0.0,     0.0, 0.0, 1.0//Vertex 2
    ]);

    //       2
    //      / \
    //     0---1

    //Create VBO
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

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

    //Create shader program and link shaders
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    //Set shader program
    gl.useProgram(program);

    //Tell WebGL how to read vertex buffer
    
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer(
        positionLocation,                   //index
        3,                                  //size
        gl.FLOAT,                           //type
        false,                              //normalised
        6 * Float32Array.BYTES_PER_ELEMENT, //stride
        0                                   //offset
    );

    const colourLocation = gl.getAttribLocation(program, "aColour");
    gl.enableVertexAttribArray(colourLocation);
    gl.vertexAttribPointer(
        colourLocation,                     //index
        3,                                  //size
        gl.FLOAT,                           //type
        false,                              //normalised
        6 * Float32Array.BYTES_PER_ELEMENT, //stride
        3 * Float32Array.BYTES_PER_ELEMENT  //offset
    );

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();