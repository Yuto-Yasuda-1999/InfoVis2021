

class Vec3
{
    constructor(x,y,z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sum()
    {
        return this.x + this.y + this.z;
    }

    min()
    {
        return Math.min(this.x,this.y,this.z);
    }

    mid()
    {
        var arr = [this.x ,this.y ,this.z]
        var half_length = Math.floor((arr.length/2));


        function compare(a,b){return a-b;}
        var temp = arr.sort(compare)



        if(temp.length % 2)
        {
            return temp[half_length];
        }

        return (temp[half_length-1]+temp[half_length])/2;
    }

    max()
    {
        return Math.max(this.x,this.y,this.z);
    }
}