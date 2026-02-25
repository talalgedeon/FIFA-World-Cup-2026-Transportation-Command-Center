import { useState, useEffect, useRef, useCallback } from "react";

const KEYS = {
  google: "AIzaSyDo0Jq02vAtZ_UUzUIZ3bXtTwlEQHLf08I",
  tomtom: "Oi4ynPT5nin6zgBdD7sAVrlFRehWC5EV",
  here: "QCnp47b5_0b2jdThvzuRdR49Di923MieC3LVwuaGkLw",
};

const CITIES = [
  { n:"Vancouver",co:"Canada",f:"🇨🇦",rg:"Western",st:"BC Place",cap:"54,000",v:9,s:"g",lat:49.2766,lng:-123.1119 },
  { n:"Seattle",co:"USA",f:"🇺🇸",rg:"Western",st:"Lumen Field",cap:"69,000",v:10,s:"g",lat:47.5952,lng:-122.3316 },
  { n:"SF Bay Area",co:"USA",f:"🇺🇸",rg:"Western",st:"Levi's Stadium",cap:"71,000",v:11,s:"g",lat:37.4033,lng:-121.9694 },
  { n:"Los Angeles",co:"USA",f:"🇺🇸",rg:"Western",st:"SoFi Stadium",cap:"70,000",v:14,s:"a",lat:33.9534,lng:-118.339 },
  { n:"Guadalajara",co:"Mexico",f:"🇲🇽",rg:"Central",st:"Estadio Akron",cap:"48,000",v:8,s:"g",lat:20.681,lng:-103.3625 },
  { n:"Mexico City",co:"Mexico",f:"🇲🇽",rg:"Central",st:"Estadio Azteca",cap:"83,000",v:16,s:"a",lat:19.3029,lng:-99.1505 },
  { n:"Monterrey",co:"Mexico",f:"🇲🇽",rg:"Central",st:"Estadio BBVA",cap:"53,000",v:9,s:"g",lat:25.6657,lng:-100.2439 },
  { n:"Houston",co:"USA",f:"🇺🇸",rg:"Central",st:"NRG Stadium",cap:"72,000",v:12,s:"g",lat:29.6847,lng:-95.4107 },
  { n:"Dallas",co:"USA",f:"🇺🇸",rg:"Central",st:"AT&T Stadium",cap:"94,000",v:15,s:"g",lat:32.7473,lng:-97.0945 },
  { n:"Kansas City",co:"USA",f:"🇺🇸",rg:"Central",st:"Arrowhead Stadium",cap:"76,000",v:8,s:"g",lat:39.0489,lng:-94.4839 },
  { n:"Atlanta",co:"USA",f:"🇺🇸",rg:"Eastern",st:"Mercedes-Benz Stadium",cap:"75,000",v:12,s:"a",lat:33.7554,lng:-84.401 },
  { n:"Miami",co:"USA",f:"🇺🇸",rg:"Eastern",st:"Hard Rock Stadium",cap:"65,000",v:13,s:"g",lat:25.958,lng:-80.2389 },
  { n:"Toronto",co:"Canada",f:"🇨🇦",rg:"Eastern",st:"BMO Field",cap:"45,500",v:10,s:"g",lat:43.6332,lng:-79.4186 },
  { n:"Boston",co:"USA",f:"🇺🇸",rg:"Eastern",st:"Gillette Stadium",cap:"65,000",v:10,s:"r",lat:42.0909,lng:-71.2643 },
  { n:"Philadelphia",co:"USA",f:"🇺🇸",rg:"Eastern",st:"Lincoln Financial Field",cap:"69,000",v:11,s:"g",lat:39.9008,lng:-75.1674 },
  { n:"New York / NJ",co:"USA",f:"🇺🇸",rg:"Eastern",st:"MetLife Stadium",cap:"87,000",v:18,s:"g",lat:40.8128,lng:-74.0742 },
];

const POIS = {
  "New York / NJ": [
    { name:"JFK Airport",lat:40.6413,lng:-73.7781,type:"airport",icon:"✈️" },
    { name:"Newark Airport",lat:40.6895,lng:-74.1745,type:"airport",icon:"✈️" },
    { name:"FIFA Team Hotel",lat:40.7580,lng:-73.9855,type:"hotel",icon:"🏨" },
    { name:"Training Ground",lat:40.7420,lng:-74.1535,type:"training",icon:"⚽" },
  ],
  "Los Angeles": [
    { name:"LAX Airport",lat:33.9425,lng:-118.4081,type:"airport",icon:"✈️" },
    { name:"FIFA Team Hotel",lat:33.9850,lng:-118.4695,type:"hotel",icon:"🏨" },
    { name:"Training Facility",lat:34.0195,lng:-118.4912,type:"training",icon:"⚽" },
  ],
  "Mexico City": [
    { name:"MEX Airport",lat:19.4363,lng:-99.0721,type:"airport",icon:"✈️" },
    { name:"FIFA Team Hotel",lat:19.4270,lng:-99.1677,type:"hotel",icon:"🏨" },
  ],
  "Dallas": [
    { name:"DFW Airport",lat:32.8998,lng:-97.0403,type:"airport",icon:"✈️" },
    { name:"FIFA Team Hotel",lat:32.7870,lng:-97.0810,type:"hotel",icon:"🏨" },
  ],
  "Miami": [
    { name:"MIA Airport",lat:25.7959,lng:-80.2870,type:"airport",icon:"✈️" },
    { name:"FIFA Team Hotel",lat:25.7617,lng:-80.1918,type:"hotel",icon:"🏨" },
  ],
  "Toronto": [
    { name:"Pearson Airport",lat:43.6777,lng:-79.6248,type:"airport",icon:"✈️" },
    { name:"FIFA Team Hotel",lat:43.6426,lng:-79.3871,type:"hotel",icon:"🏨" },
  ],
  "Atlanta": [
    { name:"ATL Airport",lat:33.6407,lng:-84.4277,type:"airport",icon:"✈️" },
    { name:"FIFA Team Hotel",lat:33.7600,lng:-84.3880,type:"hotel",icon:"🏨" },
  ],
  "Houston": [
    { name:"IAH Airport",lat:29.9902,lng:-95.3368,type:"airport",icon:"✈️" },
    { name:"FIFA Team Hotel",lat:29.7504,lng:-95.3698,type:"hotel",icon:"🏨" },
  ],
};

