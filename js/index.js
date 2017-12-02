window.onload=main;

var control;

function main()
{
    control=new _mapControl;
}

function htest(rurl="https://districtlands-backend.herokuapp.com/start/")
{
    var r=new XMLHttpRequest();

    r.open("POST",rurl);

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
        }
    };

    r.send("hey");
}

function htest2()
{
    var r=new XMLHttpRequest();

    r.open("GET","https://districtlands-backend.herokuapp.com/start/");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
            console.log(JSON.parse(r.response));
        }
    };

    r.send();
}

function htest3()
{
    var r=new XMLHttpRequest();

    r.open("POST","https://districtlands-backend.herokuapp.com/userstart/");

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
            console.log(JSON.parse(r.response));
        }
    };

    r.setRequestHeader("content-type","application/x-www-form-urlencoded");
    // r.setRequestHeader("content-type","application/json");

    r.send("tract_id=807000");
}

function loadUserDistricts(trackid)
{
    var r=new XMLHttpRequest();
    r.open("POST","https://districtlands-backend.herokuapp.com/userstart/");

    control.menuBarState(2);
    control.logRed(`starting algorithm: user-start, starting tract: ${trackid}, redistricting by: population...`);
    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            control.loadDistricts(JSON.parse(r.response).districts);
        }
    };

    r.setRequestHeader("content-type","application/x-www-form-urlencoded");
    r.send(`tract_id=${trackid}`);
}

function randint(min,max)
{
    return Math.floor(Math.random()*(max-min+1))+min;
}

function shuffleArray(array)
{
    var t;
    var ri;
    for (var x=array.length-1;x>0;x--)
    {
        ri=randint(0,x);
        t=array[x];
        array[x]=array[ri];
        array[ri]=t;
    }
}