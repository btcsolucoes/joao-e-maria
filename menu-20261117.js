const dishes = [
  ['buffet','Carnes e preparos','Carne de panela','Cozida lentamente, com molho encorpado e tempero caseiro.'],
  ['buffet','Carnes e preparos','Frango assado','Dourado no forno, com temperos de casa.'],
  ['buffet','Carnes e preparos','Carne de sol acebolada','Carne de sol com cebolas douradas.'],
  ['buffet','Carnes e preparos','Costelinha de porco','Costelinha assada, macia e bem temperada.'],
  ['buffet','Carnes e preparos','Frango ensopado','Frango de panela com molho caseiro.'],
  ['buffet','Carnes e preparos','Peixe ao molho','Peixe preparado em molho de temperos e legumes.'],
  ['buffet','Acompanhamentos','Arroz branco','Soltinho, para acompanhar os seus sabores favoritos.'],
  ['buffet','Acompanhamentos','Feijão preto','Feijão de panela com caldo bem temperado.'],
  ['buffet','Acompanhamentos','Feijão tropeiro','Feijão, farinha, ovos e cheiro-verde.'],
  ['buffet','Acompanhamentos','Arroz de forno','Arroz levado ao forno com acompanhamentos.'],
  ['buffet','Acompanhamentos','Macaxeira cozida','Macaxeira macia, um clássico da nossa mesa.'],
  ['buffet','Acompanhamentos','Farofa da casa','Farinha douradinha para completar o prato.'],
  ['buffet','Acompanhamentos','Couve refogada','Couve cortada fininha e refogada.'],
  ['buffet','Acompanhamentos','Legumes cozidos','Uma seleção de legumes para o almoço.'],
  ['saladas','Folhas e vegetais','Salada de folhas','Folhas frescas para começar a montar o prato.'],
  ['saladas','Folhas e vegetais','Tomate com cebola','Uma combinação fresca e simples.'],
  ['saladas','Folhas e vegetais','Cenoura ralada','Cenoura fresca, ralada fininha.'],
  ['saladas','Folhas e vegetais','Beterraba cozida','Beterraba cozida e cortada.'],
  ['saladas','Para acompanhar','Vinagrete','Tomate, cebola e cheiro-verde.'],
  ['saladas','Para acompanhar','Salada de batata','Batatas cozidas em uma salada cremosa.'],
  ['bebidas','Sucos','Suco de acerola','A refrescância da acerola para acompanhar o almoço.'],
  ['bebidas','Sucos','Suco de cajá','O sabor marcante de uma fruta regional.'],
  ['bebidas','Sucos','Suco de graviola','Uma opção de sabor suave e tropical.'],
  ['bebidas','Geladas','Água mineral','Com ou sem gás.'],
  ['bebidas','Geladas','Refrigerantes','Consulte as opções disponíveis.'],
  ['bebidas','Para finalizar','Café coado','Um café depois do almoço.'],
  ['doces','Clássicos','Pudim de leite','Pudim de leite com calda de caramelo.'],
  ['doces','Clássicos','Doce de leite','Um clássico para adoçar a pausa.'],
  ['doces','Caseiros','Doce de abóbora','Doce de abóbora em preparo caseiro.'],
  ['doces','Caseiros','Banana caramelizada','Banana com calda caramelizada.'],
  ['doces','Leves','Frutas da estação','Uma opção de fruta para fechar o almoço.']
];
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let active='buffet';
const selections={buffet:'Proteínas',bebidas:'Sucos',doces:'Doces'};
let subtype='Todos';
const buffetGroups=[
  ['Proteínas','Bovinas'],['Proteínas','Aves'],['Proteínas','Bovinas'],
  ['Proteínas','Suínas'],['Proteínas','Aves'],['Proteínas','Peixes'],
  ['Bases','Arrozes'],['Bases','Feijões'],['Bases','Feijões'],
  ['Bases','Arrozes'],['Bases','Raízes'],['Acompanhamentos','Farofas'],
  ['Guarnições','Verduras'],['Guarnições','Legumes']
];
dishes.forEach(([originalTab,originalGroup,name,description],index)=>{
  const tab=originalTab==='saladas'?'buffet':originalTab;
  let group=originalGroup,kind='';
  if(originalTab==='buffet') [group,kind]=buffetGroups[index];
  if(originalTab==='saladas') group='Saladas';
  if(originalTab==='bebidas') group=originalGroup==='Sucos'?'Sucos':originalGroup==='Geladas'?'Águas e refrigerantes':'Café';
  if(originalTab==='doces') group=originalGroup==='Leves'?'Frutas':'Doces';
  const item=document.createElement('article');item.className='dish';
  item.dataset.group=group;item.dataset.kind=kind;
  item.dataset.search=normalize(name+' '+description+' '+group+' '+kind);
  const tag=document.createElement('span');tag.className='dish-group';tag.textContent=kind||group;
  const title=document.createElement('h3');title.textContent=name;
  const copy=document.createElement('p');copy.textContent=description;item.append(tag,title,copy);
  if(['bebidas','doces'].includes(tab)){const price=document.createElement('span');price.className='item-price';price.textContent='Consulte o valor';item.append(price);}
  document.querySelector(`[data-list="${tab}"]`).append(item);
});
const categories={buffet:['Proteínas','Bases','Guarnições','Saladas','Acompanhamentos'],bebidas:['Sucos','Águas e refrigerantes','Café'],doces:['Doces','Frutas']};
for(const [tab,labels] of Object.entries(categories)){
  let group=document.querySelector(`[data-categories="${tab}"]`);
  if(!group){group=document.createElement('div');group.className='filter-group categories';group.setAttribute('role','group');group.setAttribute('aria-label',tab==='bebidas'?'Categorias de bebidas':'Categorias de sobremesas');document.querySelector(`[data-list="${tab}"]`).before(group);}
  labels.forEach(label=>{const button=document.createElement('button');button.textContent=label;button.type='button';button.setAttribute('aria-pressed',String(selections[tab]===label));button.addEventListener('click',()=>{selections[tab]=label;subtype='Todos';document.getElementById('search').value='';group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderSubtypes();applyFilter();});group.append(button);});
}
function renderSubtypes(){
  const container=document.getElementById('buffet-subcategories');container.replaceChildren();
  const kinds=selections.buffet==='Proteínas'?['Bovinas','Aves','Suínas','Peixes']:selections.buffet==='Bases'?['Arrozes','Feijões','Raízes']:[];
  container.hidden=!kinds.length;
  if(kinds.length) ['Todos',...kinds].forEach(kind=>{const button=document.createElement('button');button.textContent=kind;button.type='button';button.setAttribute('aria-pressed',String(kind===subtype));button.addEventListener('click',()=>{subtype=kind;document.getElementById('search').value='';renderSubtypes();applyFilter();});container.append(button);});
}
function applyFilter(){
  const query=normalize(document.getElementById('search').value.trim());let count=0;
  document.querySelectorAll(`#panel-${active} .dish`).forEach(item=>{
    const visible=query?item.dataset.search.includes(query):item.dataset.group===selections[active]&&(active!=='buffet'||subtype==='Todos'||item.dataset.kind===subtype);
    item.hidden=!visible;if(visible)count++;
  });
  document.getElementById('selection-label').textContent=query?'Resultados no self-service':selections.buffet+(subtype!=='Todos'?' · '+subtype:'');
  document.querySelectorAll(`#panel-${active} .filter-group`).forEach(group=>{group.style.display=query?'none':'';});
  document.getElementById('result-count').textContent=`${count} ${count===1?'opção':'opções'}`;
  document.getElementById('empty').hidden=count>0||active==='casa';document.getElementById('clear-search').hidden=!query;scheduleScatter();
}
function selectTab(tab,scroll=false){active=tab;document.querySelectorAll('[data-tab]').forEach(button=>{const selected=button.dataset.tab===active;button.setAttribute('aria-selected',selected);button.tabIndex=selected?0:-1;});document.querySelectorAll('.menu-panel').forEach(panel=>panel.hidden=panel.id!==`panel-${active}`);document.querySelector('.search-row').hidden=active==='casa';applyFilter();if(scroll)document.getElementById('menu').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>selectTab(button.dataset.tab,true)));
document.querySelector('[role=tablist]').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...document.querySelectorAll('[data-tab]')];const index=tabs.indexOf(document.activeElement);const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();selectTab(tabs[next].dataset.tab);tabs[next].scrollIntoView({block:'nearest',inline:'nearest'});});
document.getElementById('search').addEventListener('input',applyFilter);document.getElementById('clear-search').addEventListener('click',()=>{document.getElementById('search').value='';applyFilter();document.getElementById('search').focus();});
document.getElementById('copy-address').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText('Rua do Apolo, 107');status.textContent='Endereço copiado.';}catch{status.textContent='Rua do Apolo, 107 — selecione o endereço para copiar.';}});
// Irregular placements are generated once per page, not a repeating background tile.
const placements=Array.from({length:35},(_,i)=>({side:i%2,offset:Math.random(),y:Math.random(),angle:Math.random()*44-22,size:100+Math.random()*65,person:i%3===0?'maria':'joao'}));
let frame;
function scheduleScatter(){cancelAnimationFrame(frame);frame=requestAnimationFrame(scatter);}
function scatter(){
  const layer=document.getElementById('characters');
  const start=document.querySelector('.hero').offsetHeight+100;
  const height=document.body.scrollHeight;
  const width=document.documentElement.clientWidth;
  const mobile=width<650;
  layer.replaceChildren();
  for(let i=0;i<placements.length;i++){
    const p=placements[i],top=start+i*(mobile?200:180)+p.y*80;
    if(top>height-150)break;
    const el=document.createElement('span');
    el.className=`character scattered ${p.person}`;
    el.style.top=top+'px';
    el.style.setProperty('--size',(mobile?p.size*.7:p.size)+'px');
    el.style.setProperty('--rotation',p.angle+'deg');
    const left=p.side ? width-(mobile?70:Math.max(130,(width-980)/2)*p.offset+110) : -35+p.offset*(mobile?40:Math.max(40,(width-1000)/2));
    el.style.left=left+'px';
    layer.append(el);
  }
}
const backTop=document.querySelector('.back-top');
function updateBackTop(){backTop.classList.toggle('is-visible',window.scrollY>window.innerHeight);}
window.addEventListener('scroll',updateBackTop,{passive:true});updateBackTop();
window.addEventListener('resize',scheduleScatter);window.addEventListener('load',scheduleScatter);renderSubtypes();applyFilter();
