/**
 * Controlador para generar y subir fotos de perfil con IA
 * Usa Hugging Face o API de generación de imágenes
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Genera una foto de perfil usando IA basada en descripción
 * 
 * Body:
 * - firstName: string
 * - lastName: string
 * - specialty?: string (para especialistas)
 * - gender?: 'male' | 'female' | 'neutral'
 */
export const generateProfilePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado'
        }
      });
      return;
    }

    const { firstName, lastName, specialty, gender = 'neutral' } = req.body;

    if (!firstName || !lastName) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Se requieren firstName y lastName'
        }
      });
      return;
    }

    // Prompt para generar foto profesional 
    const prompt = `Professional portrait photo of a ${gender} person named ${firstName} ${lastName}${
      specialty ? ` who is a ${specialty}` : ''
    }. Professional headshot, medical professional dress code, studio lighting, white background, 256x256px, high quality`;

    const hfApiKey = process.env.HUGGING_FACE_API_KEY;
    const hfModel = process.env.HUGGING_FACE_MODEL || 'stabilityai/stable-diffusion-2-1';

    if (!hfApiKey) {
      const fallbackPhotoUrl = generateAvatarWithInitials(firstName, lastName);
      res.json({
        success: true,
        data: {
          photoUrl: fallbackPhotoUrl,
          prompt,
          usage: 'Avatar con iniciales generado como fallback',
          warning: 'HUGGING_FACE_API_KEY no configurada'
        }
      });
      return;
    }

    try {
      const huggingFaceResponse = await fetch(
        `https://api-inference.huggingface.co/models/${hfModel}`,
        {
          headers: {
            Authorization: `Bearer ${hfApiKey}`,
            Accept: 'image/png'
          },
          method: 'POST',
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!huggingFaceResponse.ok) {
        const errorText = await huggingFaceResponse.text();
        const status = huggingFaceResponse.status;
        const statusText = huggingFaceResponse.statusText;
        throw new Error(`Hugging Face API error: ${status} ${statusText} ${errorText}`);
      }

      const imageBuffer = await huggingFaceResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const photoUrl = `data:image/png;base64,${base64Image}`;

      res.json({
        success: true,
        data: {
          photoUrl,
          prompt,
          usage: 'Foto generada con IA - Puedes usar esta imagen como tu foto de perfil'
        }
      });
    } catch (aiError) {
      console.warn('Error generando imagen con IA:', aiError);

      const fallbackPhotoUrl = generateAvatarWithInitials(firstName, lastName);

      res.json({
        success: true,
        data: {
          photoUrl: fallbackPhotoUrl,
          prompt,
          usage: 'Avatar con iniciales generado como fallback',
          warning: 'La IA no estuvo disponible; se genero un avatar con iniciales.'
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Genera un avatar simple con las iniciales del usuario
 */
function generateAvatarWithInitials(firstName: string, lastName: string): string {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const colors = [
    '#00875F', // Verde Maria Vita
    '#353080', // Azul Maria Vita
    '#6EBD96', // Verde claro
    '#5F59A8', // Azul claro
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // SVG avatar con iniciales
  const svg = `
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" fill="${color}"/>
      <text 
        x="128" 
        y="145" 
        font-size="80" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        font-family="Arial, sans-serif"
      >
        ${initials}
      </text>
    </svg>
  `;

  const base64Svg = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64Svg}`;
}

/**
 * Sube una foto de perfil (enviada por el usuario)
 */
export const uploadProfilePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado'
        }
      });
      return;
    }

    // TODO: Implementar subida de archivo real al servidor o S3
    // Por ahora, se espera que el frontend envíe la foto en base64

    const { photoBase64 } = req.body;

    if (!photoBase64) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Se requiere photoBase64'
        }
      });
      return;
    }

    // Validar que sea una imagen válida
    if (!photoBase64.startsWith('data:image/')) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FORMAT',
          message: 'Formato de imagen inválido'
        }
      });
      return;
    }

    res.json({
      success: true,
      data: {
        photoUrl: photoBase64,
        message: 'La foto será guardada cuando completes tu perfil'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mejora una foto de perfil enviada por el usuario usando IA (image-to-image)
 */
export const enhanceProfilePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado'
        }
      });
      return;
    }

    const { photoBase64 } = req.body;

    if (!photoBase64) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Se requiere photoBase64'
        }
      });
      return;
    }

    if (!photoBase64.startsWith('data:image/')) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FORMAT',
          message: 'Formato de imagen inválido'
        }
      });
      return;
    }

    // TODO: AI processing disponible después
    // Por ahora, simplemente guardar la foto original
    // const replicateToken = process.env.REPLICATE_API_TOKEN;
    // const useControlNet = process.env.USE_CONTROLNET === 'true';

    // Guardar foto original por el momento
    res.json({
      success: true,
      data: {
        photoUrl: photoBase64,
        usage: 'Foto de perfil guardada (IA pendiente de activar)',
        isOriginal: true
      }
    });
    return;

    // TODO: Código IA comentado - Activar cuando haya crédito en Replicate
    /*
    try {
      // Try ControlNet-based standardization if enabled
      if (useControlNet) {
        console.log('[MAIN] Attempting ControlNet standardization');
        const standardizedPhoto = await standardizePhotoWithControlNet(
          firstName,
          lastName,
          replicateToken
        );
        if (standardizedPhoto) {
          res.json({
            success: true,
            data: {
              photoUrl: standardizedPhoto,
              usage: 'Foto estandarizada con IA'
            }
          });
          return;
        }
      }

      const enhancedPhoto = await enhancePhotoWithImageToImage(
        firstName,
        lastName,
        replicateToken
      );

      res.json({
        success: true,
        data: {
          photoUrl: enhancedPhoto,
          usage: 'Foto mejorada con IA'
        }
      });
    } catch (aiError) {
      console.error('[ENHANCE-ERROR] AI enhancement failed:', aiError);

      res.json({
        success: true,
        data: {
          photoUrl: photoBase64,
          usage: 'IA no disponible; foto original guardada'
        }
      });
    }
    */
  } catch (error) {
    next(error);
  }
};

/**
 * Estandariza una foto de perfil usando Replicate API
 * Genera una foto profesional nueva con especificaciones estándar
 * Intenta encontrar automáticamente la mejor versión disponible del modelo
 */
async function standardizePhotoWithControlNet(
  firstName: string,
  lastName: string,
  replicateToken: string
): Promise<string | null> {
  try {
    const promptName = firstName && lastName ? ` ${firstName} ${lastName}` : '';
    const standardizationPrompt = `Professional medical headshot${promptName} wearing white medical lab coat. Person shown at shoulder height. Blurred hospital or laboratory background. Professional studio lighting. Medical professional appearance. Clean clinical style. Standardized professional photo. Sharp focus on face. Studio quality.`;

    console.log(`[REPLICATE-PHOTO] Starting photo standardization...`);

    // Try to get the latest version of Stable Diffusion model
    const modelsResponse = await fetch(
      'https://api.replicate.com/v1/models/stability-ai/stable-diffusion',
      {
        headers: {
          Authorization: `Token ${replicateToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let versionId = 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21aef6f8238b57b76f0'; // Fallback version

    if (modelsResponse.ok) {
      try {
        const modelInfo = await modelsResponse.json();
        if (modelInfo.latest_version && modelInfo.latest_version.id) {
          versionId = modelInfo.latest_version.id;
          console.log(`[REPLICATE-PHOTO] Using model version: ${versionId.substring(0, 12)}...`);
        }
      } catch (e) {
        console.log('[REPLICATE-PHOTO] Could not fetch latest version, using fallback');
      }
    }

    const response = await fetch(
      'https://api.replicate.com/v1/predictions',
      {
        headers: {
          Authorization: `Token ${replicateToken}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          version: versionId,
          input: {
            prompt: standardizationPrompt,
            negative_prompt: 'casual, blurry, unprofessional, distorted, low quality, amateur',
            num_outputs: 1,
            num_inference_steps: 50,
            guidance_scale: 12.5,
            width: 768,
            height: 768,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[REPLICATE-PHOTO] Photo generation failed: ${response.status} - ${errorText.substring(0, 100)}`);
      return null;
    }

    const result = await response.json();
    console.log(`[REPLICATE-PHOTO] Prediction status: ${result.status}`);

    // Handle async processing - poll for result
    if (result.id) {
      let predictionResult = result;
      let attempts = 0;
      const maxAttempts = 120; // 2 minutes max
      
      while (predictionResult.status !== 'succeeded' && predictionResult.status !== 'failed' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(
          `https://api.replicate.com/v1/predictions/${result.id}`,
          {
            headers: {
              Authorization: `Token ${replicateToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (statusResponse.ok) {
          predictionResult = await statusResponse.json();
          attempts++;
          if (attempts % 10 === 0) {
            console.log(`[REPLICATE-PHOTO] Still processing... (${attempts}s)`);
          }
        }
      }

      if (predictionResult.status === 'succeeded' && predictionResult.output && Array.isArray(predictionResult.output) && predictionResult.output.length > 0) {
        const imageUrl = predictionResult.output[0];
        console.log('[REPLICATE-PHOTO] Image generated successfully');
        try {
          const imgResponse = await fetch(imageUrl);
          const imgBuffer = await imgResponse.arrayBuffer();
          const base64Image = Buffer.from(imgBuffer).toString('base64');
          return `data:image/png;base64,${base64Image}`;
        } catch (fetchErr) {
          console.warn('[REPLICATE-PHOTO] Failed to fetch generated image:', fetchErr);
          return null;
        }
      } else if (predictionResult.status === 'failed') {
        console.warn('[REPLICATE-PHOTO] Prediction failed:', predictionResult.error);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.warn('[REPLICATE-PHOTO] Standardization failed:', error);
    return null;
  }
}

/**
 * Mejora una foto usando generación de imagen con Replicate API
 */
async function enhancePhotoWithImageToImage(
  firstName: string,
  lastName: string,
  replicateToken: string
): Promise<string> {
  const promptName = firstName && lastName ? ` of ${firstName} ${lastName}` : '';
  const prompt = `Professional medical headshot${promptName} WEARING WHITE LAB COAT. Person at shoulder height with shoulders and white medical coat clearly visible. Blurred professional hospital or laboratory background. Clinical professional lighting. High quality professional photography. Medical staff appearance. Sharp focus on face.`;

  const negativePrompt = 'casual, blurry, low quality, bad face, deformed, distorted, unprofessional, watermark, text, amateur, phone photo';

  console.log(`[REPLICATE-FALLBACK] Starting image enhancement...`);

  // Try to get the latest version of Stable Diffusion model
  const modelsResponse = await fetch(
    'https://api.replicate.com/v1/models/stability-ai/stable-diffusion',
    {
      headers: {
        Authorization: `Token ${replicateToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  let versionId = 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21aef6f8238b57b76f0'; // Fallback version

  if (modelsResponse.ok) {
    try {
      const modelInfo = await modelsResponse.json();
      if (modelInfo.latest_version && modelInfo.latest_version.id) {
        versionId = modelInfo.latest_version.id;
        console.log(`[REPLICATE-FALLBACK] Using model version: ${versionId.substring(0, 12)}...`);
      }
    } catch (e) {
      console.log('[REPLICATE-FALLBACK] Could not fetch latest version, using fallback');
    }
  }

  const response = await fetch(
    'https://api.replicate.com/v1/predictions',
    {
      headers: {
        Authorization: `Token ${replicateToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        version: versionId,
        input: {
          prompt: prompt,
          negative_prompt: negativePrompt,
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 12.5,
          width: 768,
          height: 768,
        }
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[REPLICATE-FALLBACK] API Error: ${response.status} - ${errorText.substring(0, 100)}`);
    throw new Error(`Replicate API error: ${response.status}`);
  }

  const result = await response.json();
  console.log(`[REPLICATE-FALLBACK] Prediction created: ${result.id}`);

  // Handle async processing - poll for result
  if (result.id) {
    let predictionResult = result;
    let attempts = 0;
    const maxAttempts = 120;
    
    while (predictionResult.status !== 'succeeded' && predictionResult.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            Authorization: `Token ${replicateToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (statusResponse.ok) {
        predictionResult = await statusResponse.json();
        attempts++;
        if (attempts % 10 === 0) {
          console.log(`[REPLICATE-FALLBACK] Processing (${attempts}s)...`);
        }
      }
    }

    if (predictionResult.status === 'succeeded' && predictionResult.output && Array.isArray(predictionResult.output) && predictionResult.output.length > 0) {
      const imageUrl = predictionResult.output[0];
      const imgResponse = await fetch(imageUrl);
      const imgBuffer = await imgResponse.arrayBuffer();
      const base64Image = Buffer.from(imgBuffer).toString('base64');
      return `data:image/png;base64,${base64Image}`;
    } else if (predictionResult.status === 'failed') {
      console.error('[REPLICATE-FALLBACK] Prediction failed');
      throw new Error(`Prediction failed: ${predictionResult.error || 'Unknown error'}`);
    }
  }

  throw new Error('No output received from Replicate API');
}
