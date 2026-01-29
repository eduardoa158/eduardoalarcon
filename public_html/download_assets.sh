#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/assets/img"
mkdir -p "$TARGET_DIR"

curl -L "https://r2.flowith.net/files/o/1757519356259-digitalsuite_business_brain_index_0%401024x1024.png" -o "$TARGET_DIR/digitalsuite_business_brain.png"
curl -L "https://r2.flowith.net/files/o/1757519349280-modular_scalable_automation_illustration_index_1%401024x1024.png" -o "$TARGET_DIR/modular_scalable_automation.png"
curl -L "https://r2.flowith.net/files/o/1757519378860-financial_consulting_data_analysis_index_2%401024x1024.png" -o "$TARGET_DIR/financial_consulting_data_analysis.png"
curl -L "https://r2.flowith.net/files/o/1757529880961-ai_tools_hub_shared_access_index_2%401024x1024.png" -o "$TARGET_DIR/ai_tools_hub.png"
curl -L "https://r2.flowith.net/files/o/1757529836736-ai_marketing_revolution_brain_index_5%401024x1024.png" -o "$TARGET_DIR/ai_marketing_revolution.png"
curl -L "https://r2.flowith.net/files/o/1757529823761-ai_data_analysis_2025_blog_image_index_4%401024x1024.png" -o "$TARGET_DIR/ai_data_analysis_2025.png"

echo "Descarga completada. Sube la carpeta assets/img a public_html en Hostinger."
