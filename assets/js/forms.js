function sendMailto(form){
  const d=new FormData(form);
  const tipo=d.get('tipo')||'Consulta';
  const subject=encodeURIComponent(`[${tipo}] ${d.get('asunto')||'Contacto web'}`);
  const body=encodeURIComponent(`Nombre: ${d.get('nombre')||''}\nEmail: ${d.get('email')||''}\nTipo: ${tipo}\n\nMensaje:\n${d.get('mensaje')||''}`);
  window.location.href=`mailto:latamdigitalvision@gmail.com?subject=${subject}&body=${body}`;
}
document.querySelectorAll('form[data-mailto]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();sendMailto(f)}));
