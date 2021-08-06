const Dataload = {
    soulbinds:0,
    conduits:0,
    talents:0,
    index:0
};
var fetchedOnce = false;
var bosschosen = window.localStorage.getItem('boss');
var spechosen = window.localStorage.getItem('spe');
var biu;
var siu;
var c = "";
var s = "";
var cs = "";
if(bosschosen!=null)
{
    bosschosen = JSON.parse(bosschosen);
    biu = "/wp-content/wow-images/encounters/"+bosschosen.id+".png";
    
}
else biu = "/wp-content/wow-images/b_default.png";
if(spechosen!=null)
{
    spechosen = JSON.parse(spechosen);
    siu = "/wp-content/wow-images/specs/"+spechosen.classname+"_"+spechosen.specname+".png";
    c = spechosen.classname;
    s = spechosen.specname;
    cs = spechosen.classespe;
    var sct = document.getElementById("spec-choice-text");
    if(!sct.classList.contains("choix"))sct.classList.add("choix");
}
else siu = "/wp-content/wow-images/b_default.png";

const SpecApp = {
    data() {
        return{
            preloaded:false,
            soulbinds:null,
            talents:null,
            conduits:null,
            bossman:bosschosen, // index_data.encounters[0]
            index: null, // index_data.encounters 
            loaded:false, 
            talentCombos:null,
            specImageUrl:siu,
            bossImageUrl:biu, //
            classespe:cs,
            classname:c,
            specname:s,
            loadingAnim:true,
        }
    },
    methods:{
        spec:function(event,classname,specname)
        {
            var element = document.getElementById("text-spec-chosen");
            //element.innerHTML = classname+" - "+specname;
            this.classname!=""?element.classList.remove(this.classname.toLowerCase()):null;
            element.classList.add(classname.toLowerCase());
            this.classname = classname;
            this.specname = specname;
            setFRNames(this.index.specs,classname,specname);
            window.localStorage.setItem('spe',JSON.stringify({"classname":classname,"specname":specname,"classespe":this.classespe}));
            fetchRanking();
            var sct = document.getElementById("spec-choice-text");
            if(!sct.classList.contains("choix"))sct.classList.add("choix");
            this.specImageUrl = "/wp-content/wow-images/specs/"+classname+"_"+specname+".png";
            window.location.href = "#";
            
        },
        boss:function(event,id,name){
            var element = document.getElementById("text-boss-chosen");
            element.innerHTML = name;
            this.bossImageUrl = "/wp-content/wow-images/encounters/"+id+".png";
            this.bossman = {"id":id,"name":name};
            window.localStorage.setItem('boss',JSON.stringify(this.bossman));
            fetchRanking();
            
        },
        toggleConduits:function(index){
            var el = document.getElementById("detail-"+index);
            el.style.display = el.style.display==="none"?"":"none";
        },
        
    },
    computed:{
        showDateTime(){
            return new Date(this.index.when*1000).toLocaleString('fr-FR', Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
    }

}
const SpecsPlayed = Vue.createApp(SpecApp).mount('#mainvue');
console.log(SpecsPlayed);
fetch('/wp-content/wcl-data/talents.json').then(response => { if(!response.ok){throw new Error('talent net');}
return response.json();}).then(json => {
    dispatch("talents",json);
});
fetch('/wp-content/wcl-data/index.json').then(response => { if(!response.ok){throw new Error('network shits the bed');}
return response.json();}).then(json => {
    dispatch("index",json);
});
fetch('/wp-content/wcl-data/conduits.json').then(response => { if(!response.ok){throw new Error('talent net');}
return response.json();}).then(json => {
    dispatch("conduits",json);
});
fetch('/wp-content/wcl-data/soulbinds.json').then(response => { if(!response.ok){throw new Error('soulbinds net');}
return response.json();}).then(json => {
    dispatch("soulbinds",json);
});

function dispatch(datatype, json){
    if(Dataload.hasOwnProperty(datatype))
    {
        Dataload[datatype] = 1;
        SpecsPlayed[datatype] = json;

        if(datatype=="index"&&SpecsPlayed.bossman==null)
        {
            SpecsPlayed.bossman = json.encounters[0];
            SpecsPlayed.bossImageUrl = "/wp-content/wow-images/encounters/"+json.encounters[0].id+".png";
        }
        Object.values(Dataload).forEach(value => {
            if(value==0){
                return;
            }
        });
        SpecsPlayed.preloaded = true;
        SpecsPlayed.loadingAnim = false;
        if(fetchedOnce==false&&SpecsPlayed.specname!=null&&SpecsPlayed.specname!="")
        {
            console.log("coming here very often ?")
            fetchRanking();
            fetchedOnce = true;
        }   
    }
}
function fetchRanking(){
    SpecsPlayed.loaded = false;
    SpecsPlayed.loadingAnim = true;
    fetch('/wp-content/wcl-data/data/'+SpecsPlayed.bossman.id+'-'+SpecsPlayed.classname+'-'+SpecsPlayed.specname+'.json').then(response => 
    {
        if(!response.ok)
        {
            throw new Error('network out')
        }
        return response.json();

    }).then(json =>{
        SpecsPlayed.talentCombos = json;
        SpecsPlayed.loaded=true;
        SpecsPlayed.loadingAnim=false;
    });
}
function setFRNames(specs,classname,specname){
    specs.forEach(element => {
        if(element.className==classname&&element.specName==specname)
        {
            SpecsPlayed.classespe = element.classe +" - " + element.spe;
        }   
    });
}

