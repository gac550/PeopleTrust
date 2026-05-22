// Valentina sales doctrine VAL-01..VAL-12 — script compartido entre maquetas.
// Voz locked en MVP (decisión user 2026-05-21): voz solo plan Pro vía ElevenLabs.
// API pública: window.Valentina = { reply(msg), bindChat(opts), bindMic(btn) }
//
// TD-06: lee ?theme=<light|dark> del query string y aplica al <html>.
(function(){
  try {
    const t = new URL(location.href).searchParams.get('theme');
    if(t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  } catch(e){}
})();
(function(){
  function reply(msg){
    const m=(msg||'').toLowerCase();
    if(/caro|much[oa] (plata|dinero)|no (tengo|me alcanza|puedo pagar)/.test(m))
      return `Te entiendo. Una mala contratación cuesta <b>6 a 12 sueldos</b>. Pro a $49/mes paga UNA evaluación que evite ese error. Y el plan <b>Free</b> da 10 evals/mes <i>sin tarjeta</i>.`;
    if(/ahora no|m[aá]s adelante|despu[eé]s|otro momento/.test(m))
      return `Sin apuro. ¿Te dejo material en mail y te escribo en 2 semanas? Hablar conmigo siempre es gratis.`;
    if(/(tengo|tenemos) que (consultar|hablar)|no (decido|soy yo)|jefe|equipo/.test(m))
      return `Perfecto, te paso material para llevarle al equipo. ¿Coordinamos demo de 30 min con quien decide?`;
    if(/c[oó]mo (me )?registr|empezar|crear cuenta|trial|probar/.test(m))
      return `¡Vamos! <a href="https://argos.vecttore.com" class="text-violet-400 underline font-medium">argos.vecttore.com</a> · 30 segundos · plan Free sin tarjeta.`;
    if(/precio|costo|cuanto|cu[aá]l plan|plan|cobr/.test(m))
      return `<b>Free</b> $0 — 10 evals/mes · <b>Pro</b> $49/mes — 200 evals + voz Valentina (ElevenLabs) · <b>Enterprise</b> custom. ¿Para qué proceso lo querés usar?`;
    if(/evaluar|candidato|t[eé]cnic|liderazg|reclutar|contratar/.test(m))
      return `Genial. ¿Cuántos procesos/mes manejás y qué rol más frecuente? Así te recomiendo el plan justo (sin venderte de más).`;
    if(/turnover|mala contrataci[oó]n|equivoc|salida|renunci/.test(m))
      return `Pasa más de lo que se cree. Sigmund (personalidad) + Smith (laboral) bajan ese error fuerte. ¿Querés que te cuente cómo?`;
    if(/qui[eé]nes? son|nosotros|equipo|argos|peopletrust|qu[eé] (son|hacen)/.test(m))
      return `PeopleTrust 🇨🇱 — evaluación psicolaboral con agentes IA + supervisión humana. Equipo: Valentina (yo), Sigmund, Smith, Miyagi, Matusalem, Albert + guardrails Themis y Hygea.`;
    if(/seguro|datos|privacidad|legal|compliance/.test(m))
      return `Supabase con RLS multi-tenant. Cumplimos Ley 19.628 (Chile) + RGPD-equivalente. Ningún agente da diagnóstico clínico (humanos firman handoffs).`;
    if(/voz|hablar|micr[oó]fono|elevenlabs/.test(m))
      return `La voz natural (ElevenLabs) es parte del plan <b>Pro</b>. En el plan Free conversamos por texto, gratis siempre. ¿Te interesa Pro?`;
    if(/contact|humano|persona|hablar con alguien|llamar|ventas|email|mail/.test(m))
      return `Escribime a <a href="mailto:hola@peopletrust.cl" class="text-violet-400 underline">hola@peopletrust.cl</a> o dejame tu mail. Respondemos en <24h hábiles.`;
    if(/no entiendo|no me queda claro|qu[eé]\?/.test(m))
      return `Lo digo simple: somos como un equipo RRHH IA que ayuda a no equivocarte al contratar. ¿Qué parte profundizo?`;
    if(/^(hola|hi|hey|buen|qu[eé] tal)/.test(m))
      return `¡Hola! Soy Valentina 👋 Contame qué te trae. Hablar conmigo es <b>gratis siempre</b>.`;
    return `Te ayudo con: evaluaciones, precios, equipo, contacto. ¿Cuál te sirve?`;
  }
  function bindMic(btn){
    if(!btn) return;
    btn.addEventListener('click', () => {
      const evt = new CustomEvent('valentina:say', { detail: 'La voz es parte del plan <b>Pro</b> (ElevenLabs). En Free conversamos por texto, gratis siempre 💬' });
      document.dispatchEvent(evt);
    });
  }
  window.Valentina = { reply, bindMic };
})();
