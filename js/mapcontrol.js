class _mapControl
{
    constructor()
    {
        this.emap=document.querySelector(".map");
        this.map=new google.maps.Map(this.emap,{
            center:{lat:38.682,lng:-77.344},
            zoom:8
        });

        this.menu=document.querySelector(".menu-bar");
        this.redconsole=this.menu.querySelector(".console");
        this.currentMenuState=1;

        this.userSelectMode=0;

        this.menuSet();
        this.mapButtons();
        this.loadFeatures();
        this.genFourColour();

        google.maps.event.addListenerOnce(this.map,"idle",(e)=>{
            setTimeout(()=>{
                document.querySelector(".wrap").classList.remove("unloaded");
                this.menuBarState(1);
            },100);
        });
    }

    menuSet()
    {
        this.expandMenuButton=this.menu.querySelector(".expand");
        this.menu.querySelector(".minimise").addEventListener("click",(e)=>{
            this.menuBarState(this.currentMenuState-1);
        });

        this.menu.querySelector(".user-start").addEventListener("click",(e)=>{
            this.menuBarState(2);
            this.selectTrack();
        });

        this.menu.querySelector(".pd-start").addEventListener("click",(e)=>{
            // this.loadGeoJsonTest();
            this.menuBarState(2);
            this.loadPdDistricts();
        });

        this.menu.querySelector(".maximise").addEventListener("click",(e)=>{
            this.menuBarState(this.currentMenuState+1);
        });

        this.expandMenuButton.addEventListener("click",(e)=>{
            if (this.currentMenuState<=1)
            {
                this.menuBarState(this.currentMenuState+1);
            }

            else
            {
                this.menuBarState(this.currentMenuState-1);
            }
        });
    }

    mapButtons()
    {
        this.menuShow=document.createElement("div");
        this.menuShow.classList.add("menu-show");
        this.menuShow.innerHTML="▴";

        this.menuShow.addEventListener("click",(e)=>{
            this.menuBarState(1);
        });

        this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(this.menuShow);
    }

    selectTrack()
    {
        this.resetTracks();
        this.fadeBorder();
        this.logRed("please click on the map to select a start location.");
        this.userSelectMode=1;
    }

    //load geojson from a file and alternate colouring
    //between red and blue
    loadGeoJsonTest()
    {
        this.map.data.loadGeoJson("geodata/md-district.geojson",{},(features)=>{
            var colourCount=0;
            for (var x=0,l=features.length;x<l;x++)
            {
                this.map.data.overrideStyle(features[x],{
                    fillColor:this.Rcolours[colourCount],
                    fillOpacity:.5,
                    strokeColor:this.Rcolours[colourCount]
                });

                colourCount++;

                if (colourCount>=this.Rcolours.length)
                {
                    colourCount=0;
                }
            }
        });

        var infowindow=new google.maps.InfoWindow({
            content:`<table class="info-table"><tbody><tr><td>sample</td><td>data</td></tr><tr><td>sample</td><td>data</td></tr><tr><td>sample</td><td>data</td></tr></tbody></table>`
        });

        this.map.data.addListener("click",(e)=>{
            // console.log(e.latLng.lat());
            // console.log(e.latLng.lng());

            infowindow.setPosition(e.latLng);
            infowindow.open(this.map);
        });
    }

    loadPdDistricts()
    {
        this.resetTracks();
        var r=new XMLHttpRequest();

        r.open("GET","https://districtlands-backend.herokuapp.com/start/");

        this.logRed("starting algorithm: user-start, redistricting by: population...");
        r.onreadystatechange=()=>{
            if (r.readyState==4)
            {
                var data=JSON.parse(r.response).districts;

                this.loadDistricts(data);
            }
        };

        r.send();
    }

    loadAdjs()
    {
        var r=new XMLHttpRequest();
        r.open("GET","geodata/adjacencies.json");
        r.onreadystatechange=()=>{
            if (r.readyState==4)
            {
                this.adjacents=JSON.parse(r.response);

                for (var x in this.tracks)
                {
                    this.map.data.overrideStyle(this.tracks[x],{
                        strokeWeight:1
                    });
                }

                console.log("adjacents loaded");
            }
        };
        r.send();
    }

    loadFeatures()
    {
        this.map.data.setStyle({
            fillOpacity:0,
            strokeWeight:0
        });

        this.map.data.loadGeoJson("geodata/md-border.geojson",{},(feature)=>{
            this.border=feature[0];
            this.map.data.overrideStyle(feature[0],{
                strokeColor:"#e7395a",
                fillColor:"#e7395a",
                fillOpacity:.1,
                strokeWeight:2
            });
        });

        this.tracks={};
        this.dupes=[];
        var tid;
        this.map.data.loadGeoJson("geodata/md.geojson",{},(features)=>{
            for (var x=0,l=features.length;x<l;x++)
            {
                tid=features[x].getProperty("TRACTCE");

                if (this.tracks[tid])
                {
                    this.dupes.push(tid);
                }

                this.tracks[tid]=features[x];
            }
        });

        this.map.data.addListener("mouseover",(e)=>{
            if (e.feature.getProperty("TRACTCE") && (this.userSelectMode || this.adjacents))
            {
                if (this.adjacents)
                {
                    this.map.data.overrideStyle(e.feature,{
                        strokeWeight:1,
                        strokeColor:"red"
                    });
                }

                this.map.data.overrideStyle(e.feature,{
                    strokeWeight:1,
                    strokeColor:"black"
                });
            }
        });

        this.map.data.addListener("mouseout",(e)=>{
            if (e.feature.getProperty("TRACTCE") && (this.userSelectMode || this.adjacents))
            {
                if (this.adjacents)
                {
                    this.map.data.overrideStyle(e.feature,{
                        strokeColor:"black"
                    });
                }

                else
                {
                    this.map.data.overrideStyle(e.feature,{
                        strokeWeight:0
                    });
                }
            }
        });

        this.map.data.addListener("click",(e)=>{
            if (e.feature.getProperty("TRACTCE") && this.userSelectMode)
            {
                loadUserDistricts(e.feature.getProperty("TRACTCE"));
                this.map.data.overrideStyle(e.feature,{
                    strokeWeight:0
                });
                this.userSelectMode=0;
            }

            if (e.feature.getProperty("TRACTCE") && this.adjacents)
            {
                this.resetTracks();
                var currentAdjacents=this.adjacents[e.feature.getProperty("TRACTCE")];

                this.map.data.overrideStyle(e.feature,{
                    fillColor:"blue",
                    fillOpacity:1
                });

                console.log(currentAdjacents);
                for (var x=0,l=currentAdjacents.length;x<l;x++)
                {
                    this.map.data.overrideStyle(this.tracks[currentAdjacents[x]],{
                        fillColor:"blue",
                        fillOpacity:1
                    });
                }
            }
        });
    }

    /*0: gone
      1: normal
      2: expanded
      3: maximised */
    menuBarState(state)
    {
        if (state<0)
        {
            state=0;
        }

        if (state>=3)
        {
            state=3;
        }

        this.currentMenuState=state;
        switch (state)
        {
            case 1:
            this.menu.classList.remove("expanded");
            this.menu.classList.remove("hidden");
            this.menuShow.classList.add("hidden");
            this.expandMenuButton.innerText="additional information";
            break;

            case 2:
            this.menu.classList.add("expanded");
            this.emap.classList.remove("unmaximise");
            this.menu.classList.remove("maximise");
            this.expandMenuButton.innerText="minimise additional information";
            break;

            case 0:
            this.menu.classList.remove("expanded");
            this.menu.classList.add("hidden");
            this.menuShow.classList.remove("hidden");
            this.expandMenuButton.innerText="additional information";
            break;

            case 3:
            this.emap.classList.add("unmaximise");
            this.menu.classList.add("maximise");
            break;
        }
    }

    genFourColour()
    {
        // var hues=[randint(37,48),randint(349,359),randint(203,249),randint(29,155)];
        var hues=[randint(0,96),randint(97,179),randint(180,260),randint(261,359)];

        shuffleArray(hues);

        this.Rcolours=[];
        for (var x=0;x<4;x++)
        {
            this.Rcolours.push("#"+new tinycolor(`hsv(${hues[x]},75,91)`).toHex());
        }

        for (var x=0;x<4;x++)
        {
            this.Rcolours.push("#"+new tinycolor(`hsv(${hues[x]},54,97)`).toHex());
        }
    }

    fadeBorder(opacity=0)
    {
        this.map.data.overrideStyle(this.border,{
            fillOpacity:opacity
        });
    }

    resetTracks()
    {
        for (var x in this.tracks)
        {
            this.map.data.overrideStyle(this.tracks[x],{
                fillOpacity:0
            });
        }
    }

    logRed(msg)
    {
        this.redconsole.insertAdjacentHTML("afterbegin",`<p>${msg}</p>`);
        this.redconsole.scrollTop=0;
    }

    //give it district array of stuff from district request
    loadDistricts(data)
    {
        // console.log(data);
        this.logRed(`data received: ${data.length} districts.`);

        var trackid;
        var colourCount=0;
        for (var x=0,l=data.length;x<l;x++)
        {
            this.logRed(`loading district ${x+1}...`);
            for (var y=0,yl=data[x].tracts.length;y<yl;y++)
            {
                // console.log(data[x].tracts[y]);
                trackid=data[x].tracts[y];

                if (!this.tracks[trackid])
                {
                    console.log("missing?",trackid);
                }

                this.map.data.overrideStyle(this.tracks[trackid],{
                    fillColor:this.Rcolours[colourCount],
                    fillOpacity:1
                });
            }

            colourCount++;

            if (colourCount>=this.Rcolours.length)
            {
                colourCount=0;
            }
        }
        this.logRed("districting complete.");
    }
}