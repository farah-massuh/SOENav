let user = localStorage.getItem("userData");
let a = document.getElementById('courseDataParent');
//Comment this out using multi-line comment. You can use this to get all course list on webreg
let y = [];
if (!a) y = [];
    else{
        let i = 0;
        Array.from(a.children).forEach(child => {
        if (child.id) {
            let uv = `${child.id.substring(12,22)}.${i}.courseMetadata.title`;
            console.log(uv);
            let diva = document.getElementById(uv) ? document.getElementById(uv).textContent : '';
            y.push(child.id.substring(12,22)+ " : "+ diva);
            i++;
        }
    });
    }
    

console.log(y);
let s = '';
for(let i of y){
    s+= `\n<option> ${i} </option>`
}
console.log(s);