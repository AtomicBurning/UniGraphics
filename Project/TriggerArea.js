class TriggerArea
{
    constructor(min, max)
    {
        this.min = min;
        this.max = max;

        this.onEnter = [];
        this.onExit = [];
        this.onInteract = [];
        this.interactKey = "e";
        this.interactLastFrame = false;

        this.onStay = false;
    }

    containsPoint(point)
    {
        return (
            point[0] >= this.min[0] &&
            point[0] <= this.max[0] &&

            point[1] >= this.min[1] &&
            point[1] <= this.max[1] &&

            point[2] >= this.min[2] &&
            point[2] <= this.max[2]
        );
    }

    update(input, player)
    {
        if (this.containsPoint(player.position) && !this.onStay)
        {
            this.onStay = true;

            for (const callback of this.onEnter)
            {
                callback();
            }
        }

        if (!this.containsPoint(player.position) && this.onStay)
        {
            this.onStay = false;

            for (const callback of this.onExit)
            {
                callback();
            }
        }

        if (this.onStay)
        {
            if (input.isDown(this.interactKey))
            {
                if (!this.interactLastFrame)
                {
                    this.interactLastFrame = true;

                    for (const callback of this.onInteract)
                    {
                        callback();
                    }
                }
            }
            else
            {
                this.interactLastFrame = false;
            }
        }
    }
}