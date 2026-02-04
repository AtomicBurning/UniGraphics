function main()
{
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) throw new error("WebGL not supported!");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Triangle Verts
    const vertices = new Float32Array
    ([
      //x     y    z
       -0.5, -0.5, 0.0, //Vertex 0
        0.5, -0.5, 0.0, //Vertex 1
        0.0,  0.5, 0.0  //Vertex 2
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

    void main()
    {
        gl_Position = vec4(aPosition, 1.0);
    }`;

    //Compile vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        console.log(`Error compiling vertex shader:\n`, gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
    }

    //Fragment Shader
    const fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    out vec4 fragColour;

    void main()
    {
        fragColour = vec4(1.0, 0.0, 0.0, 1.0);
    }`;

    //Compile fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    {
        console.log(`Error compiling fragment shader:\n`, gl.getShaderInfoLog(fragmentShader));
        gl.deleteShader(fragmentShader);
    }

    //Create shader program and link shaders
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.log(`Failed to link WebGL program: ${gl.getProgramInfoLog(program)}`)
        return;
    }

    //Set shader program
    gl.useProgram(program);

    //Tell WebGL how to read vertex buffer  
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer(
    positionLocation, //index
    3,                //size
    gl.FLOAT,         //type
    false,            //normalised
    0,                //stride
    0);               //offset

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();