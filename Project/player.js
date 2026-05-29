class Player extends RenderedObject
{
    constructor(position, rotation, scale, material, mesh)
    {
        super(position, rotation, scale, material, mesh);

        this.camera;

        this.velocity = [0, 0, 0];
        this.maxSpeed = 4;
        this.acceleration = 10;

        this.jumpPower = 6;
        this.gravity = 9.81;
        this.grounded = true;
    }

    attachCam(camera)
    {
        this.camera = camera
    }

    update(input, dt)
    {
        // Calculate front and right camera vectors
        const xAxis = [1, 0, 0];
        const yAxis = [0, 1, 0];
        const zAxis = [0, 0, -1];

        const front = this.camera.rotation.rotateVector(zAxis);
        const flatFront = normalize([
            front[0],
            0,
            front[2]
        ]);

        const right = this.camera.rotation.rotateVector(xAxis);
        const flatRight = normalize([
            right[0],
            0,
            right[2]
        ]);

        // Movement direction
        let moveDir = [0, 0, 0];
        if (input.isDown("w")) moveDir = addVector(moveDir, flatFront);
        if (input.isDown("s")) moveDir = subtractVector(moveDir, flatFront);
        if (input.isDown("a")) moveDir = subtractVector(moveDir, flatRight);
        if (input.isDown("d")) moveDir = addVector(moveDir, flatRight);

        if (length(moveDir) > 0) moveDir = normalize(moveDir);

        this.velocity[0] += this.acceleration * dt * moveDir[0];
        this.velocity[2] += this.acceleration * dt * moveDir[2];

        const speed = length(this.velocity);
        if (speed >= this.maxSpeed)
        {
            this.velocity[0] = (this.maxSpeed / speed) * this.velocity[0];
            this.velocity[2] = (this.maxSpeed / speed) * this.velocity[2];
        }


        //Jumping and Gravity
        this.velocity[1] -= this.gravity * dt;

        if (this.position[1] <= 0)
        {
            this.position[1] = 0;
            this.grounded = true;
            this.velocity[1] = 0;
        }

        if (this.grounded && input.isDown(" "))
        {
            this.velocity[1] = this.jumpPower;
            this.grounded = false;
        }

        this.position = addVector(this.position, scaleVector(this.velocity, dt));

        if (length(moveDir) === 0)
        {
            this.velocity[0] *= 0.9;
            this.velocity[2] *= 0.9;
        }
    }

    draw(gl, program)
    {
        //Don't render player in first person cam as it way cause clipping/obstruction
        if (this.camera.firstPerson) { return; }

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

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

        // Bind normal map
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.normal);
        gl.uniform1i(gl.getUniformLocation(program, "uNormalMap"), 1);

        // Send texture flags to the shader
        gl.uniform1i(gl.getUniformLocation(program, "uHasDiffuseMap"), this.texture != null ? true : false);
        gl.uniform1i(gl.getUniformLocation(program, "uHasNormalMap"), this.normal != null ? true : false);
        gl.uniform1i(gl.getUniformLocation(program, "uHasSpecularMap"), this.spec != null ? true : false);
        
        // Draw the triangles
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}