# 📊 Guia de Implementação de Pixels e Analytics
## Espaço Labelle - Rastreamento e Conversões

---

## 🎯 **ONDE COLAR OS CÓDIGOS**

### 📍 **1. PIXELS NO `<HEAD>` (Maioria dos casos)**
**Local:** Entre as linhas marcadas no arquivo `index.html`

```html
<!-- 🎯 SEUS PIXELS AQUI - COLE ABAIXO DESTA LINHA -->
[COLE AQUI SEUS CÓDIGOS]
<!-- 🎯 SEUS PIXELS AQUI - COLE ACIMA DESTA LINHA -->
```

### 📍 **2. PIXELS NO `<BODY>` (GTM e Facebook)**
**Local:** Logo após a tag `<body>` no arquivo `index.html`

```html
<!-- 🎯 SEUS PIXELS BODY AQUI - COLE ABAIXO DESTA LINHA -->
[COLE AQUI CÓDIGOS DE BODY]
<!-- 🎯 SEUS PIXELS BODY AQUI - COLE ACIMA DESTA LINHA -->
```

---

## 🔧 **PIXELS SUPORTADOS**

### ✅ **Google Analytics 4 (GA4)**
**Onde colar:** HEAD
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

### ✅ **Facebook Pixel**
**Onde colar:** HEAD + BODY
```html
<!-- HEAD -->
<script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'SEU_PIXEL_ID');
    fbq('track', 'PageView');
</script>

<!-- BODY -->
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=SEU_PIXEL_ID&ev=PageView&noscript=1" /></noscript>
```

### ✅ **Google Tag Manager**
**Onde colar:** HEAD + BODY
```html
<!-- HEAD -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- BODY -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

### ✅ **Google Ads**
**Onde colar:** HEAD
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-XXXXXXXXX');
</script>
```

### ✅ **TikTok Pixel**
**Onde colar:** HEAD
```html
<script>
    !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('SEU_PIXEL_ID');
        ttq.page();
    }(window, document, 'ttq');
</script>
```

---

## 🎯 **EVENTOS DE CONVERSÃO AUTOMÁTICOS**

O site já está configurado para disparar eventos automaticamente:

### ✅ **Eventos Implementados:**

1. **📱 WhatsApp - Botão Flutuante**
   - **Evento:** `WhatsApp_Contact`
   - **Categoria:** `Lead`
   - **Label:** `Float_Button`

2. **📋 Formulário de Contato**
   - **Evento:** `WhatsApp_Contact`
   - **Categoria:** `Lead`
   - **Label:** `Form_Submission`

3. **📱 Redes Sociais**
   - **Evento:** `Social_Media_Click`
   - **Categorias:** `Instagram`, `Facebook`, `WhatsApp`

4. **🗺️ Mapa/GPS**
   - **Evento:** `Maps_Open`
   - **Categoria:** `Engagement`

### ✅ **Conversões Específicas:**

- **Facebook:** `Lead` e `Contact`
- **Google Ads:** `conversion` com valor em BRL
- **TikTok:** `Contact` e `ClickButton`
- **GA4:** Eventos personalizados

---

## 🔧 **CONFIGURAÇÃO DO GOOGLE ADS**

Para rastrear conversões do Google Ads:

1. **No arquivo `js/main.js`, linha ~487:**
```javascript
'send_to': 'AW-XXXXXXXXX/XXXXXXXXX', // 🎯 SUBSTITUA PELO SEU ID
```

2. **Substitua por:**
```javascript
'send_to': 'AW-SEU_ID/SUA_CONVERSAO',
```

---

## 📊 **ESTRUTURA DE DADOS**

### **Eventos de Formulário:**
```javascript
{
    event_category: 'conversion',
    service: 'cabelo', // ou outro serviço
    source: 'website_form',
    value: 1.0,
    currency: 'BRL'
}
```

### **Eventos de WhatsApp:**
```javascript
{
    event_category: 'conversion',
    source: 'float_button', // ou 'form_submission'
    contact_method: 'whatsapp'
}
```

---

## 🎯 **TESTANDO OS PIXELS**

### **1. Google Analytics:**
- Acesse: analytics.google.com
- Vá em "Tempo Real" → "Eventos"
- Teste os botões do site

### **2. Facebook Pixel:**
- Instale: Facebook Pixel Helper (extensão Chrome)
- Acesse o site e veja se aparece verde
- Teste eventos no Events Manager

### **3. Google Ads:**
- Acesse: ads.google.com
- Vá em "Ferramentas" → "Conversões"
- Aguarde até 24h para aparecer

### **4. Console do Navegador:**
- Pressione F12
- Aba "Console"
- Todos os eventos aparecem com 📊

---

## 🚀 **PASSO A PASSO PARA IMPLEMENTAR**

### **1. Pegue seus códigos:**
- Google Analytics: analytics.google.com
- Facebook: business.facebook.com → Events Manager
- Google Ads: ads.google.com → Conversões
- TikTok: ads.tiktok.com → Events

### **2. Cole no local correto:**
- Maioria: HEAD (entre as linhas marcadas)
- GTM/Facebook: HEAD + BODY

### **3. Configure IDs:**
- Substitua "XXXXXXXXX" pelos seus IDs reais
- Google Ads: configure linha ~487 do main.js

### **4. Teste:**
- Acesse o site
- Clique nos botões
- Verifique se eventos aparecem nas plataformas

---

## ⚠️ **IMPORTANTE**

- **Não remova** as linhas de comentário com marcações
- **Teste sempre** em modo de depuração primeiro
- **Aguarde 24-48h** para dados aparecerem
- **Use Google Tag Manager** se tiver muitos pixels

---

## 🆘 **SUPORTE**

Se tiver dúvidas:
1. Pressione F12 → Console
2. Veja se aparecem os logs com 📊
3. Teste em modo anônimo do navegador
4. Verifique se os IDs estão corretos

**✅ Todos os pixels serão automaticamente integrados com os eventos do site!**

---

*Desenvolvido com 💖 para o Espaço Labelle*