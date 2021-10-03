window.addEventListener("load",bindEvents);
function bindEvents(){
    document.querySelector('#searchTxt').addEventListener('change', search);
    document.querySelector('#search').addEventListener('click', showHideSearchBar);
    document.querySelector('#add').addEventListener('click',addRecord);
    document.querySelector('#remove').addEventListener('click', deleteRecords);
    document.querySelector('#update').addEventListener('click', updateRecord);
    document.querySelector('#sort').addEventListener('click',sortByPrice);
    document.querySelector('#save').addEventListener('click', saveRecords);
    document.querySelector('#load').addEventListener('click', loadRecords);
}
let count=0;
function addRecord(){
    var item=new Item();
    for(let key in item)
    {
        item[key]=document.querySelector('#'+key).value;
    }
    count=count+1;
    itemOperations.add(item);
    printRecord(item);
    console.log('Item Object is',item);
    console.log('Total Records',count);
}
function printRecord(item){
    var tbody=document.querySelector('#items');
    var tr=tbody.insertRow();
    var index=0;
    for(let key in item){
        let cell=tr.insertCell(index);
        cell.innerText=item[key];
        index++;
    }

    var lastTD=tr.insertCell(index);
    lastTD.appendChild(createIcon('fas fa-trash mr-2',trash,item.id));
    lastTD.appendChild(createIcon('fas fa-edit',edit,item.id));
}

function createIcon(className,fn,id)
{
    var iTag=document.createElement("i");
    iTag.className=className;
    iTag.addEventListener('click',fn);
    iTag.setAttribute('data-itemid',id);

    return iTag;
}

function showTotal(){
    document.querySelector('#total').innerText=itemOperations.items.length;
    document.querySelector('#mark').innerText = itemOperations.countTotalMark();
    document.querySelector('#unmark').innerText = itemOperations.items.length-itemOperations.countTotalMark();
}

function init(){
    showTotal();
    bindEvents();
    showHideSearchBar();
}

function trash(){
    let id=this.getAttribute('data-itemid');
    itemOperations.markUnmark(id);
    showTotal();
    let tr=this.parentNode.parentNode;
    tr.classList.toggle('alert-danger');
    console.log("I am Trash",this.getAttribute('data-itemid'))
}

function deleteRecords(){
    var items=itemOperations.remove();
    printTable(items);
}

function printTable(items){
    var tbody=document.querySelector('#items');
    tbody.innerHTML='';
    items.forEach(item=>printRecord(item));
    showTotal();
}

function search(){
    var val=document.querySelector('#searchTxt').value;
    var key = document.querySelector('#searchby').value;
    var items = itemOperations.searchAll(key,val);
    printTable(items);
}

const showHideSearchBar= ()=> document.querySelector('#searchBar').classList.toggle('hide');

var itemObject;

function edit(){
    var id=this.getAttribute('data-itemid');
    itemObject=itemOperations.search(id);
    fillFields();
    console.log("I am Edit",this.getAttribute('data-itemid'));
}

function fillFields(){
    for(let key in itemObject){
        if(key=='isMarked'){
            continue;
        }
        document.querySelector('#'+key).value=itemObject[key];
    }
}

function updateRecord(){
    for(let key in itemObject){
        if(key=='isMarked'){
            continue;
        }
        itemObject[key]=document.querySelector('#'+key).value;
    }
    printTable(itemOperations.items);
}

const sortByPrice=()=>printTable(itemOperations.sortByPrice());

function saveRecords(){
    if(localStorage){
        localStorage.myitems=JSON.stringify(itemOperations.items);
        alert("Data Store....")
    }
    else{
        alert("No Local Storage Feature is Supported in Ur Browser...")
    }
}

function loadRecords(){
    if(localStorage){
    if(localStorage.myitems){
        itemOperations.items=JSON.parse(localStorage.myitems);
        printTable(itemOperations.items);
    }
    else{
        alert("No Data to Load....");
    }
    }
    else{   
        alert("No Local Storage Feature is Supported in Ur Browser...");
    }
}

