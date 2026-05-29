const cubeMeshDef =
{
    vertices: new Float32Array([
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
    ]),
    indices: new Uint16Array([
        0,  1,  2,  3,  4,  5,  // front
        6,  7,  8,  9, 10, 11,  // right
        12, 13, 14, 15, 16, 17,  // back
        18, 19, 20, 21, 22, 23,  // left
        24, 25, 26, 27, 28, 29,  // bottom
        30, 31, 32, 33, 34, 35   // top
    ])
};

const planeMeshDef = {
    vertices: new Float32Array([
      // x y   z     R  G  B     u  v     nx  ny  nz
      -1,  0,  1,    0, 0, 0,    0, 0,    0,  1,  0,
      1,  0,  1,    0, 0, 0,    8, 0,    0,  1,  0,
      1,  0, -1,    0, 0, 0,    8, 8,    0,  1,  0,
      -1,  0, -1,    0, 0, 0,    0, 8,    0,  1,  0,
    ]),
    indices: new Uint16Array([
      0,  1,  2,  
      0,  2,  3,
    ]),
};

const pyramidMeshDef = {
    vertices: new Float32Array([

        // front
         0,  1,  0,    0,0,0,    0.5,1,    0, 0.5, 0.9,
        -1, -1,  1,    0,0,0,    0,0,      0, 0.5, 0.9,
         1, -1,  1,    0,0,0,    1,0,      0, 0.5, 0.9,

        // right
         0,  1,  0,    0,0,0,    0.5,1,    0.9, 0.5, 0,
         1, -1,  1,    0,0,0,    0,0,      0.9, 0.5, 0,
         1, -1, -1,    0,0,0,    1,0,      0.9, 0.5, 0,

        // back
         0,  1,  0,    0,0,0,    0.5,1,    0, 0.5, -0.9,
         1, -1, -1,    0,0,0,    0,0,      0, 0.5, -0.9,
        -1, -1, -1,    0,0,0,    1,0,      0, 0.5, -0.9,

        // left
         0,  1,  0,    0,0,0,    0.5,1,   -0.5, 0.9, 0,
        -1, -1, -1,    0,0,0,    0,0,     -0.9, 0.5, 0,
        -1, -1,  1,    0,0,0,    1,0,     -0.9, 0.5, 0,

        // bottom
        -1, -1,  1,    0,0,0,    0,0,      0,-1,0,
         1, -1,  1,    0,0,0,    1,0,      0,-1,0,
         1, -1, -1,    0,0,0,    1,1,      0,-1,0,
        -1, -1,  1,    0,0,0,    0,0,      0,-1,0,
         1, -1, -1,    0,0,0,    1,1,      0,-1,0,
        -1, -1, -1,    0,0,0,    0,1,      0,-1,0,
    ]),

    indices: new Uint16Array([
         0,  1,  2,   // front
         3,  4,  5,   // right
         6,  7,  8,   // back
         9, 10, 11,   // left
        12, 13, 14,   // bottom 1
        15, 16, 17    // bottom 2
    ]),
};

function buildCylinderMesh(segments)
{
    let finalVertices = [];
    let finalIndices = [];

    for (let i = 0; i < segments; i++)
    {
        const angle = (i / segments) * Math.PI * 2;

        const x = Math.cos(angle);
        const z = Math.sin(angle);

        finalVertices.push(
            x, -1, z, 
            0, 0, 0, 
            (i / segments), 1, 
            x, 0, z
        );

        finalVertices.push(
            x, 1, z, 
            0, 0, 0, 
            (i / segments), 0, 
            x, 0, z
        );
        
        const next = (i + 1) % segments;

        const bottom = i * 2;
        const top = i * 2 + 1;

        const bottomNext = next * 2;
        const topNext = next * 2 + 1;

        finalIndices.push(top, topNext, bottom, bottom, topNext, bottomNext);
    }

    return {
        vertices: new Float32Array(finalVertices),
        indices: new Uint16Array(finalIndices)
    };
}

function buildMesh(gl, program, def)
{
    return {
        vao: createVao(gl, program, def.vertices, def.indices),
        vertices: def.vertices,
        indices: def.indices,
    };
}

async function importMesh(gl, program, path)
{
    const response = await fetch(path);
    const text = await response.text();
    
    const def = await parseObj(text);
    const builtMesh = buildMesh(gl, program, def);

    return builtMesh;
}

async function parseObj(verts)
{
    const positions = [];
    const normals = [];
    const uvs = [];

    const finalVertices = [];
    const finalIndices = [];

    const lines = verts.split("\n");

    for (const line of lines)
    {
        const parts = line.trim().split(/\s+/);

        if (parts.length === 0) continue;

        if (parts[0] === "v")
        {
            positions.push([
                parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])
            ]);
        }

        else if (parts[0] === "vn")
        {
            normals.push([
                parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])
            ]);
        }

        else if (parts[0] === "vt")
        {
            uvs.push([
                parseFloat(parts[1]),
                parseFloat(parts[2])
            ]);
        }

        //Faces/Indices
        else if (parts[0] === "f")
        {
            // i=0 is 'f' so skip; each line contains 3 sets
            for (let i = 1; i <= 3; i++)
            {
                const indices = parts[i].split("/");

                const pos = positions[parseInt(indices[0]) - 1];
                const uv = uvs[parseInt(indices[1]) - 1];
                const norm = normals[parseInt(indices[2]) - 1];
                
                finalVertices.push(
                    pos[0], pos[1], pos[2],

                    1, 1, 1, // default vertex colour

                    uv[0], uv[1],

                    norm[0], norm[1], norm[2]
                );

                finalIndices.push(finalIndices.length);
            }
        }
    }

    return {
        vertices: new Float32Array(finalVertices),
        indices: new Uint16Array(finalIndices)
    };
}