const LOC=["Stadium","Team Hotel","Airport","Training Ground","Media Center","FIFA Hotel","Fan Zone"];
const DRV=["M. Rodriguez","J. Smith","A. Tanaka","K. Okafor","L. Müller","S. Kim","D. Santos","P. Novak","R. Ahmed","C. Williams","T. Nakamura","F. Dubois"];
const STS=["on-time","on-time","on-time","en-route","en-route","delayed","delayed","disrupted","completed","completed"];
const TRF=["Light","Light","Moderate","Moderate","Heavy","Severe"];
const VT=["bus","bus","bus","sprinter","sprinter","suv"];
const VI={bus:"🚌",sprinter:"🚐",suv:"🚙"};

function rnd(a){return a[~~(Math.random()*a.length)]}
function mkRoutes(){
  const R=[];
  for(let i=0;i<78;i++){
    const c=CITIES[i%16];let fr=rnd(LOC),to=rnd(LOC);
    while(to===fr)to=rnd(LOC);
    const s=rnd(STS),t=rnd(TRF),vt=rnd(VT);
    const base=12+~~(Math.random()*55);
    const dl=s==="delayed"?~~(Math.random()*18+4):s==="disrupted"?~~(Math.random()*35+12):0;
    const pax=vt==="bus"?~~(Math.random()*30+20):vt==="sprinter"?~~(Math.random()*10+10):~~(Math.random()*3+3);
    R.push({id:`TRN-${String(i+1).padStart(4,"0")}`,fr,to,city:c.n,c,drv:rnd(DRV),s,eta:base+dl,dl,t,vt,pax,
      vLat:c.lat+(Math.random()-.5)*.08,vLng:c.lng+(Math.random()-.5)*.1});
  }
  return R;
}

const FEED=[
  {t:"s",i:"✓",h:"TRN-0012 arrived on schedule",d:"Team Hotel → MetLife Stadium",tm:"2m",cls:""},
  {t:"w",i:"⚠",h:"Traffic surge — I-405",d:"Los Angeles · SoFi Stadium · 3 routes +15m",tm:"4m",cls:"wa"},
  {t:"d",i:"⊘",h:"Road closure — Av. Insurgentes",d:"Mexico City · Estadio Azteca",tm:"7m",cls:"al"},
  {t:"s",i:"⟲",h:"TRN-0034 rerouted via Periférico",d:"Mexico City · Saved 18m",tm:"9m",cls:""},
  {t:"s",i:"✓",h:"TRN-0045 SUV completed",d:"VIP → BMO Field, Toronto",tm:"12m",cls:""},
  {t:"w",i:"⚠",h:"Match day surge — NRG",d:"Houston · 8 sprinters + 4 buses",tm:"16m",cls:"wa"},
  {t:"s",i:"📡",h:"GPS restored — TRN-0023",d:"Guadalajara · Estadio Akron",tm:"20m",cls:""},
  {t:"d",i:"🔧",h:"Breakdown — BUS-0089",d:"Boston · Gillette · Sprinter sub 12m",tm:"23m",cls:"al"},
  {t:"s",i:"✓",h:"Philadelphia fleet clear",d:"Lincoln Financial · 11 vehicles",tm:"28m",cls:""},
  {t:"s",i:"✓",h:"VIP SUV — FIFA Officials",d:"Dallas · AT&T Stadium",tm:"35m",cls:""},
];

const sclr={"on-time":"#10b981","en-route":"#3b82f6",delayed:"#f59e0b",disrupted:"#ef4444",completed:"#94a3b8"};
const sbg={"on-time":"rgba(16,185,129,.12)","en-route":"rgba(59,130,246,.12)",delayed:"rgba(245,158,11,.12)",disrupted:"rgba(239,68,68,.12)",completed:"rgba(100,116,139,.1)"};

const mono={fontFamily:"'JetBrains Mono',monospace"};
const dim={color:"#3a4e70"};
const mut={color:"#5b6b8a"};
const sub={color:"#8fa0c0"};

