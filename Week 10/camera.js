class Camera
{
    constructor()
    {
        this.eye = [0, 0, 0];

        // Camera quaternion
        this.rotation = new Quaternion();
        this.targetRotation = new Quaternion();
        this.smoothing = 12;

        this.fov = 60 * Math.PI / 180;
        this.aspect = 800 / 600;
        this.near = 0.1;
        this.far = 100;

        this.maxSpeed = 5;
        this.turnSpeed = 0.002;
        this.yaw = 0;
        this.pitch = 0;
    }

    update(input, dt) {
        // Get yaw and pitch angles from mouse input
        const mouse = input.consumeMouseDelta();
        this.yaw   -= mouse.dx * this.turnSpeed;
        this.pitch -= mouse.dy * this.turnSpeed;

        // Calculate camera rotation quaternion
        const xAxis = [1, 0, 0];
        const yAxis = [0, 1, 0];
        const qPitch = Quaternion.fromAxisAngle(xAxis, this.pitch);
        const qYaw   = Quaternion.fromAxisAngle(yAxis, this.yaw);
        this.targetRotation = qYaw.multiply(qPitch).normalize();

        let t = 1 - Math.exp(-this.smoothing * dt);
        this.rotation = Quaternion.slerp(this.rotation, this.targetRotation, t);

        // Calculate front and right camera vectors
        const zAxis = [0, 0, -1];
        const front = this.rotation.rotateVector(zAxis);
        const right = this.rotation.rotateVector(xAxis);

        // Movement direction
        let moveDir = [0, 0, 0];
        if (input.isDown("w")) moveDir = addVector(moveDir, front);
        if (input.isDown("s")) moveDir = subtractVector(moveDir, front);
        if (input.isDown("a")) moveDir = subtractVector(moveDir, right);
        if (input.isDown("d")) moveDir = addVector(moveDir, right);

        if (length(moveDir) > 0) moveDir = normalize(moveDir);

        // Move camera
        this.eye = addVector(this.eye, scaleVector(moveDir, this.maxSpeed * dt));
    }

    getViewMatrix() {
        const rotateMatrix = this.rotation.inverse().matrix();
        const translateMatrix = new Mat4().translate([
            -this.eye[0],
            -this.eye[1],
            -this.eye[2]
        ]);
        
        return rotateMatrix.multiply(translateMatrix);
    }

    getOrthographicMatrix(left, right, bottom, top, near, far)
    {
        const rl = 1 / (right - left);
        const tb = 1 / (top - bottom);
        const fn = 1 / (far - near);

        return new Mat4().set([
            2 * rl, 0, 0, 0,
            0, 2 * tb, 0, 0,
            0, 0, -2 * fn, 0,
            -(right + left) * rl,
            -(top + bottom) * tb,
            -(far + near) * fn,
            1
        ]);
    }

    getPerspectiveMatrix() {
        const t  = this.near * Math.tan(this.fov / 2);
        const r  = this.aspect * t;
        const fn = 1 / (this.far - this.near);

        return new Mat4().set([
            this.near / r, 0, 0, 0,
            0, this.near / t, 0, 0,
            0, 0, -(this.far + this.near) * fn, -1,
            0, 0, -2 * this.far * this.near * fn, 0
        ]);
    }
}