$targetDir = Join-Path $PSScriptRoot "assets/img"
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

Invoke-WebRequest -Uri "https://r2.flowith.net/files/o/1757519356259-digitalsuite_business_brain_index_0%401024x1024.png" -OutFile (Join-Path $targetDir "digitalsuite_business_brain.png")
Invoke-WebRequest -Uri "https://r2.flowith.net/files/o/1757519349280-modular_scalable_automation_illustration_index_1%401024x1024.png" -OutFile (Join-Path $targetDir "modular_scalable_automation.png")
Invoke-WebRequest -Uri "https://r2.flowith.net/files/o/1757519378860-financial_consulting_data_analysis_index_2%401024x1024.png" -OutFile (Join-Path $targetDir "financial_consulting_data_analysis.png")
Invoke-WebRequest -Uri "https://r2.flowith.net/files/o/1757529880961-ai_tools_hub_shared_access_index_2%401024x1024.png" -OutFile (Join-Path $targetDir "ai_tools_hub.png")
Invoke-WebRequest -Uri "https://r2.flowith.net/files/o/1757529836736-ai_marketing_revolution_brain_index_5%401024x1024.png" -OutFile (Join-Path $targetDir "ai_marketing_revolution.png")
Invoke-WebRequest -Uri "https://r2.flowith.net/files/o/1757529823761-ai_data_analysis_2025_blog_image_index_4%401024x1024.png" -OutFile (Join-Path $targetDir "ai_data_analysis_2025.png")

Write-Output "Descarga completada. Sube la carpeta assets/img a public_html en Hostinger."
