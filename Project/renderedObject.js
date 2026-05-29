class RenderedObject
{
    constructor(position, rotation, scale, material, mesh)
    {
        this.position = position;
        this.rotation = vecDegToRad(rotation);
        this.ka = material.ka;
        this.kd = material.kd;
        this.ks = material.ks;
        this.shininess = material.shininess;

        this.scale = scale;

        this.vao = mesh.vao;
        this.indices = mesh.indices;

        this.texture = material.diffuseMap;
        this.normal = material.normalMap;
        this.spec = material.specularMap;
        
        this.moveable = false;
    }

    draw(gl, program)
    {
        // Calculate the model matrix
        const model = new Mat4()
            .translate(this.position)
            .rotate([1, 0, 0], this.rotation[0]) // X
            .rotate([0, 1, 0], this.rotation[1]) // Y
            .rotate([0, 0, 1], this.rotation[2]) // Z
            .scale(this.scale);

        // Send model matrix to the shader
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);
        
        //Send Object Light
        gl.uniform1f(gl.getUniformLocation(program, "uKa"), this.ka);
        gl.uniform1f(gl.getUniformLocation(program, "uKd"), this.kd);

        gl.uniform1f(gl.getUniformLocation(program, "uKs"), this.ks);
        gl.uniform1f(gl.getUniformLocation(program, "uShininess"), this.shininess);

        if (this.texture != null)
        {
            // Bind texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);
        }

        if (this.normal != null)
        {
            // Bind normal map
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.normal);
            gl.uniform1i(gl.getUniformLocation(program, "uNormalMap"), 1);
        }

        if (this.spec != null)
        {
            // Bind specular map
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.spec);
            gl.uniform1i(gl.getUniformLocation(program, "uSpecularMap"), 2);
        }

        // Send texture flags to the shader
        gl.uniform1i(gl.getUniformLocation(program, "uHasDiffuseMap"), this.texture != null ? true : false);
        gl.uniform1i(gl.getUniformLocation(program, "uHasNormalMap"), this.normal != null ? true : false);
        gl.uniform1i(gl.getUniformLocation(program, "uHasSpecularMap"), this.spec != null ? true : false);
        
        // Draw the triangles
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}