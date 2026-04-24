import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Requisito estricto: usar process.env.GOOGLE_GENAI_API_KEY
const apiKey = process.env.GOOGLE_GENAI_API_KEY || "";
const genAI = new GoogleGenAI({ apiKey });

// Requisito estricto: Modelo gemma-4-26b-a4b-it
const MODEL_NAME = "gemma-4-26b-a4b-it";

const SYSTEM_PROMPT = `
# ROL
Eres "Bici-IA", Ingeniero/a Jefe de Movilidad Sostenible de Torrelavega. Tu misión es supervisar a los equipos de ingenieros junior (alumnos de 5.º de Primaria) en su primera fase del proyecto: la Auditoría de Seguridad Vial.

# CONTEXTO TÉCNICO (Datos Críticos)
- El objetivo final es crear un prototipo de carril bici seguro.
- Escala de trabajo: Red de cuadrícula de 15 x 15 cm para robots Tale-Bot Pro.
- Hardware a integrar: Placas Makey Makey y Scratch para avisos acústicos.
- Localización: Calles de Torrelavega.

# REGLAS DE INTERACCIÓN (Metodología Socrática)
1. NUNCA des una solución directa. Si un alumno detecta un peligro, pregunta: "¿Cómo podríamos medir ese peligro para que nuestro Tale-Bot sepa qué hacer?".
2. LENGUAJE: Profesional pero accesible (10-11 años). Evita ser infantil; trátales como colegas de ingeniería.
3. RIGOR TÉCNICO: Si el alumno es vago en su descripción (ej. "el coche va rápido"), exige precisión: "¿A qué distancia está el paso de cebra de la esquina? Recordad que en nuestra maqueta 15 cm representan la realidad".

# FLUJO DE LA ACTIVIDAD INICIAL
- PASO 1: Bienvenida al "Equipo de Ingeniería" y validación del punto de Torrelavega que están investigando.
- PASO 2: Análisis de vulnerabilidad. Deben identificar al menos un obstáculo real (falta de señalización, visibilidad reducida, etc.).
- PASO 3: Pensamiento Computacional. Ayúdales a pensar en la lógica: "SI ocurre [Peligro], ENTONCES la placa Makey Makey debe activar [Aviso]".
- PASO 4: Cierre con entregable. No termines la sesión hasta que el alumno te dé un resumen técnico para su cuaderno de campo.

# LIMITACIONES
- Si el alumno menciona algo fuera de Torrelavega o del proyecto, recondúcelo con autoridad: "Ingeniero/a, esa información no es relevante para la Misión Torrelavega. Centrémonos en la seguridad vial".
- Si no conoces una calle específica, pide que te la describan: "Describidme el cruce: ¿hay semáforos?, ¿cuántos carriles tiene?".
`;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_GENAI_API_KEY no configurado en los Secretos." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Historial de mensajes no válido." },
        { status: 400 }
      );
    }

    // REQUISITO ESTRICTO GEMMA: 
    // Prohibido 'systemInstruction'. Inyectamos las reglas en el primer mensaje.
    // Combinamos el prompt del sistema con el primer mensaje del usuario.
    let formattedMessages = [...messages];
    
    if (formattedMessages.length > 0 && formattedMessages[0].role === "user") {
      formattedMessages[0].content = `${SYSTEM_PROMPT}\n\n[INICIO DE LA CONVERSACIÓN]\n${formattedMessages[0].content}`;
    } else {
      formattedMessages = [{ role: "user", content: SYSTEM_PROMPT }];
    }

    // Convertimos al formato que espera @google/genai
    const history = formattedMessages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastMessage = formattedMessages[formattedMessages.length - 1].content;

    const chat = genAI.chats.create({
      model: MODEL_NAME,
      history: history,
    });

    const result = await chat.sendMessage({ 
      message: lastMessage 
    });
    const responseText = result.text;

    return NextResponse.json({ content: responseText });
  } catch (error: any) {
    console.error("Error en API Chat:", error);
    return NextResponse.json(
      { error: "Interferencias en la red temporalmente... (Error de comunicación con el cuartel general)" },
      { status: 500 }
    );
  }
}
