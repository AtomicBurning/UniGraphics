class Door extends RenderedObject
{
    constructor(position, rotation, scale, material, mesh, openTarget, closedTarget)
    {
        super(position, rotation, scale, material, mesh);

        this.closedTarget = closedTarget;
        this.openTarget = openTarget;
        this.curTarget = closedTarget;

        this.open = false;
        this.speed = 5;

        this.moveable = true;
    }

    toggle()
    {
        if (this.open)
        {
            this.curTarget = this.closedTarget;
        }
        else
        {
            this.curTarget = this.openTarget;
        }

        this.open = !this.open;
    }

    update(dt)
    {
        let moveDir = normalize(subtractVector(this.curTarget, this.position));
        this.position = addVector(this.position, scaleVector(moveDir, this.speed * dt));
    }
}

class Lever extends RenderedObject
{
    constructor(position, rotation, scale, material, mesh, openRotation, closedRotation)
    {
        super(position, rotation, scale, material, mesh);

        this.openRotation = vecDegToRad(openRotation);
        this.closedRotation = vecDegToRad(closedRotation);
        this.curTarget = vecDegToRad(closedRotation);

        this.open = false;
        this.speed = 5;

        this.moveable = true;
    }

    toggle()
    {
        if (this.open)
        {
            this.curTarget = this.closedRotation;
        }
        else
        {
            this.curTarget = this.openRotation;
        }

        this.open = !this.open;

        console.log(this.curTarget);
        console.log(this.rotation);
    }

    update(dt)
    {
        const rotationValue = this.speed * dt;

        this.rotation[0] += (this.curTarget[0] - this.rotation[0]) * rotationValue;

        this.rotation[1] += (this.curTarget[1] - this.rotation[1]) * rotationValue;

        this.rotation[2] += (this.curTarget[2] - this.rotation[2]) * rotationValue;

        if (Math.abs(this.curTarget[0] - this.rotation[0]) < 0.001)
        {
            this.rotation[0] = this.curTarget[0];
        }

        if (Math.abs(this.curTarget[1] - this.rotation[1]) < 0.001)
        {
            this.rotation[1] = this.curTarget[1];
        }

        if (Math.abs(this.curTarget[2] - this.rotation[2]) < 0.001)
        {
            this.rotation[2] = this.curTarget[2];
        }
    }
}