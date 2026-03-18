class Light 
{
    constructor()
    {
        this.position = [0, 0, 0];
        this.colour = [1, 1, 1];
    }

    toShader(gl, program)
    {
        gl.uniform3fv(gl.getUniformLocation(program, "uLightPosition"), this.position);
        gl.uniform3fv(gl.getUniformLocation(program, "uLightColour"), this.colour);
    }
}