export default function App(){
  const[routes,setRoutes]=useState(()=>mkRoutes());
  const[selCity,setSelCity]=useState(null);
  const[rTab,setRTab]=useState("feed");
  const[cView,setCView]=useState("map");
  const[filter,setFilter]=useState("");
  const[clock,setClock]=useState("");
  const[toast,setToast]=useState(null);
  const[trafficOn,setTrafficOn]=useState(true);
  const[hereRoutes,setHereRoutes]=useState([]);
  const[incidents,setIncidents]=useState([]);
  const[apiStatus,setApiStatus]=useState({google:false,tomtom:false,here:false});
  const mapRef=useRef(null);
  const leafletMap=useRef(null);
  const markersLayer=useRef(null);
  const vehiclesLayer=useRef(null);
  const routeLinesLayer=useRef(null);
  const hereRoutesLayer=useRef(null);
  const trafficTileLayer=useRef(null);
  const incidentMarkersLayer=useRef(null);
  const leafletLoaded=useRef(false);

  // Clock
  useEffect(()=>{
    const t=setInterval(()=>setClock(new Date().toLocaleTimeString("en-US",{hour12:false})+" ET"),1000);
    return()=>clearInterval(t);
  },[]);

  // Route sim
  useEffect(()=>{
    const t=setInterval(()=>{
      setRoutes(p=>{
        const n=[...p];
        const i=~~(Math.random()*n.length);
        n[i]={...n[i],eta:Math.max(1,n[i].eta+~~(Math.random()*5)-2)};
        if(Math.random()>.93){
          const j=~~(Math.random()*n.length);const r=n[j];
          if(r.s==="on-time")n[j]={...r,s:"delayed",dl:~~(Math.random()*12+3)};
          else if(r.s==="delayed")n[j]={...r,s:"on-time",dl:0};
        }
        return n;
      });
    },4000);
    return()=>clearInterval(t);
  },[]);

  // Toast
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),3000);return()=>clearTimeout(t)}},[toast]);

  // Init Leaflet map (loaded via script tag in index.html)
  useEffect(()=>{
    if(leafletLoaded.current)return;
    leafletLoaded.current=true;
    initMap();
  },[]);

  function initMap(){
    if(!mapRef.current||leafletMap.current)return;
    const L=window.L;

    const map=L.map(mapRef.current,{
      center:[35,-96],zoom:4,zoomControl:true,
      attributionControl:false,
    });

    // Dark base tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{
      maxZoom:19,
    }).addTo(map);

    // TomTom Traffic Flow tiles
    const ttLayer=L.tileLayer(
      `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${KEYS.tomtom}&tileSize=256`,
      {maxZoom:18,opacity:0.6}
    );
    ttLayer.addTo(map);
    trafficTileLayer.current=ttLayer;
    setApiStatus(p=>({...p,tomtom:true}));

    // Layer groups
    markersLayer.current=L.layerGroup().addTo(map);
    vehiclesLayer.current=L.layerGroup().addTo(map);
    routeLinesLayer.current=L.layerGroup().addTo(map);
    hereRoutesLayer.current=L.layerGroup().addTo(map);
    incidentMarkersLayer.current=L.layerGroup().addTo(map);

    leafletMap.current=map;
    setApiStatus(p=>({...p,google:true}));

    placeStadiumMarkers(L);
    placeVehicles(L);
    fetchTomTomIncidents(L);
  }

  function placeStadiumMarkers(L){
    if(!markersLayer.current)return;
    markersLayer.current.clearLayers();

    CITIES.forEach(c=>{
      const icon=L.divIcon({
        html:`<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:rgba(0,153,123,.2);border:2px solid #00997b;font-size:16px;box-shadow:0 2px 8px rgba(0,153,123,.3)">🏟</div>`,
        className:"",iconSize:[34,34],iconAnchor:[17,17],
      });
      const m=L.marker([c.lat,c.lng],{icon}).addTo(markersLayer.current);
      m.bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;min-width:210px;padding:6px">
          <div style="font-weight:700;font-size:14px;margin-bottom:3px">${c.f} ${c.n}</div>
          <div style="font-size:11px;color:#666;margin-bottom:8px">${c.st} · ${c.cap}</div>
          <div style="display:flex;gap:12px;font-size:10px;font-family:'JetBrains Mono',monospace;color:#555">
            <span>🚌 ${c.v} vehicles</span><span>${c.co}</span>
          </div>
        </div>
      `,{className:"dark-popup"});
    });

    // POIs
    Object.entries(POIS).forEach(([cityName,pois])=>{
      pois.forEach(poi=>{
        const icon=L.divIcon({
          html:`<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:rgba(59,130,246,.15);border:1.5px solid #3b82f6;font-size:12px">${poi.icon}</div>`,
          className:"",iconSize:[26,26],iconAnchor:[13,13],
        });
        const m=L.marker([poi.lat,poi.lng],{icon}).addTo(markersLayer.current);
        m.bindPopup(`<div style="font-family:'DM Sans',sans-serif;padding:4px"><b>${poi.icon} ${poi.name}</b><br/><span style="font-size:10px;color:#666">${cityName}</span></div>`,{className:"dark-popup"});
      });
    });
  }

  function placeVehicles(L){
    if(!vehiclesLayer.current||!routeLinesLayer.current)return;
    vehiclesLayer.current.clearLayers();
    routeLinesLayer.current.clearLayers();

    const active=routes.filter(r=>r.s!=="completed");
    const shown=selCity?active.filter(r=>r.city===selCity):active.slice(0,50);

    shown.forEach(r=>{
      const color=r.s==="disrupted"?"#ef4444":r.s==="delayed"?"#f59e0b":"#10b981";
      const emoji=VI[r.vt];

      const icon=L.divIcon({
        html:`<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:${color}22;border:2px solid ${color};font-size:14px;box-shadow:0 2px 6px ${color}44">${emoji}</div>`,
        className:"",iconSize:[28,28],iconAnchor:[14,14],
      });
      const vm=L.marker([r.vLat,r.vLng],{icon,zIndexOffset:100}).addTo(vehiclesLayer.current);
      vm.bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;min-width:200px;padding:6px">
          <div style="font-weight:700;font-size:11px;color:#3b82f6;font-family:'JetBrains Mono',monospace;margin-bottom:2px">${r.id} ${emoji} ${r.vt.toUpperCase()}</div>
          <div style="font-weight:700;font-size:13px;margin-bottom:2px">${r.fr} → ${r.to}</div>
          <div style="font-size:10px;color:#666;margin-bottom:5px">${r.city} · ${r.drv} · ${r.pax} pax</div>
          <div style="display:flex;gap:10px;font-size:10px;font-family:'JetBrains Mono',monospace">
            <span>ETA ${r.eta}m</span>
            <span style="color:${color};font-weight:700">${r.s.toUpperCase()}</span>
            <span>Traffic: ${r.t}</span>
          </div>
        </div>
      `,{className:"dark-popup"});

      // Dashed line to stadium
      L.polyline([[r.vLat,r.vLng],[r.c.lat,r.c.lng]],{
        color,weight:1.5,opacity:0.35,dashArray:"6 4",
      }).addTo(routeLinesLayer.current);
    });
  }

  // Animate vehicles
  useEffect(()=>{
    const t=setInterval(()=>{
      setRoutes(prev=>{
        return prev.map(r=>{
          if(r.s==="completed")return r;
          const nLat=r.vLat+(r.c.lat-r.vLat)*.006+(Math.random()-.5)*.0008;
          const nLng=r.vLng+(r.c.lng-r.vLng)*.006+(Math.random()-.5)*.0008;
          return{...r,vLat:nLat,vLng:nLng};
        });
      });
    },2000);
    return()=>clearInterval(t);
  },[]);

  // Redraw vehicles when routes/city changes
  useEffect(()=>{
    if(window.L&&vehiclesLayer.current){
      placeVehicles(window.L);
    }
  },[routes,selCity]);

  // TomTom incidents
  async function fetchTomTomIncidents(L){
    try{
      const res=await fetch(`https://api.tomtom.com/traffic/services/5/incidentDetails?key=${KEYS.tomtom}&bbox=-125,18,-68,52&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description},from,to}}}&language=en-US&t=1111&categoryFilter=0,1,2,3,4,5,6,7,8,9,10,11,14`);
      if(res.ok){
        const data=await res.json();
        if(data.incidents&&incidentMarkersLayer.current){
          const shown=data.incidents.slice(0,30);
          setIncidents(shown);
          shown.forEach(inc=>{
            if(!inc.geometry?.coordinates)return;
            const coords=inc.geometry.type==="Point"?[inc.geometry.coordinates]:(inc.geometry.coordinates||[]);
            if(coords.length===0)return;
            const pt=Array.isArray(coords[0])?coords[0]:coords;
            if(pt.length<2)return;
            const lat=pt[1],lng=pt[0];
            if(isNaN(lat)||isNaN(lng))return;
            const sev=inc.properties?.magnitudeOfDelay||0;
            const color=sev>=3?"#ef4444":sev>=2?"#f59e0b":"#f59e0b";
            const icon=L.divIcon({
              html:`<div style="width:10px;height:10px;border-radius:50%;background:${color};border:1px solid ${color};opacity:.6;box-shadow:0 0 6px ${color}"></div>`,
              className:"",iconSize:[10,10],iconAnchor:[5,5],
            });
            L.marker([lat,lng],{icon}).addTo(incidentMarkersLayer.current);
          });
        }
      }
    }catch(e){console.log("TomTom incidents:",e)}
  }

  // HERE routing when city selected
  async function fetchHereRoute(city){
    if(!hereRoutesLayer.current||!window.L)return;
    hereRoutesLayer.current.clearLayers();
    const L=window.L;
    const pois=POIS[city.n];
    if(!pois)return;

    for(const poi of pois){
      try{
        const res=await fetch(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${poi.lat},${poi.lng}&destination=${city.lat},${city.lng}&return=polyline,summary&apikey=${KEYS.here}`);
        if(res.ok){
          const data=await res.json();
          setApiStatus(p=>({...p,here:true}));
          if(data.routes?.[0]?.sections?.[0]?.polyline){
            const encoded=data.routes[0].sections[0].polyline;
            const decoded=decodeFlexPolyline(encoded);
            if(decoded.length>1){
              const line=L.polyline(decoded,{
                color:"#3b82f6",weight:3,opacity:0.7,
                dashArray:null,
              }).addTo(hereRoutesLayer.current);

              // Duration label
              const dur=data.routes[0].sections[0].summary?.duration;
              const len=data.routes[0].sections[0].summary?.length;
              if(dur){
                const mid=decoded[~~(decoded.length/2)];
                const mins=Math.round(dur/60);
                const km=(len/1000).toFixed(1);
                L.marker(mid,{
                  icon:L.divIcon({
                    html:`<div style="background:rgba(6,10,20,.9);border:1px solid #3b82f6;border-radius:5px;padding:3px 7px;font-family:'JetBrains Mono',monospace;font-size:9px;color:#3b82f6;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.4)">${mins}m · ${km}km</div>`,
                    className:"",iconAnchor:[30,10],
                  })
                }).addTo(hereRoutesLayer.current);
              }
            }
          }
        }
      }catch(e){console.log("HERE route error:",e)}
    }
  }

  // Decode HERE flexible polyline
  function decodeFlexPolyline(encoded){
    const result=[];
    let index=0,lat=0,lng=0;
    const decodeValue=()=>{
      let result=0,shift=0,b;
      do{
        b=encoded.charCodeAt(index++)-63;
        result|=(b&0x1f)<<shift;
        shift+=5;
      }while(b>=0x20);
      return(result&1)?~(result>>1):(result>>1);
    };
    // HERE uses flexible polyline encoding
    // Try simple decode first
    try{
      let idx=0;let lt=0;let ln=0;
      // Read header
      let header=encoded.charCodeAt(idx++)-63;
      let precision=header&0x0f;
      let factor=Math.pow(10,precision);
      let thirdDim=(header>>4)&0x07;

      while(idx<encoded.length){
        let shift=0,res=0,b;
        do{
          b=encoded.charCodeAt(idx++)-63;
          res|=(b&0x1f)<<shift;
          shift+=5;
        }while(b>=0x20);
        lt+=(res&1)?~(res>>1):(res>>1);

        shift=0;res=0;
        do{
          b=encoded.charCodeAt(idx++)-63;
          res|=(b&0x1f)<<shift;
          shift+=5;
        }while(b>=0x20);
        ln+=(res&1)?~(res>>1):(res>>1);

        if(thirdDim){
          shift=0;res=0;
          do{
            b=encoded.charCodeAt(idx++)-63;
            res|=(b&0x1f)<<shift;
            shift+=5;
          }while(b>=0x20);
        }
        result.push([lt/factor,ln/factor]);
      }
    }catch(e){
      // Fallback: straight line
      return[];
    }
    return result;
  }

  // Fly to city
  useEffect(()=>{
    if(!leafletMap.current)return;
    if(selCity){
      const c=CITIES.find(x=>x.n===selCity);
      if(c){
        leafletMap.current.flyTo([c.lat,c.lng],12,{duration:1});
        fetchHereRoute(c);
      }
    }else{
      leafletMap.current.flyTo([35,-96],4,{duration:1});
      if(hereRoutesLayer.current)hereRoutesLayer.current.clearLayers();
    }
  },[selCity]);

  // Toggle traffic
  function toggleTraffic(){
    if(!trafficTileLayer.current||!leafletMap.current)return;
    if(trafficOn){
      leafletMap.current.removeLayer(trafficTileLayer.current);
      if(incidentMarkersLayer.current)leafletMap.current.removeLayer(incidentMarkersLayer.current);
    }else{
      trafficTileLayer.current.addTo(leafletMap.current);
      if(incidentMarkersLayer.current)incidentMarkersLayer.current.addTo(leafletMap.current);
    }
    setTrafficOn(!trafficOn);
  }

  const pickCity=(n)=>setSelCity(selCity===n?null:n);
  const showToast=(m)=>setToast(m);

  const filtered=selCity?routes.filter(r=>r.city===selCity):routes;
  const ot=routes.filter(r=>["on-time","en-route","completed"].includes(r.s)).length;
  const dl=routes.filter(r=>r.s==="delayed").length;
  const dis=routes.filter(r=>r.s==="disrupted").length;

  const groups={Western:[],Central:[],Eastern:[]};
  CITIES.forEach(c=>{
    if(filter&&!c.n.toLowerCase().includes(filter.toLowerCase())&&!c.st.toLowerCase().includes(filter.toLowerCase()))return;
    groups[c.rg].push(c);
  });

  const Btn=({children,onClick,primary,small})=>(
    <button onClick={onClick} style={{padding:small?"3px 8px":"4px 11px",borderRadius:4,fontSize:small?8:9,fontWeight:700,background:primary?"#3b82f6":"#060a14",color:primary?"#fff":"#94a3c4",border:`1px solid ${primary?"#3b82f6":"rgba(255,255,255,.08)"}`,cursor:"pointer",fontFamily:"inherit"}}>{children}</button>
  );

  return(
    <div style={{display:"grid",gridTemplateRows:"auto auto 1fr",height:"100vh",background:"#060a14",color:"#eef1f8",fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:13}}>
      {toast&&<div style={{position:"fixed",top:56,right:16,zIndex:9999,padding:"8px 14px",borderRadius:7,background:"#121c30",border:"1px solid rgba(16,185,129,.25)",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:7,boxShadow:"0 4px 18px rgba(0,0,0,.4)",animation:"fadeIn .2s ease"}}>✓ {toast}</div>}

      {/* HEADER */}
      <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",height:50,background:"#0c1222",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,background:"linear-gradient(135deg,#00997b,#007a62)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:9,color:"#fff",...mono,boxShadow:"0 2px 6px rgba(0,153,123,.25)"}}>FWC</div>
          <div><div style={{fontSize:13,fontWeight:700}}>FIFA World Cup 26™</div><div style={{fontSize:8,fontWeight:600,...mut,letterSpacing:1.8,textTransform:"uppercase"}}>Client Services</div></div>
          <div style={{width:1,height:24,background:"rgba(255,255,255,.08)",margin:"0 4px"}}/>
          <div style={{fontSize:12,...sub}}>Transportation Command Center</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:5,fontSize:10,fontWeight:600,color:"#10b981",background:"rgba(16,185,129,.12)",border:"1px solid rgba(16,185,129,.25)",padding:"3px 10px",borderRadius:5,...mono}}><div style={{width:6,height:6,background:"#10b981",borderRadius:"50%",animation:"pulse 2s ease-in-out infinite"}}/> LIVE OPS</div>
          <div style={{fontSize:11,...mut,...mono}}>{clock}</div>
          <div style={{display:"flex",gap:4}}>
            {[{k:"google",l:"Leaflet"},{k:"tomtom",l:"TomTom"},{k:"here",l:"HERE"}].map(a=>(
              <div key={a.k} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:4,background:"#121c30",border:"1px solid rgba(255,255,255,.06)",fontSize:8,fontWeight:600,...mono}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:apiStatus[a.k]?"#10b981":"#f59e0b"}}/>{a.l}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={toggleTraffic} style={{padding:"4px 10px",borderRadius:5,fontSize:10,fontWeight:600,color:trafficOn?"#10b981":"#94a3c4",background:trafficOn?"rgba(16,185,129,.12)":"#121c30",border:`1px solid ${trafficOn?"rgba(16,185,129,.25)":"rgba(255,255,255,.08)"}`,cursor:"pointer",fontFamily:"inherit"}}>{trafficOn?"🟢":"⚪"} Traffic</button>
          <button onClick={()=>showToast("Report exported")} style={{padding:"4px 10px",borderRadius:5,fontSize:10,fontWeight:600,color:"#94a3c4",background:"#121c30",border:"1px solid rgba(255,255,255,.08)",cursor:"pointer",fontFamily:"inherit"}}>↓ Export</button>
        </div>
      </header>

      {/* KPI BAR */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,background:"rgba(255,255,255,.05)",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        {[
          {icon:"🚌",val:135+~~(Math.random()*15),label:"Fleet",bg:"rgba(16,185,129,.12)",clr:"#10b981",trend:"+8"},
          {icon:"⟲",val:78,label:"Routes",bg:"rgba(59,130,246,.12)",clr:"#3b82f6"},
          {icon:"✓",val:Math.round(ot/routes.length*100)+"%",label:"On-Time",bg:"rgba(16,185,129,.12)",clr:"#10b981",trend:"↑3%"},
          {icon:"⚠",val:dl,label:"Delays",bg:"rgba(245,158,11,.12)",clr:"#f59e0b",trend:`+${Math.max(0,dl-10)}`,neg:true},
          {icon:"⊘",val:dis,label:"Disrupted",bg:"rgba(239,68,68,.12)",clr:"#ef4444"},
          {icon:"⚡",val:2,label:"Actions",bg:"rgba(139,92,246,.12)",clr:"#8b5cf6"},
          {icon:"👥",val:(2700+~~(Math.random()*300)).toLocaleString(),label:"Passengers",bg:"rgba(6,182,212,.1)",clr:"#06b6d4",trend:"+312"},
        ].map((k,i)=>(
          <div key={i} style={{background:"#0c1222",padding:"10px 13px",display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:30,height:30,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,background:k.bg,color:k.clr}}>{k.icon}</div>
            <div><div style={{...mono,fontSize:16,fontWeight:700}}>{k.val}</div><div style={{fontSize:8,...mut,textTransform:"uppercase",letterSpacing:.7,marginTop:2}}>{k.label}</div></div>
            {k.trend&&<span style={{marginLeft:"auto",fontSize:8,fontWeight:600,...mono,padding:"1px 5px",borderRadius:3,color:k.neg?"#ef4444":"#10b981",background:k.neg?"rgba(239,68,68,.12)":"rgba(16,185,129,.12)"}}>{k.trend}</span>}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{display:"grid",gridTemplateColumns:"255px 1fr 315px",overflow:"hidden"}}>
        {/* LEFT */}
        <div style={{background:"#0c1222",borderRight:"1px solid rgba(255,255,255,.08)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,.08)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h3 style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,...mut,margin:0}}>Host Cities</h3>
            <span style={{fontSize:8,...dim,...mono}}>16 · 3 nations</span>
          </div>
          <div style={{padding:"6px 10px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
            <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter cities..." style={{width:"100%",padding:"5px 8px",background:"#121c30",border:"1px solid rgba(255,255,255,.08)",borderRadius:5,color:"#eef1f8",fontSize:10,outline:"none",fontFamily:"inherit"}}/>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"3px 5px"}}>
            {Object.entries(groups).map(([rg,cs])=>cs.length>0&&(
              <div key={rg}>
                <div style={{padding:"6px 10px 2px",fontSize:7,fontWeight:700,textTransform:"uppercase",letterSpacing:2,...dim}}>{rg} Region</div>
                {cs.map(c=>(
                  <div key={c.n} onClick={()=>pickCity(c.n)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,cursor:"pointer",marginBottom:1,background:selCity===c.n?"rgba(59,130,246,.1)":"transparent",outline:selCity===c.n?"1px solid rgba(59,130,246,.22)":"none",transition:"background .15s"}}>
                    <span style={{fontSize:14}}>{c.f}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:10,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.n}</div>
                      <div style={{fontSize:8,...mut,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.st} · {c.cap}</div>
                    </div>
                    <span style={{fontSize:8,...mut,...mono,background:"#060a14",padding:"1px 5px",borderRadius:3}}>{c.v}v</span>
                    <div style={{width:5,height:5,borderRadius:"50%",background:c.s==="g"?"#10b981":c.s==="a"?"#f59e0b":"#ef4444"}}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div style={{display:"flex",flexDirection:"column",overflow:"hidden",background:"#060a14"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 16px",background:"#0c1222",borderBottom:"1px solid rgba(255,255,255,.08)",minHeight:40}}>
            <div>
              <span style={{fontSize:12,fontWeight:700}}>{selCity||"All Cities"}</span>
              <span style={{fontSize:9,...mut,marginLeft:8}}>{selCity?CITIES.find(c=>c.n===selCity)?.st+" · "+filtered.length+" routes":"78 routes · 16 venues"}</span>
            </div>
            <div style={{display:"flex",gap:2,background:"#121c30",padding:2,borderRadius:6}}>
              {["map","routes"].map(v=>(
                <button key={v} onClick={()=>setCView(v)} style={{padding:"3px 11px",fontSize:9,fontWeight:600,borderRadius:4,border:"none",background:cView===v?"#3b82f6":"transparent",color:cView===v?"#fff":"#5b6b8a",cursor:"pointer",fontFamily:"inherit"}}>{v==="map"?"Map":"Routes"}</button>
              ))}
            </div>
          </div>
          <div style={{flex:1,overflow:"hidden",position:"relative"}}>
            <div ref={mapRef} style={{width:"100%",height:"100%",display:cView==="map"?"block":"none"}}/>
            {cView==="map"&&(
              <>
                <div style={{position:"absolute",top:8,left:10,zIndex:1000,display:"flex",gap:5}}>
                  {[{c:"#10b981",l:"On Time",v:routes.filter(r=>["on-time","en-route"].includes(r.s)).length},{c:"#f59e0b",l:"Delayed",v:dl},{c:"#ef4444",l:"Disrupted",v:dis}].map((x,i)=>(
                    <div key={i} style={{background:"rgba(6,10,20,.92)",border:"1px solid rgba(255,255,255,.08)",borderRadius:6,padding:"4px 10px",fontSize:9,fontWeight:600,...mono,display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:x.c}}/>{x.v} {x.l}
                    </div>
                  ))}
                </div>
                <div style={{position:"absolute",bottom:10,left:10,zIndex:1000,background:"rgba(6,10,20,.92)",border:"1px solid rgba(255,255,255,.08)",borderRadius:7,padding:"8px 12px",fontSize:8,...sub}}>
                  <div style={{fontSize:7,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,...dim,marginBottom:4}}>Fleet & Data Sources</div>
                  {["🏟 Stadium","✈️ Airport","🏨 Team Hotel","🚌 Bus (40+)","🚐 Sprinter (12-20)","🚙 SUV (VIP)"].map((l,i)=>(
                    <div key={i} style={{marginBottom:2}}>{l}</div>
                  ))}
                  <div style={{marginTop:5,paddingTop:5,borderTop:"1px solid rgba(255,255,255,.06)",fontSize:7,...dim,...mono}}>
                    Traffic: TomTom Flow Tiles · HERE Routing
                  </div>
                  <div style={{fontSize:7,...dim,...mono}}>
                    Click city → real route calculations
                  </div>
                </div>
              </>
            )}
            {cView==="routes"&&(
              <div style={{overflowY:"auto",height:"100%"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>
                    {["Route","Origin → Dest","City","Type","Driver","Status","ETA","Traffic","Pax"].map(h=>(
                      <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:7,fontWeight:700,textTransform:"uppercase",letterSpacing:1,...dim,background:"#0c1222",borderBottom:"1px solid rgba(255,255,255,.08)",position:"sticky",top:0,zIndex:3}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.map(r=>(
                      <tr key={r.id} style={{borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                        <td style={{padding:"8px 10px",fontSize:9,color:"#3b82f6",...mono,fontWeight:600}}>{r.id}</td>
                        <td style={{padding:"8px 10px",fontSize:10}}>{r.fr} → {r.to}</td>
                        <td style={{padding:"8px 10px",fontSize:9,...sub}}>{r.city}</td>
                        <td style={{padding:"8px 10px",fontSize:10}}>{VI[r.vt]}</td>
                        <td style={{padding:"8px 10px",fontSize:9}}>{r.drv}</td>
                        <td style={{padding:"8px 10px"}}><span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 6px",borderRadius:3,fontSize:8,fontWeight:700,color:sclr[r.s],background:sbg[r.s]}}><span style={{width:4,height:4,borderRadius:"50%",background:"currentColor"}}/>{r.s.replace("-"," ")}</span></td>
                        <td style={{padding:"8px 10px",...mono,fontSize:10,fontWeight:600}}>{r.eta}m{r.dl>0&&<span style={{color:"#ef4444",fontSize:8,marginLeft:2}}>+{r.dl}</span>}</td>
                        <td style={{padding:"8px 10px",fontSize:9,fontWeight:600,color:r.t==="Severe"||r.t==="Heavy"?"#ef4444":r.t==="Moderate"?"#f59e0b":"#10b981"}}>{r.t}</td>
                        <td style={{padding:"8px 10px",fontSize:9,...mut,...mono}}>{r.pax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{background:"#0c1222",borderLeft:"1px solid rgba(255,255,255,.08)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
            {[{k:"feed",l:"Live Feed"},{k:"dis",l:"Disruptions"},{k:"drv",l:"Drivers"},{k:"ai",l:"AI Ops"}].map(t=>(
              <button key={t.k} onClick={()=>setRTab(t.k)} style={{flex:1,padding:"9px 3px",textAlign:"center",fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:.6,color:rTab===t.k?"#3b82f6":"#3a4e70",cursor:"pointer",border:"none",background:"none",borderBottom:rTab===t.k?"2px solid #3b82f6":"2px solid transparent",fontFamily:"inherit"}}>{t.l}</button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:7}}>
            {rTab==="feed"&&FEED.map((f,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:8,borderRadius:6,marginBottom:2,background:f.cls==="al"?"rgba(239,68,68,.1)":f.cls==="wa"?"rgba(245,158,11,.1)":"transparent",border:`1px solid ${f.cls==="al"?"rgba(239,68,68,.25)":f.cls==="wa"?"rgba(245,158,11,.22)":"transparent"}`}}>
                <div style={{width:26,height:26,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,background:f.t==="s"?"rgba(16,185,129,.12)":f.t==="w"?"rgba(245,158,11,.12)":"rgba(239,68,68,.12)"}}>{f.i}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:9,fontWeight:700}}>{f.h}</div><div style={{fontSize:8,...mut,lineHeight:1.4}}>{f.d}</div></div>
                <div style={{fontSize:7,...dim,...mono,whiteSpace:"nowrap"}}>{f.tm}</div>
              </div>
            ))}
            {rTab==="dis"&&[
              {sev:"CRITICAL",sc:"#ef4444",t:"Road Closure — Av. Insurgentes, Mexico City",d:"Police activity. 4 routes / 156 pax affected. Alt via Periférico.",meta:["📍 Azteca","🚌3 🚐1","👥156","⏱+25m"],tm:"7m"},
              {sev:"MODERATE",sc:"#f59e0b",t:"I-405 Congestion — SoFi, LA",d:"Multi-vehicle incident. LAX routes +15–20m delay.",meta:["📍 SoFi","🚌2 🚙1","👥112","⏱+18m"],tm:"19m"},
              {sev:"LOW",sc:"#3b82f6",t:"Construction — Gillette, Boston",d:"Lane reduction Rt 1. +5m for 2 sprinter routes.",meta:["📍 Gillette","🚐2","⏱+5m"],tm:"41m"},
            ].map((d,i)=>(
              <div key={i} style={{padding:10,borderRadius:8,border:`1px solid ${d.sc}33`,marginBottom:6,background:`linear-gradient(145deg,${d.sc}11,#121c30)`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:7,fontWeight:800,textTransform:"uppercase",letterSpacing:1,padding:"2px 6px",borderRadius:3,background:`${d.sc}1a`,color:d.sc}}>{d.sev}</span>
                  <span style={{fontSize:7,...dim,...mono}}>{d.tm}</span>
                </div>
                <div style={{fontSize:11,fontWeight:700,marginBottom:2}}>{d.t}</div>
                <div style={{fontSize:9,...mut,lineHeight:1.5,marginBottom:7}}>{d.d}</div>
                <div style={{display:"flex",gap:10,fontSize:8,...mut,...mono,marginBottom:7}}>{d.meta.map((m,j)=><span key={j}>{m}</span>)}</div>
                <div style={{display:"flex",gap:4}}>
                  <Btn primary onClick={()=>showToast("Routes rerouted")}>Auto-Reroute</Btn>
                  <Btn onClick={()=>showToast("Monitoring")}>Monitor</Btn>
                </div>
              </div>
            ))}
            {rTab==="drv"&&[
              {nm:"M. Rodriguez",in2:"MR",rt:"TRN-0012 · NY/NJ",st:"active",vt:"🚌",eta:"14m",tr:8,px:42,ra:4.9},
              {nm:"A. Tanaka",in2:"AT",rt:"TRN-0041 · Mexico City",st:"active",vt:"🚌",eta:"38m",tr:5,px:36,ra:4.8},
              {nm:"J. Smith",in2:"JS",rt:"TRN-0034 · Dallas",st:"active",vt:"🚐",eta:"22m",tr:6,px:16,ra:4.7},
              {nm:"S. Kim",in2:"SK",rt:"TRN-0056 · Toronto",st:"active",vt:"🚙",eta:"28m",tr:4,px:4,ra:4.5},
              {nm:"K. Okafor",in2:"KO",rt:"Standby · Houston",st:"standby",vt:"🚌",eta:"—",tr:7,px:0,ra:4.6},
            ].map((d,i)=>(
              <div key={i} style={{padding:10,borderRadius:8,border:"1px solid rgba(255,255,255,.08)",marginBottom:6,background:"#121c30"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",...mono}}>{d.in2}</div>
                  <div style={{flex:1}}><div style={{fontSize:10,fontWeight:700}}>{d.vt} {d.nm}</div><div style={{fontSize:8,...mut}}>{d.rt}</div></div>
                  <span style={{fontSize:7,fontWeight:700,padding:"2px 6px",borderRadius:3,background:d.st==="active"?"rgba(16,185,129,.12)":"rgba(100,116,139,.12)",color:d.st==="active"?"#10b981":"#94a3b8"}}>{d.st}</span>
                </div>
                <div style={{display:"flex",gap:4,marginBottom:8}}>
                  {[{v:d.eta,l:"ETA"},{v:d.tr,l:"Trips"},{v:d.px,l:"Pax"},{v:`★${d.ra}`,l:"Rate"}].map((s,j)=>(
                    <div key={j} style={{flex:1,background:"#060a14",padding:6,borderRadius:5,textAlign:"center"}}>
                      <div style={{...mono,fontSize:11,fontWeight:700}}>{s.v}</div>
                      <div style={{fontSize:6,...dim,textTransform:"uppercase",letterSpacing:.4,marginTop:1}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:4}}>
                  {["Message","Reroute","Alert"].map((a,j)=>(
                    <Btn key={j} small onClick={()=>showToast(`${a} → ${d.nm}`)}>{a}</Btn>
                  ))}
                </div>
              </div>
            ))}
            {rTab==="ai"&&[
              {badge:"Decision Required",pri:"● HIGH",pc:"#ef4444",t:"Mexico City — Azteca Reroute",d:"Insurgentes closure. 3 buses + 1 sprinter / 156 pax. Routes analyzed via HERE API:",opts:[{t:"Periférico Sur → Calz. Tlalpan",e:"+12m",ec:"#10b981"},{t:"Circuito Interior → Div. del Norte",e:"+8m ★",ec:"#10b981",sel:true},{t:"Eje Central → Viaducto",e:"+19m",ec:"#f59e0b"}]},
              {badge:"Capacity Alert",pri:"● MED",pc:"#f59e0b",t:"LA — SoFi Pre-Match Surge",d:"Group D in 90m. Need 4 buses + 2 sprinters + 2 SUVs:",opts:[{t:"Deploy all 8 now",e:"Optimal",ec:"#10b981",sel:true},{t:"Stagger 4+4 at T-45",e:"Moderate",ec:"#f59e0b"},{t:"Wait T-30",e:"Risky",ec:"#ef4444"}]},
            ].map((d,i)=>(
              <div key={i} style={{padding:12,borderRadius:8,border:"1px solid rgba(139,92,246,.22)",background:"linear-gradient(145deg,rgba(139,92,246,.1),#121c30)",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                  <span style={{fontSize:7,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",padding:"2px 6px",borderRadius:3,background:"rgba(139,92,246,.12)",color:"#8b5cf6",...mono}}>{d.badge}</span>
                  <span style={{marginLeft:"auto",fontSize:8,fontWeight:700,color:d.pc}}>{d.pri}</span>
                </div>
                <div style={{fontSize:11,fontWeight:700,marginBottom:4}}>{d.t}</div>
                <div style={{fontSize:9,...sub,lineHeight:1.5,marginBottom:9}}>{d.d}</div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {d.opts.map((o,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:5,border:`1px solid ${o.sel?"rgba(139,92,246,.3)":"rgba(255,255,255,.08)"}`,background:o.sel?"rgba(139,92,246,.08)":"#121c30",cursor:"pointer"}}>
                      <div style={{width:12,height:12,borderRadius:"50%",border:`2px solid ${o.sel?"#8b5cf6":"#3a4e70"}`,background:o.sel?"#8b5cf6":"transparent",boxShadow:o.sel?"inset 0 0 0 2px #121c30":"none"}}/>
                      <span style={{fontSize:9,fontWeight:600,flex:1}}>{o.t}</span>
                      <span style={{fontSize:8,color:o.ec,...mono}}>{o.e}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>showToast("Applied — drivers notified")} style={{marginTop:8,width:"100%",padding:7,borderRadius:5,background:"#8b5cf6",color:"#fff",border:"none",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Apply & Notify Drivers</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.13);border-radius:2px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        .leaflet-container{background:#060a14!important}
        .leaflet-popup-content-wrapper{background:#0c1222!important;color:#eef1f8!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:10px!important;box-shadow:0 6px 24px rgba(0,0,0,.5)!important}
        .leaflet-popup-tip{background:#0c1222!important}
        .leaflet-popup-content{margin:8px 12px!important;color:#eef1f8!important}
        .leaflet-control-zoom a{background:#0c1222!important;color:#8fa0c0!important;border-color:rgba(255,255,255,.1)!important}
        .leaflet-control-zoom a:hover{background:#121c30!important}
      `}</style>
    </div>
  );
}
