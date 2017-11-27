window.onload=main;

var control;

function main()
{
    control=new _mapControl;
}

function htest(rurl="https://districtlands.herokuapp.com/")
{
    console.log("he");
    var r=new XMLHttpRequest();

    r.open("GET",rurl);

    r.onreadystatechange=()=>{
        if (r.readyState==4)
        {
            console.log(r.response);
        }
    };

    r.send();
}