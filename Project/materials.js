const crateMaterialDef = {
    ka: 0.0,
    kd: 0.7,
    ks: 0.2,
    shininess: 32,

    diffusePath: "assets/crate.png",
    normalPath: "assets/crate_normal.png",
    specularPath: null
};

const stoneMaterialDef = {
    ka: 0.0,
    kd: 0.7,
    ks: 1,
    shininess: 32,

    diffusePath: "assets/stones.png",
    normalPath: "assets/stones_normal.png",
    specularPath: "assets/stones_specular.png"
};

function buildMaterial(gl, def)
{
    return {
        ka: def.ka,
        kd: def.kd,
        ks: def.ks,
        shininess: def.shininess,

        diffuseMap: def.diffusePath ? loadTexture(gl, def.diffusePath) : null,
        normalMap: def.normalPath ? loadTexture(gl, def.normalPath) : null,
        specularMap: def.specularPath ? loadTexture(gl, def.specularPath) : null,
    };
}