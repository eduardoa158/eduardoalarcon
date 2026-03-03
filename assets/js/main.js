document.querySelector('.hamb')?.addEventListener('click',()=>document.querySelector('.menu')?.classList.toggle('open'));
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelectorAll('.tilt').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg)`});el.addEventListener('mouseleave',()=>el.style.transform='')});
