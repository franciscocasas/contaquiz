// Run: node scripts/gen-mayor.js
// Generates public/data/mayor.json with verified math

function calc(asientos, cuentaPregunta, tipoSaldo) {
  const entries = asientos.filter((a) => a.cuenta === cuentaPregunta || cuentaPregunta === "__all__");
  let d = 0, h = 0;
  for (const a of entries) { d += a.debe; h += a.haber; }
  const saldo = tipoSaldo === "deudor" ? d - h : h - d;
  return { saldo_debe: d, saldo_haber: h, saldo_final: saldo };
}

// Build exercises with auto-calculated totals
function ex(id, nivel, titulo, cuenta_pregunta, tipo_saldo, asientos, distractores) {
  let sd = 0, sh = 0;
  for (const a of asientos) { sd += a.debe; sh += a.haber; }
  const saldo_final = tipo_saldo === "deudor" ? sd - sh : sh - sd;
  return {
    id, nivel, titulo, cuenta_pregunta,
    asientos: asientos.map(({ ref, descripcion, debe, haber }) => ({ ref, descripcion, debe, haber })),
    saldo_debe: sd,
    saldo_haber: sh,
    saldo_final,
    tipo_saldo,
    opciones_distractor: distractores
  };
}

const data = [
  // ─── BÁSICOS ──────────────────────────────────────────────────────────────
  ex("m001","basico","Caja — empresa comercial (apertura y operaciones básicas)","Caja","deudor",[
    {ref:"A1",descripcion:"Aporte de capital en efectivo",debe:1000000,haber:0},
    {ref:"A2",descripcion:"Compra de mercadería al contado",debe:0,haber:350000},
    {ref:"A3",descripcion:"Venta al contado",debe:500000,haber:0},
    {ref:"A4",descripcion:"Pago de alquiler del mes",debe:0,haber:80000},
  ],[430000,1500000,950000]),

  ex("m002","basico","Clientes — ventas a crédito y cobros","Clientes","deudor",[
    {ref:"A1",descripcion:"Venta a crédito N°001",debe:800000,haber:0},
    {ref:"A2",descripcion:"Venta a crédito N°002",debe:450000,haber:0},
    {ref:"A3",descripcion:"Cobro cliente N°001",debe:0,haber:600000},
    {ref:"A4",descripcion:"Nota de crédito — devolución parcial",debe:0,haber:50000},
  ],[650000,1250000,1900000]),

  ex("m003","basico","Proveedores — compras a crédito y pagos","Proveedores","acreedor",[
    {ref:"A1",descripcion:"Compra mercadería a crédito",debe:0,haber:900000},
    {ref:"A2",descripcion:"Compra insumos a crédito",debe:0,haber:120000},
    {ref:"A3",descripcion:"Pago parcial proveedor",debe:400000,haber:0},
  ],[400000,1020000,620000]),

  ex("m004","basico","Banco Nación Cuenta Corriente — operaciones de caja","Banco Nación Cuenta Corriente","deudor",[
    {ref:"A1",descripcion:"Depósito de cheque de cliente",debe:750000,haber:0},
    {ref:"A2",descripcion:"Pago de sueldos por débito",debe:0,haber:320000},
    {ref:"A3",descripcion:"Cobro de deudor mediante transferencia",debe:180000,haber:0},
    {ref:"A4",descripcion:"Débito bancario por gastos de mantenimiento",debe:0,haber:8500},
  ],[601500,320000,930000]),

  ex("m005","basico","Mercaderías — compras y costo de ventas","Mercaderías","deudor",[
    {ref:"A1",descripcion:"Compra de mercadería al contado",debe:600000,haber:0},
    {ref:"A2",descripcion:"Compra de mercadería a crédito",debe:400000,haber:0},
    {ref:"A3",descripcion:"Registro de CMV por venta",debe:0,haber:550000},
    {ref:"A4",descripcion:"Devolución de compra a proveedor",debe:0,haber:80000},
  ],[370000,1000000,630000]),

  ex("m006","basico","Sueldos a Pagar — devengamiento y cancelación","Sueldos a Pagar","acreedor",[
    {ref:"A1",descripcion:"Devengamiento sueldos mes",debe:0,haber:250000},
    {ref:"A2",descripcion:"Retenciones de aportes empleados",debe:0,haber:32500},
    {ref:"A3",descripcion:"Pago de haberes netos",debe:217500,haber:0},
  ],[217500,282500,250000]),

  ex("m007","basico","Préstamos Bancarios — obtención y cuotas","Préstamos Bancarios","acreedor",[
    {ref:"A1",descripcion:"Obtención préstamo bancario",debe:0,haber:1500000},
    {ref:"A2",descripcion:"Pago 1° cuota capital",debe:150000,haber:0},
    {ref:"A3",descripcion:"Pago 2° cuota capital",debe:150000,haber:0},
    {ref:"A4",descripcion:"Pago 3° cuota capital",debe:150000,haber:0},
  ],[1050000,1500000,900000]),

  ex("m008","basico","Capital Social — aportes","Capital Social","acreedor",[
    {ref:"A1",descripcion:"Constitución de la sociedad",debe:0,haber:2000000},
    {ref:"A2",descripcion:"Integración segunda cuota de capital",debe:0,haber:500000},
  ],[0,2500000,1500000]),

  ex("m009","basico","IVA Crédito Fiscal — compras del mes","IVA Crédito Fiscal","deudor",[
    {ref:"A1",descripcion:"IVA compra mercadería",debe:189000,haber:0},
    {ref:"A2",descripcion:"IVA compra bienes de uso",debe:126000,haber:0},
    {ref:"A3",descripcion:"IVA servicios recibidos",debe:42000,haber:0},
    {ref:"A4",descripcion:"Compensación con IVA DF al cierre",debe:0,haber:357000},
  ],[0,357000,189000]),

  ex("m010","basico","IVA Débito Fiscal — ventas del mes","IVA Débito Fiscal","acreedor",[
    {ref:"A1",descripcion:"IVA venta N°001",debe:0,haber:210000},
    {ref:"A2",descripcion:"IVA venta N°002",debe:0,haber:157500},
    {ref:"A3",descripcion:"Nota de crédito — anulación parcial",debe:31500,haber:0},
  ],[336000,210000,157500]),

  ex("m011","basico","Documentos a Cobrar — pagarés de clientes","Documentos a Cobrar","deudor",[
    {ref:"A1",descripcion:"Canje crédito por pagaré cliente A",debe:500000,haber:0},
    {ref:"A2",descripcion:"Canje crédito por pagaré cliente B",debe:300000,haber:0},
    {ref:"A3",descripcion:"Cobro al vencimiento cliente A",debe:0,haber:500000},
  ],[300000,800000,500000]),

  ex("m012","basico","Plazo Fijo — constitución y vencimiento","Plazo Fijo","deudor",[
    {ref:"A1",descripcion:"Constitución de plazo fijo",debe:800000,haber:0},
    {ref:"A2",descripcion:"Vencimiento y acreditación capital+intereses",debe:0,haber:800000},
  ],[0,800000,400000]),

  ex("m013","basico","Ventas — ingresos del período","Ventas","acreedor",[
    {ref:"A1",descripcion:"Venta N°001 al contado",debe:0,haber:1200000},
    {ref:"A2",descripcion:"Venta N°002 a crédito",debe:0,haber:850000},
    {ref:"A3",descripcion:"Venta N°003 con tarjeta",debe:0,haber:430000},
    {ref:"A4",descripcion:"Nota de crédito — devolución cliente",debe:95000,haber:0},
  ],[2385000,95000,1200000]),

  ex("m014","basico","Costo de Mercaderías Vendidas (CMV)","Costo de Mercaderías Vendidas (CMV)","deudor",[
    {ref:"A1",descripcion:"CMV venta N°001",debe:700000,haber:0},
    {ref:"A2",descripcion:"CMV venta N°002",debe:480000,haber:0},
    {ref:"A3",descripcion:"CMV venta N°003",debe:250000,haber:0},
  ],[0,1430000,700000]),

  ex("m015","basico","Alquileres a Pagar — devengamiento mensual","Alquileres a Pagar","acreedor",[
    {ref:"A1",descripcion:"Devengamiento alquiler enero",debe:0,haber:150000},
    {ref:"A2",descripcion:"Pago alquiler enero",debe:150000,haber:0},
    {ref:"A3",descripcion:"Devengamiento alquiler febrero",debe:0,haber:150000},
    {ref:"A4",descripcion:"Devengamiento alquiler marzo",debe:0,haber:150000},
    {ref:"A5",descripcion:"Pago alquiler feb+mar",debe:300000,haber:0},
  ],[0,450000,150000]),

  ex("m016","basico","Fondo Fijo — caja chica","Fondo Fijo","deudor",[
    {ref:"A1",descripcion:"Constitución fondo fijo",debe:50000,haber:0},
    {ref:"A2",descripcion:"Recomposición fondo fijo",debe:50000,haber:0},
    {ref:"A3",descripcion:"Recomposición fondo fijo",debe:50000,haber:0},
  ],[0,50000,100000]),

  ex("m017","basico","Intereses Ganados — devengamiento","Intereses Ganados","acreedor",[
    {ref:"A1",descripcion:"Intereses plazo fijo enero",debe:0,haber:48000},
    {ref:"A2",descripcion:"Intereses plazo fijo febrero",debe:0,haber:48000},
    {ref:"A3",descripcion:"Intereses plazo fijo marzo",debe:0,haber:48000},
  ],[0,144000,48000]),

  ex("m018","basico","Cargas Sociales a Pagar — patronales","Cargas Sociales a Pagar","acreedor",[
    {ref:"A1",descripcion:"Devengamiento cargas patronales enero",debe:0,haber:87500},
    {ref:"A2",descripcion:"Depósito AFIP enero",debe:87500,haber:0},
    {ref:"A3",descripcion:"Devengamiento cargas patronales febrero",debe:0,haber:87500},
  ],[87500,175000,0]),

  ex("m019","basico","Anticipo Impuesto a las Ganancias","Anticipo Impuesto a las Ganancias","deudor",[
    {ref:"A1",descripcion:"Anticipo 1° cuota ganancias",debe:120000,haber:0},
    {ref:"A2",descripcion:"Anticipo 2° cuota ganancias",debe:120000,haber:0},
    {ref:"A3",descripcion:"Anticipo 3° cuota ganancias",debe:120000,haber:0},
    {ref:"A4",descripcion:"Imputación contra impuesto determinado",debe:0,haber:360000},
  ],[0,360000,120000]),

  ex("m020","basico","Seguros Pagados por Adelantado","Seguros Pagados por Adelantado","deudor",[
    {ref:"A1",descripcion:"Pago prima seguro anual",debe:240000,haber:0},
    {ref:"A2",descripcion:"Devengamiento porción enero",debe:0,haber:20000},
    {ref:"A3",descripcion:"Devengamiento porción febrero",debe:0,haber:20000},
    {ref:"A4",descripcion:"Devengamiento porción marzo",debe:0,haber:20000},
  ],[180000,240000,60000]),

  ex("m021","basico","Ingresos Brutos (IIBB) — gasto impositivo","Ingresos Brutos (IIBB)","deudor",[
    {ref:"A1",descripcion:"IIBB enero sobre ventas $1.200.000",debe:36000,haber:0},
    {ref:"A2",descripcion:"IIBB febrero sobre ventas $950.000",debe:28500,haber:0},
    {ref:"A3",descripcion:"IIBB marzo sobre ventas $1.100.000",debe:33000,haber:0},
  ],[0,97500,28500]),

  ex("m022","basico","Sueldos y Jornales — gasto del período","Sueldos y Jornales","deudor",[
    {ref:"A1",descripcion:"Sueldos brutos enero",debe:380000,haber:0},
    {ref:"A2",descripcion:"Sueldos brutos febrero",debe:380000,haber:0},
    {ref:"A3",descripcion:"Sueldos brutos marzo — con aumento 5%",debe:399000,haber:0},
  ],[0,1159000,380000]),

  ex("m023","basico","Reserva Legal — distribución de ganancias","Reserva Legal","acreedor",[
    {ref:"A1",descripcion:"Constitución reserva legal ejercicio anterior",debe:0,haber:85000},
    {ref:"A2",descripcion:"Constitución reserva legal ejercicio actual",debe:0,haber:113500},
  ],[0,198500,85000]),

  ex("m024","basico","Intereses a Pagar — devengamiento préstamo","Intereses a Pagar","acreedor",[
    {ref:"A1",descripcion:"Devengamiento intereses enero",debe:0,haber:45000},
    {ref:"A2",descripcion:"Devengamiento intereses febrero",debe:0,haber:45000},
    {ref:"A3",descripcion:"Pago intereses enero y febrero",debe:90000,haber:0},
    {ref:"A4",descripcion:"Devengamiento intereses marzo",debe:0,haber:45000},
  ],[45000,90000,90000]),

  ex("m025","basico","Provisión Aguinaldo (SAC) — acumulación","Provisión Aguinaldo (SAC)","acreedor",[
    {ref:"A1",descripcion:"Provisión SAC enero",debe:0,haber:31667},
    {ref:"A2",descripcion:"Provisión SAC febrero",debe:0,haber:31667},
    {ref:"A3",descripcion:"Provisión SAC marzo",debe:0,haber:31667},
    {ref:"A4",descripcion:"Provisión SAC abril",debe:0,haber:31667},
    {ref:"A5",descripcion:"Provisión SAC mayo",debe:0,haber:31667},
    {ref:"A6",descripcion:"Pago SAC junio — liquidación",debe:158335,haber:0},
  ],[32001,31667,0]),

  ex("m026","basico","Gastos de Publicidad y Propaganda","Gastos de Publicidad y Propaganda","deudor",[
    {ref:"A1",descripcion:"Campaña digital mes 1",debe:180000,haber:0},
    {ref:"A2",descripcion:"Campaña digital mes 2",debe:180000,haber:0},
    {ref:"A3",descripcion:"Aviso en diario local",debe:45000,haber:0},
  ],[0,405000,180000]),

  ex("m027","basico","Honorarios Contables y Legales","Honorarios Contables y Legales","deudor",[
    {ref:"A1",descripcion:"Honorarios contador Q1",debe:90000,haber:0},
    {ref:"A2",descripcion:"Honorarios contador Q2",debe:90000,haber:0},
    {ref:"A3",descripcion:"Honorarios abogado — consultoría",debe:120000,haber:0},
  ],[0,300000,90000]),

  ex("m028","basico","Gastos de Luz, Gas y Agua","Gastos de Luz, Gas y Agua","deudor",[
    {ref:"A1",descripcion:"Factura electricidad enero",debe:28000,haber:0},
    {ref:"A2",descripcion:"Factura gas enero",debe:12000,haber:0},
    {ref:"A3",descripcion:"Factura electricidad febrero",debe:31000,haber:0},
    {ref:"A4",descripcion:"Factura gas febrero",debe:13500,haber:0},
  ],[0,84500,28000]),

  ex("m029","basico","Deudores Morosos — reclasificación","Deudores Morosos","deudor",[
    {ref:"A1",descripcion:"Reclasificación cliente A a moroso",debe:200000,haber:0},
    {ref:"A2",descripcion:"Reclasificación cliente B a moroso",debe:150000,haber:0},
    {ref:"A3",descripcion:"Cobro extrajudicial cliente A",debe:0,haber:200000},
  ],[150000,350000,200000]),

  ex("m030","basico","Resultados No Asignados (RNA)","Resultados No Asignados","acreedor",[
    {ref:"A1",descripcion:"Saldo inicial RNA — pérdida acumulada",debe:300000,haber:0},
    {ref:"A2",descripcion:"Absorción resultado del ejercicio positivo",debe:0,haber:567250},
  ],[267250,300000,567250]),

  // ─── INTERMEDIOS ─────────────────────────────────────────────────────────
  ex("m031","intermedio","Caja — mes completo empresa comercial","Caja","deudor",[
    {ref:"A1",descripcion:"Saldo inicial del mes",debe:450000,haber:0},
    {ref:"A2",descripcion:"Cobranza al contado ventas semana 1",debe:820000,haber:0},
    {ref:"A3",descripcion:"Pago proveedores facturas vencidas",debe:0,haber:600000},
    {ref:"A4",descripcion:"Cobranza al contado ventas semana 2",debe:940000,haber:0},
    {ref:"A5",descripcion:"Pago sueldos y cargas sociales",debe:0,haber:380000},
    {ref:"A6",descripcion:"Cobranza al contado ventas semana 3",debe:760000,haber:0},
    {ref:"A7",descripcion:"Pago servicios e impuestos",debe:0,haber:145000},
    {ref:"A8",descripcion:"Depósito en banco para pago",debe:0,haber:1000000},
  ],[845000,2970000,1125000]),

  ex("m032","intermedio","IVA — posición fiscal del mes","IVA Débito Fiscal","acreedor",[
    {ref:"A1",descripcion:"IVA DF venta 1 ($1.050.000 × 21%)",debe:0,haber:220500},
    {ref:"A2",descripcion:"IVA DF venta 2 ($850.000 × 21%)",debe:0,haber:178500},
    {ref:"A3",descripcion:"IVA DF venta 3 ($620.000 × 21%)",debe:0,haber:130200},
    {ref:"A4",descripcion:"NC — devolución cliente ($100.000 × 21%)",debe:21000,haber:0},
  ],[508200,21000,178500]),

  ex("m033","intermedio","IVA Crédito Fiscal — posición compradora","IVA Crédito Fiscal","deudor",[
    {ref:"A1",descripcion:"IVA CF compra mercadería grande",debe:252000,haber:0},
    {ref:"A2",descripcion:"IVA CF compra insumos",debe:63000,haber:0},
    {ref:"A3",descripcion:"IVA CF servicios tercerizados",debe:42000,haber:0},
    {ref:"A4",descripcion:"Compensación DF contra CF al presentar DDJJ",debe:0,haber:357000},
  ],[0,357000,252000]),

  ex("m034","intermedio","Clientes — empresa con alta rotación","Clientes","deudor",[
    {ref:"A1",descripcion:"Venta crédito semana 1",debe:1200000,haber:0},
    {ref:"A2",descripcion:"Cobro semana 1",debe:0,haber:1000000},
    {ref:"A3",descripcion:"Venta crédito semana 2",debe:850000,haber:0},
    {ref:"A4",descripcion:"Cobro semana 2 — parcial",debe:0,haber:700000},
    {ref:"A5",descripcion:"Venta crédito semana 3",debe:960000,haber:0},
    {ref:"A6",descripcion:"Nota de crédito descuento comercial",debe:0,haber:96000},
    {ref:"A7",descripcion:"Cobro semana 3",debe:0,haber:864000},
  ],[350000,3010000,2050000]),

  ex("m035","intermedio","Amortizaciones de Bienes de Uso — rodados","Amortizaciones de Bienes de Uso","deudor",[
    {ref:"A1",descripcion:"Amortización rodado A — año 1",debe:120000,haber:0},
    {ref:"A2",descripcion:"Amortización inmueble — año 1",debe:50000,haber:0},
    {ref:"A3",descripcion:"Amortización equipos computación — año 1",debe:180000,haber:0},
    {ref:"A4",descripcion:"Amortización rodado A — año 2",debe:120000,haber:0},
    {ref:"A5",descripcion:"Amortización inmueble — año 2",debe:50000,haber:0},
  ],[0,520000,180000]),

  ex("m036","intermedio","Previsión para Deudores Incobrables — regularizador","Previsión para Deudores Incobrables","acreedor",[
    {ref:"A1",descripcion:"Constitución previsión año anterior",debe:0,haber:80000},
    {ref:"A2",descripcion:"Constitución previsión año actual",debe:0,haber:25000},
    {ref:"A3",descripcion:"Castigo deudor incobrable — aplicación previsión",debe:80000,haber:0},
  ],[25000,80000,25000]),

  ex("m037","intermedio","Banco — con saldo en descubierto (acreedor)","Banco Nación Cuenta Corriente","acreedor",[
    {ref:"A1",descripcion:"Saldo inicial cuenta corriente",debe:200000,haber:0},
    {ref:"A2",descripcion:"Débito automático proveedores",debe:0,haber:500000},
    {ref:"A3",descripcion:"Acreditación transferencia cliente",debe:0,haber:150000},
    {ref:"A4",descripcion:"Débito débito automático impuestos",debe:0,haber:120000},
  ],[130000,200000,500000]),

  ex("m038","intermedio","Rodados — valor neto contable","Rodados","deudor",[
    {ref:"A1",descripcion:"Compra camioneta",debe:3600000,haber:0},
    {ref:"A2",descripcion:"Amort. acumulada año 1 (20%)",debe:0,haber:720000},
    {ref:"A3",descripcion:"Amort. acumulada año 2 (20%)",debe:0,haber:720000},
    {ref:"A4",descripcion:"Amort. acumulada año 3 (20%)",debe:0,haber:720000},
  ],[1440000,3600000,2160000]),

  ex("m039","intermedio","Acreedores Varios — servicios del trimestre","Acreedores Varios","acreedor",[
    {ref:"A1",descripcion:"Servicio limpieza enero a crédito",debe:0,haber:45000},
    {ref:"A2",descripcion:"Servicio seguridad enero",debe:0,haber:85000},
    {ref:"A3",descripcion:"Pago limpieza enero",debe:45000,haber:0},
    {ref:"A4",descripcion:"Servicio limpieza febrero",debe:0,haber:45000},
    {ref:"A5",descripcion:"Pago seguridad enero",debe:85000,haber:0},
    {ref:"A6",descripcion:"Servicio seguridad febrero",debe:0,haber:85000},
  ],[130000,130000,85000]),

  ex("m040","intermedio","Ingresos por Servicios — empresa de consultoría","Ventas de Servicios","acreedor",[
    {ref:"A1",descripcion:"Honorarios proyecto A — enero",debe:0,haber:420000},
    {ref:"A2",descripcion:"Honorarios proyecto B — enero",debe:0,haber:350000},
    {ref:"A3",descripcion:"Honorarios proyecto A — febrero",debe:0,haber:420000},
    {ref:"A4",descripcion:"NC — ajuste factura proyecto B",debe:35000,haber:0},
    {ref:"A5",descripcion:"Honorarios proyecto C — febrero",debe:0,haber:280000},
    {ref:"A6",descripcion:"Honorarios proyecto A — marzo",debe:0,haber:420000},
  ],[1855000,35000,420000]),

  ex("m041","intermedio","Provisión Impuesto a las Ganancias","Provisión Impuesto a las Ganancias","acreedor",[
    {ref:"A1",descripcion:"Provisión impuesto 1° trimestre",debe:0,haber:142500},
    {ref:"A2",descripcion:"Pago anticipo AFIP — imputa contra provisión",debe:120000,haber:0},
    {ref:"A3",descripcion:"Provisión impuesto 2° trimestre",debe:0,haber:142500},
    {ref:"A4",descripcion:"Pago anticipo AFIP 2° trimestre",debe:120000,haber:0},
    {ref:"A5",descripcion:"Provisión impuesto 3° trimestre",debe:0,haber:142500},
  ],[285000,240000,142500]),

  ex("m042","intermedio","Documentos a Pagar — pagarés emitidos","Documentos a Pagar","acreedor",[
    {ref:"A1",descripcion:"Emisión pagaré proveedor A",debe:0,haber:800000},
    {ref:"A2",descripcion:"Emisión pagaré proveedor B",debe:0,haber:600000},
    {ref:"A3",descripcion:"Cancelación pagaré proveedor A al vencimiento",debe:800000,haber:0},
    {ref:"A4",descripcion:"Renovación parcial pagaré proveedor B",debe:200000,haber:0},
  ],[400000,800000,600000]),

  ex("m043","intermedio","Gastos Bancarios — comisiones y mantenimiento","Gastos Bancarios","deudor",[
    {ref:"A1",descripcion:"Comisión mantenimiento cuenta enero",debe:8500,haber:0},
    {ref:"A2",descripcion:"Comisión transferencias enero",debe:3200,haber:0},
    {ref:"A3",descripcion:"Comisión mantenimiento cuenta febrero",debe:8500,haber:0},
    {ref:"A4",descripcion:"Comisión negociación cheque diferido",debe:12000,haber:0},
    {ref:"A5",descripcion:"Comisión mantenimiento cuenta marzo",debe:8500,haber:0},
  ],[0,40700,8500]),

  ex("m044","intermedio","Anticipo a Proveedores — compra de importación","Anticipo a Proveedores","deudor",[
    {ref:"A1",descripcion:"Anticipo 30% importación maquinaria",debe:540000,haber:0},
    {ref:"A2",descripcion:"Anticipo adicional 20% por ajuste de precio",debe:360000,haber:0},
    {ref:"A3",descripcion:"Imputación anticipo a la factura final",debe:0,haber:900000},
  ],[0,900000,540000]),

  ex("m045","intermedio","Acciones con Cotización — inversión transitoria","Acciones con Cotización","deudor",[
    {ref:"A1",descripcion:"Compra acciones YPF",debe:1200000,haber:0},
    {ref:"A2",descripcion:"Compra acciones Banco Macro",debe:800000,haber:0},
    {ref:"A3",descripcion:"Venta acciones YPF (valor libro)",debe:0,haber:1200000},
    {ref:"A4",descripcion:"Compra acciones Pampa Energía",debe:650000,haber:0},
  ],[450000,1200000,800000]),

  ex("m046","intermedio","Resultado del Ejercicio — cierre trimestral","Resultado del Ejercicio","acreedor",[
    {ref:"A1",descripcion:"Traspaso ventas al cierre",debe:0,haber:3500000},
    {ref:"A2",descripcion:"Traspaso otros ingresos al cierre",debe:0,haber:145000},
    {ref:"A3",descripcion:"Traspaso CMV al cierre",debe:2100000,haber:0},
    {ref:"A4",descripcion:"Traspaso sueldos al cierre",debe:760000,haber:0},
    {ref:"A5",descripcion:"Traspaso amortizaciones al cierre",debe:185000,haber:0},
  ],[600000,3145000,2100000]),

  ex("m047","intermedio","Diferencia de Cambio Positiva — tenencia USD","Diferencia de Cambio Positiva","acreedor",[
    {ref:"A1",descripcion:"Dcambio positiva enero — deuda en USD",debe:0,haber:85000},
    {ref:"A2",descripcion:"Dcambio positiva febrero",debe:0,haber:110000},
    {ref:"A3",descripcion:"Ajuste valuación plazo fijo en USD",debe:0,haber:65000},
  ],[0,260000,85000]),

  ex("m048","intermedio","Flete y Transporte de Ventas","Flete y Transporte de Ventas","deudor",[
    {ref:"A1",descripcion:"Flete despacho lote enero",debe:45000,haber:0},
    {ref:"A2",descripcion:"Flete urgente cliente VIP",debe:18000,haber:0},
    {ref:"A3",descripcion:"Flete mensual contrato logística",debe:85000,haber:0},
    {ref:"A4",descripcion:"Flete despacho lote febrero",debe:45000,haber:0},
    {ref:"A5",descripcion:"Flete mensual contrato logística",debe:85000,haber:0},
  ],[0,278000,85000]),

  ex("m049","intermedio","Previsión para Indemnizaciones","Previsión para Indemnizaciones","acreedor",[
    {ref:"A1",descripcion:"Constitución previsión despido empleado A",debe:0,haber:180000},
    {ref:"A2",descripcion:"Constitución previsión despido empleado B",debe:0,haber:250000},
    {ref:"A3",descripcion:"Pago efectivo indemnización empleado A",debe:180000,haber:0},
    {ref:"A4",descripcion:"Constitución previsión empleado C",debe:0,haber:320000},
  ],[570000,180000,320000]),

  ex("m050","intermedio","Comisiones a Vendedores — mes activo","Comisiones a Vendedores","deudor",[
    {ref:"A1",descripcion:"Comisiones vendedor A enero",debe:85000,haber:0},
    {ref:"A2",descripcion:"Comisiones vendedor B enero",debe:62000,haber:0},
    {ref:"A3",descripcion:"Comisiones vendedor A febrero",debe:91000,haber:0},
    {ref:"A4",descripcion:"Comisiones vendedor B febrero",debe:58000,haber:0},
    {ref:"A5",descripcion:"Ajuste negativo comisiones — devoluciones",debe:0,haber:15000},
  ],[281000,85000,62000]),

  // ─── AVANZADOS ────────────────────────────────────────────────────────────
  ex("m051","avanzado","Amortización Acumulada Inmuebles — 5 años","Amortización Acumulada Inmuebles","acreedor",[
    {ref:"A1",descripcion:"Amort. inmueble año 1 (2% valor $5.000.000)",debe:0,haber:100000},
    {ref:"A2",descripcion:"Amort. inmueble año 2",debe:0,haber:100000},
    {ref:"A3",descripcion:"Amort. inmueble año 3",debe:0,haber:100000},
    {ref:"A4",descripcion:"Amort. inmueble año 4",debe:0,haber:100000},
    {ref:"A5",descripcion:"Amort. inmueble año 5",debe:0,haber:100000},
  ],[0,500000,100000]),

  ex("m052","avanzado","Banco — conciliación fin de mes","Banco Nación Cuenta Corriente","deudor",[
    {ref:"A1",descripcion:"Saldo inicial según libros",debe:1250000,haber:0},
    {ref:"A2",descripcion:"Depósito cobro cliente por transferencia",debe:890000,haber:0},
    {ref:"A3",descripcion:"Débito pago proveedor por home banking",debe:0,haber:650000},
    {ref:"A4",descripcion:"Cheque N°4521 emitido aún no presentado",debe:0,haber:320000},
    {ref:"A5",descripcion:"Acreditación nota de crédito banco",debe:45000,haber:0},
    {ref:"A6",descripcion:"Comisión mantenimiento débito automático",debe:0,haber:8500},
    {ref:"A7",descripcion:"Depósito cobro cliente efectivo",debe:430000,haber:0},
    {ref:"A8",descripcion:"Débito impuesto a los débitos y créditos",debe:0,haber:6500},
  ],[1630000,2185000,1636000]),

  ex("m053","avanzado","Inmuebles — alta, mejoras y baja parcial","Inmuebles","deudor",[
    {ref:"A1",descripcion:"Compra inmueble sede central",debe:8000000,haber:0},
    {ref:"A2",descripcion:"Obras de refacción capitalizadas",debe:1200000,haber:0},
    {ref:"A3",descripcion:"Ajuste revalúo técnico",debe:2500000,haber:0},
    {ref:"A4",descripcion:"Venta de una unidad (valor libro)",debe:0,haber:3600000},
  ],[8100000,8000000,2500000]),

  ex("m054","avanzado","Resultado del Ejercicio — cierre anual completo","Resultado del Ejercicio","acreedor",[
    {ref:"A1",descripcion:"Traspaso ventas totales del ejercicio",debe:0,haber:12500000},
    {ref:"A2",descripcion:"Traspaso otros ingresos",debe:0,haber:485000},
    {ref:"A3",descripcion:"Traspaso CMV total",debe:7200000,haber:0},
    {ref:"A4",descripcion:"Traspaso gastos de comercialización",debe:1850000,haber:0},
    {ref:"A5",descripcion:"Traspaso gastos de administración",debe:1420000,haber:0},
    {ref:"A6",descripcion:"Traspaso gastos financieros",debe:380000,haber:0},
    {ref:"A7",descripcion:"Traspaso impuesto a las ganancias",debe:567250,haber:0},
  ],[1567750,11480000,7200000]),

  ex("m055","avanzado","Mercaderías — empresa con alta rotación trimestral","Mercaderías","deudor",[
    {ref:"A1",descripcion:"Stock inicial del trimestre",debe:2400000,haber:0},
    {ref:"A2",descripcion:"Compra lote enero",debe:1800000,haber:0},
    {ref:"A3",descripcion:"CMV enero",debe:0,haber:1600000},
    {ref:"A4",descripcion:"Compra lote febrero",debe:2100000,haber:0},
    {ref:"A5",descripcion:"CMV febrero",debe:0,haber:1900000},
    {ref:"A6",descripcion:"Devolución compra proveedor",debe:0,haber:200000},
    {ref:"A7",descripcion:"Compra lote marzo",debe:1650000,haber:0},
    {ref:"A8",descripcion:"CMV marzo",debe:0,haber:1750000},
    {ref:"A9",descripcion:"Ajuste por desvalorización inventario",debe:0,haber:150000},
  ],[2350000,7950000,3600000]),

  ex("m056","avanzado","Capital Social — historia de aumentos","Capital Social","acreedor",[
    {ref:"A1",descripcion:"Constitución sociedad",debe:0,haber:1000000},
    {ref:"A2",descripcion:"Aumento de capital — suscripción",debe:0,haber:500000},
    {ref:"A3",descripcion:"Capitalización de reserva facultativa",debe:0,haber:800000},
    {ref:"A4",descripcion:"Aumento capital — nuevos socios",debe:0,haber:1200000},
  ],[0,3500000,1000000]),

  ex("m057","avanzado","Préstamos Bancarios — largo plazo con cuotas","Préstamos Bancarios","acreedor",[
    {ref:"A1",descripcion:"Préstamo hipotecario recibido",debe:0,haber:10000000},
    {ref:"A2",descripcion:"Cuota 1 — amortización capital",debe:250000,haber:0},
    {ref:"A3",descripcion:"Cuota 2 — amortización capital",debe:250000,haber:0},
    {ref:"A4",descripcion:"Cuota 3 — amortización capital",debe:250000,haber:0},
    {ref:"A5",descripcion:"Pago anticipado parcial",debe:500000,haber:0},
    {ref:"A6",descripcion:"Cuota 4 — amortización capital",debe:250000,haber:0},
  ],[8500000,1500000,10000000]),

  ex("m058","avanzado","Clientes + Previsión — visión neta","Clientes","deudor",[
    {ref:"A1",descripcion:"Ventas a crédito Q1",debe:4500000,haber:0},
    {ref:"A2",descripcion:"Cobranzas Q1",debe:0,haber:3800000},
    {ref:"A3",descripcion:"Ventas a crédito Q2",debe:5200000,haber:0},
    {ref:"A4",descripcion:"Cobranzas Q2",debe:0,haber:4600000},
    {ref:"A5",descripcion:"Reclasificación morosos",debe:0,haber:350000},
    {ref:"A6",descripcion:"Notas de crédito — descuentos pronto pago",debe:0,haber:195000},
  ],[755000,9700000,5350000]),

  ex("m059","avanzado","Equipos de Computación — ciclo completo","Equipos de Computación","deudor",[
    {ref:"A1",descripcion:"Compra servidores",debe:2400000,haber:0},
    {ref:"A2",descripcion:"Compra notebooks equipo comercial",debe:1800000,haber:0},
    {ref:"A3",descripcion:"Amortización acumulada año 1 (33%)",debe:0,haber:1386000},
    {ref:"A4",descripcion:"Baja equipo obsoleto — valor libro residual",debe:0,haber:180000},
    {ref:"A5",descripcion:"Amortización acumulada año 2",debe:0,haber:1386000},
  ],[1248000,4200000,2772000]),

  ex("m060","avanzado","Reserva Facultativa — dinámica multianual","Reserva Facultativa","acreedor",[
    {ref:"A1",descripcion:"Constitución reserva ejercicio 2022",debe:0,haber:250000},
    {ref:"A2",descripcion:"Constitución reserva ejercicio 2023",debe:0,haber:380000},
    {ref:"A3",descripcion:"Desafectación parcial para absorber pérdida",debe:200000,haber:0},
    {ref:"A4",descripcion:"Constitución reserva ejercicio 2024",debe:0,haber:420000},
    {ref:"A5",descripcion:"Capitalización de reserva",debe:380000,haber:0},
  ],[470000,580000,420000]),
];

