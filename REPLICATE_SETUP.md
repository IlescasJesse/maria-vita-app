# Replicate API Setup Guide

## Step 1: Get Your Free Replicate API Token

1. Visit: https://replicate.com/api
2. Sign up (free account, no credit card required)
3. Copy your API token from the dashboard
4. It will look like: `r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Add Token to .env.local

Open `.env.local` and add:
```
REPLICATE_API_TOKEN=r8_YOUR_TOKEN_HERE
```

## Step 3: Restart Backend

The backend will automatically:
- Detect the Replicate token
- Use ControlNet for standardization (white coat, shoulder height)
- Fallback to SDXL for general enhancement

## What Happens:

1. User uploads profile photo
2. System calls Replicate ControlNet to:
   - Standardize pose (shoulders visible)
   - Add white medical coat (bata blanca)
   - Generate professional hospital/lab background
   - Ensure clinical lighting and appearance

3. Result: Homogeneous professional photos across all staff profiles

## Replicate Models Used:

- **ControlNet**: `chenxwh/controlnet-canny-sd2` - For pose/style control
- **SDXL**: `stability-ai/sdxl` - Fallback high-quality generation

Both models are actively maintained and available on Replicate's free tier.

## Testing:

After adding token, test with:
```bash
curl -X POST http://localhost:5000/api/upload/enhance-profile-photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "photoBase64": "data:image/jpeg;base64,...",
    "firstName": "Jesse",
    "lastName": "Ilescas"
  }'
```
