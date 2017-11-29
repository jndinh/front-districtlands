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