// Fix distractors: remove any that equal saldo_final
for (const e of data) {
  e.opciones_distractor = e.opciones_distractor
    .filter((d) => d !== e.saldo_final)
    .slice(0, 3);
  // Pad if needed
  const alternates = [
    Math.round(e.saldo_final * 0.8),
    Math.round(e.saldo_final * 1.2),
    e.saldo_debe,
    e.saldo_haber,
    Math.abs(e.saldo_debe - e.saldo_haber - 1),
  ].filter((d) => d !== e.saldo_final && !e.opciones_distractor.includes(d));
  while (e.opciones_distractor.length < 3) {
    e.opciones_distractor.push(alternates.shift() ?? e.saldo_final + 1000);
  }
  e.opciones_distractor = e.opciones_distractor.slice(0, 3);
}

const fs = require("fs");
fs.writeFileSync(
  "public/data/mayor.json",
  JSON.stringify(data, null, 2),
  "utf8"
);
console.log(`Written ${data.length} exercises to public/data/mayor.json`);

// Verify math
let errors = 0;
for (const e of data) {
  const sd = e.asientos.reduce((s, a) => s + a.debe, 0);
  const sh = e.asientos.reduce((s, a) => s + a.haber, 0);
  const sf = e.tipo_saldo === "deudor" ? sd - sh : sh - sd;
  if (Math.abs(sd - e.saldo_debe) > 1 || Math.abs(sh - e.saldo_haber) > 1 || Math.abs(sf - e.saldo_final) > 1) {
    console.error(`MATH ERROR in ${e.id}: computed sd=${sd} sh=${sh} sf=${sf} vs stored sd=${e.saldo_debe} sh=${e.saldo_haber} sf=${e.saldo_final}`);
    errors++;
  }
}
if (errors === 0) console.log("All math verified OK");
